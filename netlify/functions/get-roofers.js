// get-roofers.js — Returns registered roofers near a given lat/lng from Stripe
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

async function stripe(endpoint) {
  const r = await fetch(`https://api.stripe.com/v1${endpoint}`, {
    headers: { "Authorization": `Bearer ${STRIPE_KEY}` },
  });
  return r.json();
}

function distKm(lat1, lng1, lat2, lng2) {
  const R = 6371, toR = d => d * Math.PI / 180;
  const dLat = toR(lat2 - lat1), dLng = toR(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toR(lat1)) * Math.cos(toR(lat2)) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

exports.handler = async (event) => {
  const H = { "Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type","Content-Type":"application/json" };
  if (event.httpMethod === "OPTIONS") return { statusCode:200, headers:H, body:"" };

  const lat = parseFloat(event.queryStringParameters?.lat);
  const lng = parseFloat(event.queryStringParameters?.lng);

  if (!lat || !lng) return { statusCode:400, headers:H, body:JSON.stringify({error:"lat and lng required"}) };
  if (!STRIPE_KEY) return { statusCode:200, headers:H, body:JSON.stringify({roofers:[]}) };

  try {
    // Fetch all registered roofer customers from Stripe (paginate if needed)
    let allCustomers = [];
    let hasMore = true;
    let startingAfter = null;

    while (hasMore) {
      const url = startingAfter
        ? `/customers?limit=100&starting_after=${startingAfter}`
        : `/customers?limit=100`;
      const page = await stripe(url);
      const registered = (page.data || []).filter(c => c.metadata?.registered === "true" && c.metadata?.source === "roofrfq");
      allCustomers = allCustomers.concat(registered);
      hasMore = page.has_more && page.data?.length > 0;
      if (hasMore) startingAfter = page.data[page.data.length - 1].id;
      // Safety: don't paginate more than 5 pages (500 customers)
      if (allCustomers.length > 500) break;
    }

    // Filter by distance
    const nearby = allCustomers
      .filter(c => c.metadata?.lat && c.metadata?.lng)
      .map(c => {
        const rLat = parseFloat(c.metadata.lat);
        const rLng = parseFloat(c.metadata.lng);
        const radius = parseInt(c.metadata.service_radius_km) || 100;
        const dist = distKm(lat, lng, rLat, rLng);
        if (dist > radius) return null;
        return {
          name: c.metadata.company_name || c.name || "Unknown",
          address: c.metadata.company_address || "",
          phone: c.metadata.company_phone || "",
          website: c.metadata.company_website || "",
          email: c.email,
          rating: null,
          reviews: 0,
          mapsUrl: "",
          featured: false,
          registered: true,
          distance: Math.round(dist),
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.distance - b.distance);

    // Deduplicate by email
    const seen = new Set();
    const unique = nearby.filter(r => {
      if (seen.has(r.email)) return false;
      seen.add(r.email);
      return true;
    });

    return { statusCode:200, headers:H, body:JSON.stringify({ roofers: unique }) };
  } catch(err) {
    console.error("Get roofers error:", err);
    return { statusCode:500, headers:H, body:JSON.stringify({error:"Internal error"}) };
  }
};
