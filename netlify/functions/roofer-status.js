// roofer-status.js — Returns roofer's subscription status and lead history
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

async function stripe(endpoint) {
  const r = await fetch(`https://api.stripe.com/v1${endpoint}`, {
    headers: { "Authorization": `Bearer ${STRIPE_KEY}` },
  });
  return r.json();
}

exports.handler = async (event) => {
  const H = { "Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type","Content-Type":"application/json" };
  if (event.httpMethod === "OPTIONS") return { statusCode:200, headers:H, body:"" };

  const email = event.queryStringParameters?.email;
  if (!email) return { statusCode:400, headers:H, body:JSON.stringify({error:"Email required"}) };
  if (!STRIPE_KEY) return { statusCode:200, headers:H, body:JSON.stringify({status:"no_stripe",subscription:null,leads:[]}) };

  try {
    const c = await stripe(`/customers?email=${encodeURIComponent(email)}&limit=1`);
    if (!c.data?.length) return { statusCode:200, headers:H, body:JSON.stringify({status:"new",subscription:null,freeUsed:false,leads:[]}) };

    const cust = c.data[0];
    const freeUsed = cust.metadata?.free_lead_used === "true";

    // Check subscriptions
    let subscription = null;
    const activeSubs = await stripe(`/subscriptions?customer=${cust.id}&limit=1`);
    if (activeSubs.data?.length) {
      const sub = activeSubs.data[0];
      subscription = {
        id: sub.id,
        status: sub.status,
        plan: sub.items?.data?.[0]?.price?.recurring?.interval === "year" ? "annual" : "monthly",
        currentPeriodEnd: sub.current_period_end,
        trialEnd: sub.trial_end,
        cancelAt: sub.cancel_at,
      };
    }

    // Count leads from metadata
    const leadKeys = Object.keys(cust.metadata || {}).filter(k => k.startsWith("lead_"));

    // Get payment history
    const charges = await stripe(`/charges?customer=${cust.id}&limit=20`);
    const payments = (charges.data || []).map(ch => ({
      amount: ch.amount / 100,
      currency: ch.currency,
      date: new Date(ch.created * 1000).toISOString(),
      status: ch.status,
      description: ch.description || "Payment",
    }));

    const status = subscription ? (subscription.status === "trialing" ? "trial" : "subscribed") : (freeUsed ? "paywall" : "free");

    return { statusCode:200, headers:H, body:JSON.stringify({
      status, subscription, freeUsed, lockedLeads: leadKeys.length, payments,
      customer: { name: cust.name, email: cust.email, created: cust.created },
    })};
  } catch(err) {
    console.error("Status error:", err);
    return { statusCode:500, headers:H, body:JSON.stringify({error:"Internal error"}) };
  }
};
