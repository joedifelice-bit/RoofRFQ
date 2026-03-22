// Netlify Function: scrape-email
// Fetches a roofing company's website and extracts email addresses
// Called by the frontend for Google Places roofers that have a website but no email

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const { website } = event.queryStringParameters || {};

  if (!website) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing website parameter" }) };
  }

  try {
    // Normalize the URL
    let baseUrl = website.trim();
    if (!baseUrl.startsWith("http")) baseUrl = "https://" + baseUrl;
    // Remove trailing slash for consistency
    baseUrl = baseUrl.replace(/\/+$/, "");

    // Pages to check for email addresses (homepage + common contact pages)
    const pagesToCheck = [
      baseUrl,
      baseUrl + "/contact",
      baseUrl + "/contact-us",
      baseUrl + "/about",
      baseUrl + "/about-us",
    ];

    const emails = new Set();
    const timeout = 5000; // 5 second timeout per page

    for (const url of pagesToCheck) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);

        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; RoofRFQ/1.0; +https://roofrfq.ca)",
            "Accept": "text/html,application/xhtml+xml",
          },
          redirect: "follow",
        });

        clearTimeout(timer);

        if (!res.ok) continue;

        const html = await res.text();

        // Extract emails from mailto: links
        const mailtoMatches = html.match(/mailto:([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/gi) || [];
        mailtoMatches.forEach((m) => {
          const email = m.replace(/^mailto:/i, "").toLowerCase().split("?")[0].split("&")[0];
          if (isValidRooferEmail(email)) emails.add(email);
        });

        // Extract emails from visible text / href attributes
        const textMatches = html.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g) || [];
        textMatches.forEach((email) => {
          const clean = email.toLowerCase();
          if (isValidRooferEmail(clean)) emails.add(clean);
        });

        // If we found at least one good email, no need to check more pages
        if (emails.size > 0) break;

      } catch (pageErr) {
        // Page fetch failed (timeout, 404, etc.) — skip and try next
        continue;
      }
    }

    // Pick the best email (prefer info@, sales@, estimating@, contact@ over personal-looking ones)
    const emailList = Array.from(emails);
    const bestEmail = pickBestEmail(emailList);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        email: bestEmail || null,
        allEmails: emailList,
        website: baseUrl,
      }),
    };

  } catch (err) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, email: null, error: err.message }),
    };
  }
};

// Filter out junk emails (images, scripts, placeholders, etc.)
function isValidRooferEmail(email) {
  if (!email || email.length > 80) return false;
  // Skip common non-contact emails
  const skip = [
    "noreply", "no-reply", "donotreply", "mailer-daemon",
    "postmaster", "webmaster", "admin@wordpress",
    "example.com", "yourdomain", "email@", "name@",
    "sentry", "wixpress", "squarespace", "mailchimp",
    "sendgrid", "hubspot", "googleapis", "google.com",
    "facebook.com", "twitter.com", "instagram.com",
    ".png", ".jpg", ".gif", ".svg", ".webp", ".css", ".js",
  ];
  for (const s of skip) {
    if (email.includes(s)) return false;
  }
  // Must have a real TLD
  if (!/\.[a-z]{2,}$/.test(email)) return false;
  return true;
}

// Rank emails by how likely they are to be a business contact
function pickBestEmail(emails) {
  if (emails.length === 0) return null;
  if (emails.length === 1) return emails[0];

  const priority = ["estimating@", "estimates@", "info@", "sales@", "contact@", "office@", "hello@", "inquiries@", "service@"];

  for (const prefix of priority) {
    const match = emails.find((e) => e.startsWith(prefix));
    if (match) return match;
  }

  // Prefer emails on the same domain as the website
  // Otherwise return the first one
  return emails[0];
}
