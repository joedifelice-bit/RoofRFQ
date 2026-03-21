// send-quote.js — Lead emails with blurred/full/free logic based on Stripe status
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const RESEND_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const SITE_URL = process.env.URL || "https://roofrfq.ca";

async function stripe(endpoint, method, body) {
  const opts = { method, headers: { "Authorization": `Bearer ${STRIPE_KEY}`, "Content-Type": "application/x-www-form-urlencoded" } };
  if (body) opts.body = new URLSearchParams(body).toString();
  return (await fetch(`https://api.stripe.com/v1${endpoint}`, opts)).json();
}

async function getRooferStatus(email) {
  if (!STRIPE_KEY || !email) return { status: "no_stripe", freeUsed: false, cid: null };
  const c = await stripe(`/customers?email=${encodeURIComponent(email)}&limit=1`);
  if (!c.data?.length) return { status: "new", freeUsed: false, cid: null };
  const cust = c.data[0];
  const free = cust.metadata?.free_lead_used === "true";
  const subs = await stripe(`/subscriptions?customer=${cust.id}&status=active&limit=1`);
  if (subs.data?.length) return { status: "subscribed", freeUsed: free, cid: cust.id };
  const trials = await stripe(`/subscriptions?customer=${cust.id}&status=trialing&limit=1`);
  if (trials.data?.length) return { status: "subscribed", freeUsed: free, cid: cust.id };
  return { status: free ? "paywall" : "free", freeUsed: free, cid: cust.id };
}

async function getOrCreateCust(email, name) {
  const e = await stripe(`/customers?email=${encodeURIComponent(email)}&limit=1`);
  if (e.data?.length) return e.data[0];
  return stripe("/customers", "POST", { email, name, "metadata[source]": "roofrfq" });
}

