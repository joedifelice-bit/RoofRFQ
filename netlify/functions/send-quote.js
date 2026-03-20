// Netlify Function: Send quote request email via Resend
// Environment variables needed in Netlify:
//   RESEND_API_KEY - your Resend API key
//   ADMIN_EMAIL - your personal email for BCC copies (e.g. you@gmail.com)

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const data = JSON.parse(event.body);
    const { roofer, customer, project, budget } = data;

    if (!roofer?.name || !customer?.name || !customer?.email || !project?.address) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing required fields" }) };
    }

    const RESEND_KEY = process.env.RESEND_API_KEY;
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

    if (!RESEND_KEY) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: "Email service not configured" }) };
    }

    const timestamp = new Date().toISOString();
    const subject = `New Warm Lead: Flat Roof Replacement – ${project.address}`;

    // ── HTML Email Template ──
    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px 16px;">

    <!-- Header -->
    <div style="background:#1e3a5f;border-radius:14px 14px 0 0;padding:28px 32px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">
        🏗️ New Warm Lead from RoofRFQ
      </h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.65);font-size:13px;">
        A building owner is looking for a flat roof replacement quote
      </p>
    </div>

    <!-- Body -->
    <div style="background:#ffffff;padding:32px;border:1px solid #e7e5e4;border-top:none;">

      <!-- Customer Info -->
      <div style="margin-bottom:24px;">
        <h2 style="margin:0 0 12px;font-size:14px;color:#1e3a5f;text-transform:uppercase;letter-spacing:1px;font-weight:700;">
          Customer Details
        </h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#57534e;font-size:13px;width:120px;vertical-align:top;">Name</td>
            <td style="padding:8px 0;color:#1c1917;font-size:14px;font-weight:600;">${customer.name}</td>
          </tr>
          ${customer.company ? `<tr>
            <td style="padding:8px 0;color:#57534e;font-size:13px;vertical-align:top;">Company</td>
            <td style="padding:8px 0;color:#1c1917;font-size:14px;">${customer.company}</td>
          </tr>` : ""}
          <tr>
            <td style="padding:8px 0;color:#57534e;font-size:13px;vertical-align:top;">Email</td>
            <td style="padding:8px 0;"><a href="mailto:${customer.email}" style="color:#2563eb;font-size:14px;text-decoration:none;font-weight:600;">${customer.email}</a></td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#57534e;font-size:13px;vertical-align:top;">Phone</td>
            <td style="padding:8px 0;"><a href="tel:${customer.phone}" style="color:#2563eb;font-size:14px;text-decoration:none;font-weight:600;">${customer.phone}</a></td>
          </tr>
        </table>
      </div>

      <hr style="border:none;border-top:1px solid #e7e5e4;margin:0 0 24px;">

      <!-- Project Details -->
      <div style="margin-bottom:24px;">
        <h2 style="margin:0 0 12px;font-size:14px;color:#1e3a5f;text-transform:uppercase;letter-spacing:1px;font-weight:700;">
          Project Details
        </h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#57534e;font-size:13px;width:120px;vertical-align:top;">Address</td>
            <td style="padding:8px 0;color:#1c1917;font-size:14px;font-weight:600;">${project.address}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#57534e;font-size:13px;vertical-align:top;">Roof Area</td>
            <td style="padding:8px 0;color:#1c1917;font-size:14px;">${project.area} sq ft</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#57534e;font-size:13px;vertical-align:top;">Roof System</td>
            <td style="padding:8px 0;color:#1c1917;font-size:14px;">${project.roofType}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#57534e;font-size:13px;vertical-align:top;">Age</td>
            <td style="padding:8px 0;color:#1c1917;font-size:14px;">${project.age}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#57534e;font-size:13px;vertical-align:top;">Condition</td>
            <td style="padding:8px 0;color:#1c1917;font-size:14px;">${project.condition}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#57534e;font-size:13px;vertical-align:top;">Stories</td>
            <td style="padding:8px 0;color:#1c1917;font-size:14px;">${project.stories}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#57534e;font-size:13px;vertical-align:top;">Known Leaks</td>
            <td style="padding:8px 0;color:#1c1917;font-size:14px;">${project.leaks}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#57534e;font-size:13px;vertical-align:top;">Equipment</td>
            <td style="padding:8px 0;color:#1c1917;font-size:14px;">${project.equipment}</td>
          </tr>
          ${project.notes ? `<tr>
            <td style="padding:8px 0;color:#57534e;font-size:13px;vertical-align:top;">Notes</td>
            <td style="padding:8px 0;color:#1c1917;font-size:14px;">${project.notes}</td>
          </tr>` : ""}
        </table>
      </div>

      <hr style="border:none;border-top:1px solid #e7e5e4;margin:0 0 24px;">

      <!-- Budget -->
      <div style="background:#f0f7ff;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
        <div style="font-size:11px;color:#1e3a5f;text-transform:uppercase;letter-spacing:1px;font-weight:700;margin-bottom:6px;">
          Customer's Budget Estimate
        </div>
        <div style="font-size:28px;font-weight:800;color:#1e3a5f;letter-spacing:-1px;">
          ${budget.low} – ${budget.high}
        </div>
        <div style="font-size:12px;color:#57534e;margin-top:4px;">
          ${budget.perSqftLow} – ${budget.perSqftHigh} per sq ft
        </div>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin-bottom:8px;">
        <a href="mailto:${customer.email}?subject=Re: Flat Roof Quote – ${encodeURIComponent(project.address)}&body=${encodeURIComponent(`Hi ${customer.name},\n\nThank you for your interest in a flat roof replacement. We'd love to discuss your project at ${project.address}.\n\nWe'll be in touch shortly to schedule a site visit and provide a detailed quote.\n\nBest regards,\n${roofer.name}`)}"
          style="display:inline-block;background:#1e3a5f;color:#ffffff;padding:14px 36px;border-radius:10px;font-size:15px;font-weight:700;text-decoration:none;">
          Reply to ${customer.name} →
        </a>
      </div>
      <p style="text-align:center;font-size:12px;color:#a8a29e;margin:12px 0 0;">
        Or call directly: <a href="tel:${customer.phone}" style="color:#2563eb;text-decoration:none;">${customer.phone}</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f5f5f4;border-radius:0 0 14px 14px;padding:20px 32px;text-align:center;border:1px solid #e7e5e4;border-top:none;">
      <p style="margin:0;font-size:11px;color:#a8a29e;">
        Sent via <strong>RoofRFQ</strong> · roofrfq.ca · ${timestamp}
      </p>
      <p style="margin:6px 0 0;font-size:11px;color:#a8a29e;">
        This is an automated lead notification. The customer has expressed interest in receiving a quote.
      </p>
    </div>

  </div>
