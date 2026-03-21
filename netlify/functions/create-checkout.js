// create-checkout.js — Creates Stripe Checkout sessions for lead unlock ($100) or subscription ($299/mo, $2400/yr)
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const SITE_URL = process.env.URL || "https://roofrfq.ca";
const PRICE_MONTHLY = process.env.STRIPE_PRICE_MONTHLY || "";
const PRICE_ANNUAL = process.env.STRIPE_PRICE_ANNUAL || "";

async function stripe(endpoint, method, body) {
  const opts = { method, headers: { "Authorization": `Bearer ${STRIPE_KEY}`, "Content-Type": "application/x-www-form-urlencoded" } };
  if (body) opts.body = new URLSearchParams(body).toString();
  return (await fetch(`https://api.stripe.com/v1${endpoint}`, opts)).json();
}

async function getOrCreateCust(email, name) {
  const e = await stripe(`/customers?email=${encodeURIComponent(email)}&limit=1`);
  if (e.data?.length) return e.data[0];
  return stripe("/customers", "POST", { email, name: name || email, "metadata[source]": "roofrfq" });
}

exports.handler = async (event) => {
  const H = { "Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type","Access-Control-Allow-Methods":"POST,OPTIONS","Content-Type":"application/json" };
  if (event.httpMethod === "OPTIONS") return { statusCode:200, headers:H, body:"" };
  if (event.httpMethod !== "POST") return { statusCode:405, headers:H, body:JSON.stringify({error:"Method not allowed"}) };
  if (!STRIPE_KEY) return { statusCode:500, headers:H, body:JSON.stringify({error:"Stripe not configured"}) };

  try {
    const { action, email, rooferName, leadId } = JSON.parse(event.body);
    if (!email) return { statusCode:400, headers:H, body:JSON.stringify({error:"Email required"}) };

    const customer = await getOrCreateCust(email, rooferName || "");
    const returnUrl = `${SITE_URL}/roofer-portal.html?email=${encodeURIComponent(email)}`;

    if (action === "unlock" && leadId) {
      // One-time $100 payment to unlock a single lead
      const session = await stripe("/checkout/sessions", "POST", {
        customer: customer.id,
        mode: "payment",
        "line_items[0][price_data][currency]": "cad",
        "line_items[0][price_data][unit_amount]": "10000",
        "line_items[0][price_data][product_data][name]": "RoofRFQ Lead Unlock",
        "line_items[0][price_data][product_data][description]": `Unlock lead ${leadId}`,
        "line_items[0][quantity]": "1",
        [`metadata[lead_id]`]: leadId,
        [`metadata[type]`]: "lead_unlock",
        success_url: `${returnUrl}&unlocked=${leadId}`,
        cancel_url: returnUrl,
      });
      return { statusCode:200, headers:H, body:JSON.stringify({ url: session.url }) };

    } else if (action === "subscribe_monthly") {
      if (!PRICE_MONTHLY) return { statusCode:500, headers:H, body:JSON.stringify({error:"Monthly price not configured"}) };
      const session = await stripe("/checkout/sessions", "POST", {
        customer: customer.id,
        mode: "subscription",
        "line_items[0][price]": PRICE_MONTHLY,
        "line_items[0][quantity]": "1",
        "subscription_data[trial_period_days]": "30",
        [`metadata[type]`]: "subscription_monthly",
        success_url: `${returnUrl}&subscribed=monthly`,
        cancel_url: returnUrl,
      });
      return { statusCode:200, headers:H, body:JSON.stringify({ url: session.url }) };

    } else if (action === "subscribe_annual") {
      if (!PRICE_ANNUAL) return { statusCode:500, headers:H, body:JSON.stringify({error:"Annual price not configured"}) };
      const session = await stripe("/checkout/sessions", "POST", {
        customer: customer.id,
        mode: "subscription",
        "line_items[0][price]": PRICE_ANNUAL,
        "line_items[0][quantity]": "1",
        "subscription_data[trial_period_days]": "30",
        [`metadata[type]`]: "subscription_annual",
        success_url: `${returnUrl}&subscribed=annual`,
        cancel_url: returnUrl,
      });
      return { statusCode:200, headers:H, body:JSON.stringify({ url: session.url }) };

    } else if (action === "portal") {
      // Stripe Customer Portal for managing subscription
      const portal = await stripe("/billing_portal/sessions", "POST", {
        customer: customer.id,
        return_url: returnUrl,
      });
      return { statusCode:200, headers:H, body:JSON.stringify({ url: portal.url }) };
    }

    return { statusCode:400, headers:H, body:JSON.stringify({error:"Invalid action"}) };
  } catch(err) {
    console.error("Checkout error:", err);
    return { statusCode:500, headers:H, body:JSON.stringify({error:"Internal error"}) };
  }
};
