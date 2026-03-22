// roofer-status.js — Returns roofer's subscription status, registration data, and lead history
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

async function stripe(endpoint) {
  const r = await fetch(`https://api.stripe.com/v1${endpoint}`, { headers: { "Authorization": `Bearer ${STRIPE_KEY}` } });
  return r.json();
}

exports.handler = async (event) => {
  const H = { "Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type","Content-Type":"application/json" };
  if (event.httpMethod === "OPTIONS") return { statusCode:200, headers:H, body:"" };

  const email = event.queryStringParameters?.email;
  if (!email) return { statusCode:400, headers:H, body:JSON.stringify({error:"Email required"}) };
  if (!STRIPE_KEY) return { statusCode:200, headers:H, body:JSON.stringify({status:"no_stripe",subscription:null,leads:[],registration:null}) };

  try {
    const c = await stripe(`/customers?email=${encodeURIComponent(email)}&limit=1`);
    if (!c.data?.length) return { statusCode:200, headers:H, body:JSON.stringify({status:"new",subscription:null,freeUsed:false,leads:[],registration:null,customer:null}) };

    const cust = c.data[0];
    const meta = cust.metadata || {};
    const freeUsed = meta.free_lead_used === "true";
    const isRegistered = meta.registered === "true";

    // Subscription check
    let subscription = null;
    const subs = await stripe(`/subscriptions?customer=${cust.id}&limit=1`);
    if (subs.data?.length) {
      const sub = subs.data[0];
      subscription = {
        id: sub.id, status: sub.status,
        plan: sub.items?.data?.[0]?.price?.recurring?.interval === "year" ? "annual" : "monthly",
        currentPeriodEnd: sub.current_period_end, trialEnd: sub.trial_end, cancelAt: sub.cancel_at,
      };
    }

    // Registration data
    let registration = null;
    if (isRegistered) {
      registration = {
        company_name: meta.company_name || "",
        company_address: meta.company_address || "",
        company_city: meta.company_city || "",
        company_province: meta.company_province || "",
        company_postal: meta.company_postal || "",
        company_phone: meta.company_phone || "",
        company_website: meta.company_website || "",
        contact_name: meta.contact_name || "",
        service_radius_km: meta.service_radius_km || "100",
        lat: meta.lat || "",
        lng: meta.lng || "",
        registered_at: meta.registered_at || "",
      };
    }

    // Lead counts
    const leadKeys = Object.keys(meta).filter(k => k.startsWith("lead_"));

    // Payment history
    const charges = await stripe(`/charges?customer=${cust.id}&limit=20`);
    const payments = (charges.data || []).map(ch => ({
      amount: ch.amount / 100, currency: ch.currency,
      date: new Date(ch.created * 1000).toISOString(), status: ch.status,
    }));

    const status = subscription
      ? (subscription.status === "trialing" ? "trial" : "subscribed")
      : (freeUsed ? "paywall" : (isRegistered ? "free" : "new"));

    return { statusCode:200, headers:H, body:JSON.stringify({
      status, subscription, freeUsed, lockedLeads: leadKeys.length, payments, registration,
      customer: { name: cust.name, email: cust.email, created: cust.created },
    })};
  } catch(err) {
    console.error("Status error:", err);
    return { statusCode:500, headers:H, body:JSON.stringify({error:"Internal error"}) };
  }
};