function fullEmail(roofer, cust, proj, budget, ts) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:24px 16px;">
<div style="background:#1e3a5f;border-radius:14px 14px 0 0;padding:28px 32px;text-align:center;">
<h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;">New Lead from RoofRFQ</h1>
<p style="margin:8px 0 0;color:rgba(255,255,255,.65);font-size:13px;">A building owner is looking for a flat roof replacement quote</p></div>
<div style="background:#fff;padding:32px;border:1px solid #e7e5e4;border-top:none;">
<h2 style="margin:0 0 12px;font-size:14px;color:#1e3a5f;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Customer Details</h2>
<table style="width:100%;border-collapse:collapse;">
<tr><td style="padding:8px 0;color:#57534e;font-size:13px;width:120px">Name</td><td style="padding:8px 0;color:#1c1917;font-size:14px;font-weight:600">${cust.name}</td></tr>
${cust.company?`<tr><td style="padding:8px 0;color:#57534e;font-size:13px">Company</td><td style="padding:8px 0;color:#1c1917;font-size:14px">${cust.company}</td></tr>`:""}
<tr><td style="padding:8px 0;color:#57534e;font-size:13px">Email</td><td style="padding:8px 0"><a href="mailto:${cust.email}" style="color:#2563eb;font-size:14px;font-weight:600;text-decoration:none">${cust.email}</a></td></tr>
<tr><td style="padding:8px 0;color:#57534e;font-size:13px">Phone</td><td style="padding:8px 0"><a href="tel:${cust.phone}" style="color:#2563eb;font-size:14px;font-weight:600;text-decoration:none">${cust.phone}</a></td></tr>
</table>
<hr style="border:none;border-top:1px solid #e7e5e4;margin:20px 0">
<h2 style="margin:0 0 12px;font-size:14px;color:#1e3a5f;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Project Details</h2>
<table style="width:100%;border-collapse:collapse;">
<tr><td style="padding:8px 0;color:#57534e;font-size:13px;width:120px">Address</td><td style="padding:8px 0;color:#1c1917;font-size:14px;font-weight:600">${proj.address}</td></tr>
<tr><td style="padding:8px 0;color:#57534e;font-size:13px">Roof Area</td><td style="padding:8px 0;color:#1c1917;font-size:14px">${proj.area} sq ft</td></tr>
<tr><td style="padding:8px 0;color:#57534e;font-size:13px">System</td><td style="padding:8px 0;color:#1c1917;font-size:14px">${proj.roofType}</td></tr>
<tr><td style="padding:8px 0;color:#57534e;font-size:13px">Age</td><td style="padding:8px 0;color:#1c1917;font-size:14px">${proj.age}</td></tr>
<tr><td style="padding:8px 0;color:#57534e;font-size:13px">Condition</td><td style="padding:8px 0;color:#1c1917;font-size:14px">${proj.condition}</td></tr>
<tr><td style="padding:8px 0;color:#57534e;font-size:13px">Stories</td><td style="padding:8px 0;color:#1c1917;font-size:14px">${proj.stories}</td></tr>
<tr><td style="padding:8px 0;color:#57534e;font-size:13px">Leaks</td><td style="padding:8px 0;color:#1c1917;font-size:14px">${proj.leaks}</td></tr>
<tr><td style="padding:8px 0;color:#57534e;font-size:13px">Equipment</td><td style="padding:8px 0;color:#1c1917;font-size:14px">${proj.equipment}</td></tr>
${proj.notes?`<tr><td style="padding:8px 0;color:#57534e;font-size:13px">Notes</td><td style="padding:8px 0;color:#1c1917;font-size:14px">${proj.notes}</td></tr>`:""}
</table>
<hr style="border:none;border-top:1px solid #e7e5e4;margin:20px 0">
<div style="background:#f0f7ff;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
<div style="font-size:11px;color:#1e3a5f;text-transform:uppercase;letter-spacing:1px;font-weight:700;margin-bottom:6px">Budget Estimate</div>
<div style="font-size:28px;font-weight:800;color:#1e3a5f">${budget.low} – ${budget.high}</div>
<div style="font-size:12px;color:#57534e;margin-top:4px">${budget.perSqftLow} – ${budget.perSqftHigh} per sq ft</div></div>
<div style="text-align:center">
<a href="mailto:${cust.email}?subject=Re: Flat Roof Quote" style="display:inline-block;background:#1e3a5f;color:#fff;padding:14px 36px;border-radius:10px;font-size:15px;font-weight:700;text-decoration:none">Reply to ${cust.name} →</a></div>
<p style="text-align:center;font-size:12px;color:#a8a29e;margin:12px 0 0">Or call: <a href="tel:${cust.phone}" style="color:#2563eb;text-decoration:none">${cust.phone}</a></p>
</div>
<div style="padding:20px 32px;text-align:center;border:1px solid #e7e5e4;border-top:none;border-radius:0 0 14px 14px">
<p style="margin:0;font-size:11px;color:#a8a29e">Sent via <strong>RoofRFQ</strong> · roofrfq.ca · ${ts}</p></div>
</div></body></html>`;
}

function blurredEmail(roofer, proj, budget, ts, leadId, rooferEmail) {
  const city = proj.address.split(",").slice(1).join(",").trim() || "Ontario";
  const unlockUrl = `${SITE_URL}/roofer-portal.html?action=unlock&lead=${leadId}&email=${encodeURIComponent(rooferEmail)}`;
  const subUrl = `${SITE_URL}/roofer-portal.html?action=subscribe&email=${encodeURIComponent(rooferEmail)}`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:24px 16px;">
<div style="background:#1e3a5f;border-radius:14px 14px 0 0;padding:28px 32px;text-align:center;">
<h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;">New Lead Available</h1>
<p style="margin:8px 0 0;color:rgba(255,255,255,.65);font-size:13px;">A building owner in <strong>${city}</strong> needs a flat roof replacement</p></div>
<div style="background:#fff;padding:32px;border:1px solid #e7e5e4;border-top:none;">
<h2 style="margin:0 0 12px;font-size:14px;color:#1e3a5f;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Customer Details</h2>
<div style="position:relative;padding:16px;background:#f9fafb;border-radius:10px;margin-bottom:20px;min-height:120px">
<div style="filter:blur(6px);user-select:none;pointer-events:none">
<table style="width:100%;border-collapse:collapse">
<tr><td style="padding:6px 0;color:#57534e;font-size:13px;width:100px">Name</td><td style="padding:6px 0;color:#1c1917;font-size:14px">████████ ██████</td></tr>
<tr><td style="padding:6px 0;color:#57534e;font-size:13px">Email</td><td style="padding:6px 0;color:#2563eb;font-size:14px">████@███████.███</td></tr>
<tr><td style="padding:6px 0;color:#57534e;font-size:13px">Phone</td><td style="padding:6px 0;color:#2563eb;font-size:14px">(███) ███-████</td></tr>
<tr><td style="padding:6px 0;color:#57534e;font-size:13px">Address</td><td style="padding:6px 0;color:#1c1917;font-size:14px">███ ██████ ██, ████████</td></tr>
</table></div>
<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">
<div style="background:rgba(255,255,255,.92);border-radius:12px;padding:16px 24px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,.08)">
<div style="font-size:20px;margin-bottom:6px">🔒</div>
<div style="font-size:14px;font-weight:700;color:#1c1917">Customer details are locked</div>
<div style="font-size:12px;color:#57534e;margin-top:2px">Unlock this lead to view contact info</div>
</div></div></div>
<hr style="border:none;border-top:1px solid #e7e5e4;margin:0 0 20px">
<h2 style="margin:0 0 12px;font-size:14px;color:#1e3a5f;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Project Overview</h2>
<table style="width:100%;border-collapse:collapse">
<tr><td style="padding:8px 0;color:#57534e;font-size:13px;width:120px">Area</td><td style="padding:8px 0;color:#1c1917;font-size:14px">${city}</td></tr>
<tr><td style="padding:8px 0;color:#57534e;font-size:13px">Roof Size</td><td style="padding:8px 0;color:#1c1917;font-size:14px;font-weight:600">${proj.area} sq ft</td></tr>
<tr><td style="padding:8px 0;color:#57534e;font-size:13px">System</td><td style="padding:8px 0;color:#1c1917;font-size:14px">${proj.roofType}</td></tr>
<tr><td style="padding:8px 0;color:#57534e;font-size:13px">Condition</td><td style="padding:8px 0;color:#1c1917;font-size:14px">${proj.condition}</td></tr>
</table>
<hr style="border:none;border-top:1px solid #e7e5e4;margin:20px 0">
<div style="background:#f0f7ff;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
<div style="font-size:11px;color:#1e3a5f;text-transform:uppercase;letter-spacing:1px;font-weight:700;margin-bottom:6px">Estimated Project Value</div>
<div style="font-size:28px;font-weight:800;color:#1e3a5f">${budget.low} – ${budget.high}</div></div>
<div style="text-align:center;margin-bottom:16px">
<a href="${unlockUrl}" style="display:inline-block;background:linear-gradient(135deg,#ca8a04,#a16207);color:#fff;padding:16px 40px;border-radius:12px;font-size:16px;font-weight:700;text-decoration:none">Unlock This Lead — $100</a></div>
<div style="text-align:center;margin-bottom:8px"><span style="font-size:13px;color:#57534e">— or —</span></div>
<div style="text-align:center;margin-bottom:20px">
<a href="${subUrl}" style="display:inline-block;background:#1e3a5f;color:#fff;padding:14px 36px;border-radius:12px;font-size:15px;font-weight:700;text-decoration:none">Subscribe for Unlimited Leads</a></div>
<div style="text-align:center;padding:14px;background:#fef9c3;border-radius:10px">
<p style="margin:0;font-size:13px;color:#92400e;font-weight:500">🎯 <strong>This lead represents a ${budget.low} – ${budget.high} project.</strong><br>Subscribers get unlimited leads + 1-month free trial.</p></div>
</div>
<div style="padding:20px 32px;text-align:center;border:1px solid #e7e5e4;border-top:none;border-radius:0 0 14px 14px">
<p style="margin:0;font-size:11px;color:#a8a29e">Sent via <strong>RoofRFQ</strong> · roofrfq.ca · ${ts}</p></div>
</div></body></html>`;
}

