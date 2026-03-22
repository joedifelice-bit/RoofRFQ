// register-roofer.js — Register a roofing company or update details, stored in Stripe customer metadata
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

async function stripe(endpoint, method, body) {
  const opts = { method, headers: { "Authorization": `Bearer ${STRIPE_KEY}`, "Content-Type": "application/x-www-form-urlencoded" } };
  if (body) opts.body = new URLSearchParams(body).toString();
  return (await fetch(`https://api.stripe.com/v1${endpoint}`, opts)).json();
}

exports.handler = async (event) => {
  const H = { "Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type","Access-Control-Allow-Methods":"POST,OPTIONS","Content-Type":"application/json" };
  if (event.httpMethod === "OPTIONS") return { statusCode:200, headers:H, body:"" };
  if (event.httpMethod !== "POST") return { statusCode:405, headers:H, body:JSON.stringify({error:"Method not allowed"}) };
  if (!STRIPE_KEY) return { statusCode:500, headers:H, body:JSON.stringify({error:"Stripe not configured"}) };

  try {
    const { email, companyName, companyAddress, companyCity, companyProvince, companyPostal, companyPhone, companyWebsite, contactName, serviceRadius } = JSON.parse(event.body);

    if (!email || !companyName || !companyAddress || !companyCity) {
      return { statusCode:400, headers:H, body:JSON.stringify({error:"Email, company name, address, and city are required"}) };
    }

    // Get or create Stripe customer
    const existing = await stripe(`/customers?email=${encodeURIComponent(email)}&limit=1`);
    let customer;
    if (existing.data?.length) {
      customer = existing.data[0];
    } else {
      customer = await stripe("/customers", "POST", { email, name: companyName, "metadata[source]": "roofrfq" });
    }

    // Store company registration data in metadata
    const fullAddress = [companyAddress, companyCity, companyProvince, companyPostal].filter(Boolean).join(", ");

    await stripe(`/customers/${customer.id}`, "POST", {
      name: companyName,
      "metadata[registered]": "true",
      "metadata[source]": "roofrfq",
      "metadata[company_name]": companyName,
      "metadata[company_address]": fullAddress,
      "metadata[company_city]": companyCity.toLowerCase(),
      "metadata[company_province]": (companyProvince || "").toUpperCase(),
      "metadata[company_postal]": companyPostal || "",
      "metadata[company_phone]": companyPhone || "",
      "metadata[company_website]": companyWebsite || "",
      "metadata[contact_name]": contactName || "",
      "metadata[service_radius_km]": String(serviceRadius || 100),
      "metadata[registered_at]": new Date().toISOString(),
    });

    // Geocode the address for proximity matching later
    // We'll store lat/lng if we can get it from Google
    const GMAPS_KEY = process.env.GOOGLE_MAPS_KEY;
    if (GMAPS_KEY) {
      try {
        const geoRes = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${GMAPS_KEY}`);
        const geoData = await geoRes.json();
        if (geoData.status === "OK" && geoData.results?.[0]) {
          const loc = geoData.results[0].geometry.location;
          await stripe(`/customers/${customer.id}`, "POST", {
            "metadata[lat]": String(loc.lat),
            "metadata[lng]": String(loc.lng),
          });
        }
      } catch(e) { console.error("Geocode error:", e); }
    }

    return {
      statusCode: 200, headers: H,
      body: JSON.stringify({
        success: true,
        customerId: customer.id,
        company: companyName,
        email,
        message: "Registration complete. You'll receive leads for projects in your service area.",
      }),
    };
  } catch(err) {
    console.error("Registration error:", err);
    return { statusCode:500, headers:H, body:JSON.stringify({error:"Registration failed"}) };
  }
};