</body>
</html>`;

    // ── Plain text fallback ──
    const text = `NEW WARM LEAD FROM ROOFRFQ

Customer: ${customer.name}${customer.company ? ` (${customer.company})` : ""}
Email: ${customer.email}
Phone: ${customer.phone}

Project: ${project.address}
Roof Area: ${project.area} sq ft
System: ${project.roofType}
Age: ${project.age}
Condition: ${project.condition}
Stories: ${project.stories}
Leaks: ${project.leaks}
Equipment: ${project.equipment}
${project.notes ? `Notes: ${project.notes}` : ""}

Budget Estimate: ${budget.low} – ${budget.high} (${budget.perSqftLow} – ${budget.perSqftHigh}/sq ft)

Reply to this email to reach the customer directly, or call ${customer.phone}.

---
Sent via RoofRFQ · roofrfq.ca · ${timestamp}`;

    // ── Send to roofer ──
    const emailPayload = {
      from: "RoofRFQ Leads <hello@roofrfq.ca>",
      to: [roofer.email || ADMIN_EMAIL],  // If we don't have roofer's email, send to admin
      reply_to: customer.email,
      subject: subject,
      html: html,
      text: text,
    };

    // Add BCC to admin if we have a roofer email and an admin email
    if (roofer.email && ADMIN_EMAIL) {
      emailPayload.bcc = [ADMIN_EMAIL];
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Resend error:", result);
      return {
        statusCode: res.status,
        headers,
        body: JSON.stringify({ error: result.message || "Email send failed" }),
      };
    }

    // ── Send admin notification (separate email so you get your own copy with context) ──
    if (ADMIN_EMAIL && roofer.email) {
      const adminSubject = `[Lead Sent] ${customer.name} → ${roofer.name} – ${project.address}`;
      const adminHtml = `
        <div style="font-family:sans-serif;padding:20px;max-width:500px;">
          <h2 style="color:#1e3a5f;font-size:16px;margin:0 0 12px;">Lead Dispatched ✓</h2>
          <table style="font-size:14px;border-collapse:collapse;width:100%;">
            <tr><td style="padding:4px 8px 4px 0;color:#57534e;">To Roofer</td><td style="padding:4px 0;font-weight:600;">${roofer.name}</td></tr>
            <tr><td style="padding:4px 8px 4px 0;color:#57534e;">Roofer Email</td><td style="padding:4px 0;">${roofer.email}</td></tr>
            <tr><td style="padding:4px 8px 4px 0;color:#57534e;">Customer</td><td style="padding:4px 0;font-weight:600;">${customer.name}</td></tr>
            <tr><td style="padding:4px 8px 4px 0;color:#57534e;">Customer Email</td><td style="padding:4px 0;">${customer.email}</td></tr>
            <tr><td style="padding:4px 8px 4px 0;color:#57534e;">Phone</td><td style="padding:4px 0;">${customer.phone}</td></tr>
            <tr><td style="padding:4px 8px 4px 0;color:#57534e;">Address</td><td style="padding:4px 0;">${project.address}</td></tr>
            <tr><td style="padding:4px 8px 4px 0;color:#57534e;">Area</td><td style="padding:4px 0;">${project.area} sq ft</td></tr>
            <tr><td style="padding:4px 8px 4px 0;color:#57534e;">Budget</td><td style="padding:4px 0;">${budget.low} – ${budget.high}</td></tr>
            <tr><td style="padding:4px 8px 4px 0;color:#57534e;">Sent At</td><td style="padding:4px 0;">${timestamp}</td></tr>
          </table>
        </div>`;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "RoofRFQ System <hello@roofrfq.ca>",
          to: [ADMIN_EMAIL],
          subject: adminSubject,
          html: adminHtml,
        }),
      }).catch(e => console.error("Admin notification error:", e));
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        id: result.id,
        timestamp,
        roofer: roofer.name,
        customer: customer.name,
      }),
    };

  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