exports.handler = async (event) => {
  const H = { "Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type","Access-Control-Allow-Methods":"POST,OPTIONS","Content-Type":"application/json" };
  if (event.httpMethod === "OPTIONS") return { statusCode:200, headers:H, body:"" };
  if (event.httpMethod !== "POST") return { statusCode:405, headers:H, body:JSON.stringify({error:"Method not allowed"}) };
  try {
    const { roofer, customer, project, budget } = JSON.parse(event.body);
    if (!roofer?.name||!customer?.name||!customer?.email||!project?.address) return { statusCode:400, headers:H, body:JSON.stringify({error:"Missing fields"}) };
    if (!RESEND_KEY) return { statusCode:500, headers:H, body:JSON.stringify({error:"Email service not configured"}) };

    const ts = new Date().toISOString();
    const leadId = `lead_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
    const subj = `New Lead: Flat Roof Replacement – ${project.address}`;

    let emailType = "full";
    let rooferHtml = "";
    let rooferSubj = subj;

    if (roofer.email && STRIPE_KEY) {
      const cust = await getOrCreateCust(roofer.email, roofer.name);
      const st = await getRooferStatus(roofer.email);
      if (st.status === "subscribed") {
        emailType = "full";
        rooferHtml = fullEmail(roofer, customer, project, budget, ts);
      } else if (st.status === "free" || st.status === "new") {
        emailType = "free";
        const c2 = await getOrCreateCust(roofer.email, roofer.name);
        await stripe(`/customers/${c2.id}`, "POST", { "metadata[free_lead_used]": "true" });
        const freeHtml = fullEmail(roofer, customer, project, budget, ts);
        const subUrl = `${SITE_URL}/roofer-portal.html?action=subscribe&email=${encodeURIComponent(roofer.email)}`;
        rooferHtml = freeHtml.replace('Sent via <strong>RoofRFQ</strong>',
          `🎁 <strong>This lead is on us — your first one is free!</strong> Future leads require a subscription. <a href="${subUrl}" style="color:#1e3a5f;font-weight:700">Subscribe now →</a><br><br>Sent via <strong>RoofRFQ</strong>`);
      } else {
        emailType = "blurred";
        const city = project.address.split(",").slice(1).join(",").trim() || "Ontario";
        rooferSubj = `New Lead: ${project.area} sq ft Flat Roof in ${city} — Unlock to View`;
        rooferHtml = blurredEmail(roofer, project, budget, ts, leadId, roofer.email);
        // Store lead data for later unlock
        await stripe(`/customers/${cust.id}`, "POST", {
          [`metadata[${leadId}]`]: JSON.stringify({ c: { n:customer.name,e:customer.email,p:customer.phone,co:customer.company||"" }, pr:project, b:budget }),
        });
      }
    } else if (roofer.email) {
      rooferHtml = fullEmail(roofer, customer, project, budget, ts);
    }

    // Admin always gets full lead
    await fetch("https://api.resend.com/emails", { method:"POST",
      headers:{"Authorization":`Bearer ${RESEND_KEY}`,"Content-Type":"application/json"},
      body:JSON.stringify({ from:"RoofRFQ Leads <hello@roofrfq.ca>", to:[ADMIN_EMAIL], reply_to:customer.email,
        subject:`[${emailType.toUpperCase()}] ${subj} → ${roofer.name}`, html:fullEmail(roofer,customer,project,budget,ts) }),
    });

    // Roofer gets appropriate version
    if (roofer.email && rooferHtml) {
      await fetch("https://api.resend.com/emails", { method:"POST",
        headers:{"Authorization":`Bearer ${RESEND_KEY}`,"Content-Type":"application/json"},
        body:JSON.stringify({ from:"RoofRFQ Leads <hello@roofrfq.ca>", to:[roofer.email],
          reply_to: emailType==="blurred" ? undefined : customer.email, subject:rooferSubj, html:rooferHtml }),
      });
    }

    return { statusCode:200, headers:H, body:JSON.stringify({ success:true, id:leadId, timestamp:ts, roofer:roofer.name, emailType }) };
  } catch(err) {
    console.error("Error:", err);
    return { statusCode:500, headers:H, body:JSON.stringify({error:"Internal server error"}) };
  }
};
