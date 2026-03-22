// Netlify Function: send-quote
// Sends lead email to roofer via Resend, with a "Reply to Lead" mailto link
// that pre-fills the template response for the roofer

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hello@roofrfq.ca";

  if (!RESEND_API_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Email service not configured" }) };
  }

  try {
    const payload = JSON.parse(event.body);
    const { roofer, customer, project, budget } = payload;

    if (!roofer?.email || !customer?.email) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing roofer or customer email" }) };
    }

    // ── Build the reply template mailto link ──
    const replySubject = encodeURIComponent(`Re: Flat Roof Replacement Inquiry — ${project.address} | via RoofRFQ`);
    const replyBody = encodeURIComponent(
      `Hi ${customer.name},\n\n` +
      `Thank you for your interest in a flat roof replacement. We'd love to discuss your project at ${project.address}. ` +
      `We'll be in touch shortly to schedule a site visit and provide a detailed quote.\n\n` +
      `Best regards,\n` +
      `${roofer.name}`
    );
    const replyMailto = `mailto:${customer.email}?subject=${replySubject}&body=${replyBody}`;

    // ── Build the HTML email ──
    const htmlEmail = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px 16px;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1e3a5f 0%,#2d5a8e 100%);border-radius:16px 16px 0 0;padding:32px 28px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">
        🏗️ New Flat Roof Lead
      </h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:14px;">
        Submitted via RoofRFQ.ca
      </p>
    </div>

    <!-- Reply CTA -->
    <div style="background:#ffffff;padding:24px 28px;border-left:1px solid #e7e5e4;border-right:1px solid #e7e5e4;">
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;text-align:center;">
        <p style="margin:0 0 12px;color:#166534;font-size:14px;font-weight:600;">
          Ready to respond? Click below — your reply is pre-written:
        </p>
        <a href="${replyMailto}" style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:600;letter-spacing:0.2px;">
          ✉️ Reply to ${customer.name}
        </a>
        <p style="margin:12px 0 0;color:#15803d;font-size:12px;">
          Opens your email client with a ready-to-send response
        </p>
      </div>
    </div>

    <!-- Customer Info -->
    <div style="background:#ffffff;padding:0 28px 24px;border-left:1px solid #e7e5e4;border-right:1px solid #e7e5e4;">
      <h2 style="margin:0 0 16px;font-size:16px;color:#1c1917;border-bottom:2px solid #e7e5e4;padding-bottom:10px;">
        👤 Customer Information
      </h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;color:#78716c;font-size:13px;width:110px;vertical-align:top;">Name</td>
          <td style="padding:8px 0;color:#1c1917;font-size:14px;font-weight:600;">${customer.name}</td>
        </tr>
        ${customer.company ? `<tr>
          <td style="padding:8px 0;color:#78716c;font-size:13px;vertical-align:top;">Company</td>
          <td style="padding:8px 0;color:#1c1917;font-size:14px;">${customer.company}</td>
        </tr>` : ""}
        <tr>
          <td style="padding:8px 0;color:#78716c;font-size:13px;vertical-align:top;">Email</td>
          <td style="padding:8px 0;color:#1c1917;font-size:14px;">
            <a href="mailto:${customer.email}" style="color:#2563eb;text-decoration:none;">${customer.email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#78716c;font-size:13px;vertical-align:top;">Phone</td>
          <td style="padding:8px 0;color:#1c1917;font-size:14px;">
            <a href="tel:${customer.phone}" style="color:#2563eb;text-decoration:none;">${customer.phone}</a>
          </td>
        </tr>
      </table>
    </div>

    <!-- Project Details -->
    <div style="background:#ffffff;padding:0 28px 24px;border-left:1px solid #e7e5e4;border-right:1px solid #e7e5e4;">
      <h2 style="margin:0 0 16px;font-size:16px;color:#1c1917;border-bottom:2px solid #e7e5e4;padding-bottom:10px;">
        🏢 Project Details
      </h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;color:#78716c;font-size:13px;width:110px;vertical-align:top;">Address</td>
          <td style="padding:8px 0;color:#1c1917;font-size:14px;font-weight:600;">${project.address}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#78716c;font-size:13px;vertical-align:top;">Roof Area</td>
          <td style="padding:8px 0;color:#1c1917;font-size:14px;">${project.area} sq ft</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#78716c;font-size:13px;vertical-align:top;">Roof System</td>
          <td style="padding:8px 0;color:#1c1917;font-size:14px;">${project.roofType}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#78716c;font-size:13px;vertical-align:top;">Roof Age</td>
          <td style="padding:8px 0;color:#1c1917;font-size:14px;">${project.age}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#78716c;font-size:13px;vertical-align:top;">Condition</td>
          <td style="padding:8px 0;color:#1c1917;font-size:14px;">${project.condition}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#78716c;font-size:13px;vertical-align:top;">Stories</td>
          <td style="padding:8px 0;color:#1c1917;font-size:14px;">${project.stories}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#78716c;font-size:13px;vertical-align:top;">Known Leaks</td>
          <td style="padding:8px 0;color:#1c1917;font-size:14px;">${project.leaks}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#78716c;font-size:13px;vertical-align:top;">Equipment</td>
          <td style="padding:8px 0;color:#1c1917;font-size:14px;">${project.equipment}</td>
        </tr>
        ${project.notes ? `<tr>
          <td style="padding:8px 0;color:#78716c;font-size:13px;vertical-align:top;">Notes</td>
          <td style="padding:8px 0;color:#1c1917;font-size:14px;">${project.notes}</td>
        </tr>` : ""}
      </table>
    </div>

    <!-- Budget -->
    <div style="background:#ffffff;padding:0 28px 24px;border-left:1px solid #e7e5e4;border-right:1px solid #e7e5e4;">
      <h2 style="margin:0 0 16px;font-size:16px;color:#1c1917;border-bottom:2px solid #e7e5e4;padding-bottom:10px;">
        💰 Customer's Budget Estimate
      </h2>
      <div style="background:#fef9c3;border:1px solid #fde047;border-radius:10px;padding:16px;text-align:center;">
        <div style="font-size:24px;font-weight:800;color:#92400e;letter-spacing:-0.5px;">
          ${budget.low} — ${budget.high}
        </div>
        <div style="font-size:13px;color:#a16207;margin-top:4px;">
          ${budget.perSqftLow} – ${budget.perSqftHigh} per sq ft
        </div>
      </div>
      <p style="margin:12px 0 0;font-size:12px;color:#78716c;text-align:center;">
        This is a planning-level estimate generated by RoofRFQ. Final pricing is determined by your site visit and formal quote.
      </p>
    </div>

    <!-- Second Reply CTA -->
    <div style="background:#ffffff;padding:0 28px 28px;border-left:1px solid #e7e5e4;border-right:1px solid #e7e5e4;border-radius:0 0 16px 16px;text-align:center;">
      <a href="${replyMailto}" style="display:inline-block;background:#1e3a5f;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:10px;font-size:15px;font-weight:600;letter-spacing:0.2px;">
        ✉️ Reply to ${customer.name}
      </a>
      <p style="margin:10px 0 0;font-size:12px;color:#a8a29e;">
        Or reply directly to this email — it will go to the customer
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:20px 0 0;">
      <p style="margin:0;font-size:12px;color:#a8a29e;">
        This lead was generated by <a href="https://roofrfq.ca" style="color:#2563eb;text-decoration:none;">RoofRFQ.ca</a> — Flat Roof Replacement Made Simple
      </p>
    </div>

  </div>
</body>
</html>`;

    // ── Plain text fallback ──
    const textEmail = [
      `NEW FLAT ROOF LEAD — via RoofRFQ.ca`,
      ``,
      `CUSTOMER`,
      `Name: ${customer.name}`,
      customer.company ? `Company: ${customer.company}` : null,
      `Email: ${customer.email}`,
      `Phone: ${customer.phone}`,
      ``,
      `PROJECT`,
      `Address: ${project.address}`,
      `Roof Area: ${project.area} sq ft`,
      `System: ${project.roofType}`,
      `Age: ${project.age}`,
      `Condition: ${project.condition}`,
      `Stories: ${project.stories}`,
      `Known Leaks: ${project.leaks}`,
      `Equipment: ${project.equipment}`,
      project.notes ? `Notes: ${project.notes}` : null,
      ``,
      `BUDGET ESTIMATE`,
      `Range: ${budget.low} – ${budget.high}`,
      `Per Sq Ft: ${budget.perSqftLow} – ${budget.perSqftHigh}`,
      ``,
      `---`,
      `To reply with a pre-written response, hit Reply on this email or contact the customer directly.`,
      ``,
      `Generated by RoofRFQ.ca`,
    ].filter(line => line !== null).join("\n");

    // ── Send email to roofer via Resend ──
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "RoofRFQ <hello@roofrfq.ca>",
        to: [roofer.email],
        bcc: [ADMIN_EMAIL],
        reply_to: customer.email,
        subject: `New Lead: Flat Roof Replacement at ${project.address} | RoofRFQ`,
        html: htmlEmail,
        text: textEmail,
      }),
    });

    const emailData = await emailRes.json();

    if (!emailRes.ok) {
      console.error("Resend error:", emailData);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ success: false, error: emailData.message || "Email send failed" }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, emailType: "full", id: emailData.id }),
    };

  } catch (err) {
    console.error("send-quote error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};
