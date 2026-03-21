// stripe-webhook.js — Handles Stripe webhook events for lead unlocks and subscription activations
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const RESEND_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

async function stripeReq(endpoint, method, body) {
  const opts = { method, headers: { "Authorization": `Bearer ${STRIPE_KEY}`, "Content-Type": "application/x-www-form-urlencoded" } };
  if (body) opts.body = new URLSearchParams(body).toString();
  return (await fetch(`https://api.stripe.com/v1${endpoint}`, opts)).json();
}

async function sendUnlockEmail(rooferEmail, leadData) {
  if (!RESEND_KEY || !leadData) return;
  const d = typeof leadData === "string" ? JSON.parse(leadData) : leadData;
  const c = d.c, p = d.pr, b = d.b;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:-apple-system,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:24px 16px;">
<div style="background:#16a34a;border-radius:14px 14px 0 0;padding:28px 32px;text-align:center;">
<h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;">🔓 Lead Unlocked!</h1>
<p style="margin:8px 0 0;color:rgba(255,255,255,.7);font-size:13px;">Here are the full customer details for this lead</p></div>
<div style="background:#fff;padding:32px;border:1px solid #e7e5e4;border-top:none;">
<h2 style="margin:0 0 12px;font-size:14px;color:#1e3a5f;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Customer Details</h2>
<table style="width:100%;border-collapse:collapse">
<tr><td style="padding:8px 0;color:#57534e;font-size:13px;width:120px">Name</td><td style="padding:8px 0;color:#1c1917;font-size:14px;font-weight:600">${c.n}</td></tr>
${c.co?`<tr><td style="padding:8px 0;color:#57534e;font-size:13px">Company</td><td style="padding:8px 0;color:#1c1917;font-size:14px">${c.co}</td></tr>`:""}
<tr><td style="padding:8px 0;color:#57534e;font-size:13px">Email</td><td style="padding:8px 0"><a href="mailto:${c.e}" style="color:#2563eb;font-size:14px;font-weight:600;text-decoration:none">${c.e}</a></td></tr>
<tr><td style="padding:8px 0;color:#57534e;font-size:13px">Phone</td><td style="padding:8px 0"><a href="tel:${c.p}" style="color:#2563eb;font-size:14px;font-weight:600;text-decoration:none">${c.p}</a></td></tr>
</table>
<hr style="border:none;border-top:1px solid #e7e5e4;margin:20px 0">
<h2 style="margin:0 0 12px;font-size:14px;color:#1e3a5f;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Project Details</h2>
<table style="width:100%;border-collapse:collapse">
<tr><td style="padding:8px 0;color:#57534e;font-size:13px;width:120px">Address</td><td style="padding:8px 0;color:#1c1917;font-size:14px;font-weight:600">${p.address}</td></tr>
<tr><td style="padding:8px 0;color:#57534e;font-size:13px">Roof Area</td><td style="padding:8px 0;color:#1c1917;font-size:14px">${p.area} sq ft</td></tr>
<tr><td style="padding:8px 0;color:#57534e;font-size:13px">System</td><td style="padding:8px 0;color:#1c1917;font-size:14px">${p.roofType}</td></tr>
</table>
<hr style="border:none;border-top:1px solid #e7e5e4;margin:20px 0">
<div style="background:#f0f7ff;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
<div style="font-size:11px;color:#1e3a5f;text-transform:uppercase;letter-spacing:1px;font-weight:700;margin-bottom:6px">Budget Estimate</div>
<div style="font-size:28px;font-weight:800;color:#1e3a5f">${b.low} – ${b.high}</div></div>
<div style="text-align:center">
<a href="mailto:${c.e}?subject=Re: Flat Roof Quote" style="display:inline-block;background:#1e3a5f;color:#fff;padding:14px 36px;border-radius:10px;font-size:15px;font-weight:700;text-decoration:none">Reply to ${c.n} →</a></div>
<p style="text-align:center;font-size:12px;color:#a8a29e;margin:12px 0 0">Or call: <a href="tel:${c.p}" style="color:#2563eb;text-decoration:none">${c.p}</a></p>
</div>
<div style="padding:20px 32px;text-align:center;border:1px solid #e7e5e4;border-top:none;border-radius:0 0 14px 14px">
<p style="margin:0;font-size:11px;color:#a8a29e">Lead unlocked via <strong>RoofRFQ</strong> · roofrfq.ca</p></div>
</div></body></html>`;

  await fetch("https://api.resend.com/emails", { method:"POST",
    headers:{"Authorization":`Bearer ${RESEND_KEY}`,"Content-Type":"application/json"},
    body:JSON.stringify({ from:"RoofRFQ Leads <hello@roofrfq.ca>", to:[rooferEmail], reply_to:c.e,
      subject:`Lead Unlocked: Flat Roof at ${p.address}`, html }),
  });

  // Notify admin
  if (ADMIN_EMAIL) {
    await fetch("https://api.resend.com/emails", { method:"POST",
      headers:{"Authorization":`Bearer ${RESEND_KEY}`,"Content-Type":"application/json"},
      body:JSON.stringify({ from:"RoofRFQ System <hello@roofrfq.ca>", to:[ADMIN_EMAIL],
        subject:`[💰 $100 UNLOCK] ${rooferEmail} unlocked lead for ${p.address}`,
        html:`<p><strong>${rooferEmail}</strong> paid $100 to unlock lead:<br>Customer: ${c.n} (${c.e})<br>Address: ${p.address}<br>Budget: ${b.low} – ${b.high}</p>` }),
    });
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode:405, body:"Method not allowed" };
  if (!STRIPE_KEY) return { statusCode:500, body:"Stripe not configured" };

  try {
    const sig = event.headers["stripe-signature"];
    // For now, parse event directly (add signature verification in production with stripe npm package)
    const stripeEvent = JSON.parse(event.body);
    const type = stripeEvent.type;
    const obj = stripeEvent.data?.object;

    if (type === "checkout.session.completed") {
      const customerId = obj.customer;
      const metadata = obj.metadata || {};

      if (metadata.type === "lead_unlock" && metadata.lead_id) {
        // Fetch customer to get stored lead data
        const cust = await stripeReq(`/customers/${customerId}`);
        const leadData = cust.metadata?.[metadata.lead_id];
        if (leadData && cust.email) {
          await sendUnlockEmail(cust.email, leadData);
        }
      }

      if (metadata.type === "subscription_monthly" || metadata.type === "subscription_annual") {
        // Subscription started — notify admin
        const cust = await stripeReq(`/customers/${customerId}`);
        if (ADMIN_EMAIL && RESEND_KEY) {
          const plan = metadata.type === "subscription_annual" ? "$2,400/year" : "$299/month";
          await fetch("https://api.resend.com/emails", { method:"POST",
            headers:{"Authorization":`Bearer ${RESEND_KEY}`,"Content-Type":"application/json"},
            body:JSON.stringify({ from:"RoofRFQ System <hello@roofrfq.ca>", to:[ADMIN_EMAIL],
              subject:`[🎉 NEW SUBSCRIBER] ${cust.email} — ${plan} (30-day trial started)`,
              html:`<p><strong>${cust.name || cust.email}</strong> just subscribed to RoofRFQ!<br>Plan: ${plan}<br>Email: ${cust.email}<br>30-day free trial started. First charge after trial.</p>` }),
          });
        }
        // Unlock all pending blurred leads for this subscriber
        const custData = await stripeReq(`/customers/${customerId}`);
        const leadKeys = Object.keys(custData.metadata || {}).filter(k => k.startsWith("lead_"));
        for (const key of leadKeys) {
          try {
            await sendUnlockEmail(custData.email, custData.metadata[key]);
          } catch(e) { console.error("Unlock error for", key, e); }
        }
      }
    }

    return { statusCode:200, body:JSON.stringify({received:true}) };
  } catch(err) {
    console.error("Webhook error:", err);
    return { statusCode:400, body:JSON.stringify({error:"Webhook processing failed"}) };
  }
};
