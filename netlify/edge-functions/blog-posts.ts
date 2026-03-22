import type { Context, Config } from "@netlify/edge-functions";

const GA_ID = "G-JS5X88KCTR";

function getArticleSchema(title: string, description: string, url: string, datePublished: string) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    url: url,
    datePublished: datePublished,
    dateModified: datePublished,
    author: { "@type": "Organization", name: "RoofRFQ", url: "https://roofrfq.ca" },
    publisher: { "@type": "Organization", name: "RoofRFQ", url: "https://roofrfq.ca", logo: { "@type": "ImageObject", url: "https://roofrfq.ca/logo.png" } },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  });
}

function getFaqSchema(faqs: { q: string; a: string }[]) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });
}

function wrapHtml(title: string, description: string, canonical: string, body: string, schemas: string[]) {
  return `<!DOCTYPE html>
<html lang="en-CA">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="RoofRFQ">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="en_CA">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="geo.region" content="CA-ON">
<meta name="geo.placename" content="Toronto">
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif;color:#1a1a1a;line-height:1.7;background:#fff}
.nav{background:#111;padding:16px 24px;display:flex;align-items:center;justify-content:space-between}
.nav a{color:#fff;text-decoration:none;font-weight:700;font-size:18px}
.nav .cta{background:#e63946;color:#fff;padding:8px 20px;border-radius:6px;font-size:14px;font-weight:600;text-decoration:none}
.nav .cta:hover{background:#c1121f}
.hero{background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);color:#fff;padding:60px 24px 50px;text-align:center}
.hero h1{font-size:clamp(28px,4vw,42px);max-width:800px;margin:0 auto 16px;line-height:1.2;font-weight:800}
.hero p{font-size:18px;opacity:0.85;max-width:640px;margin:0 auto}
.hero .date{font-size:14px;opacity:0.6;margin-top:12px}
article{max-width:780px;margin:0 auto;padding:40px 24px 80px}
article h2{font-size:26px;font-weight:700;margin:48px 0 16px;color:#16213e;border-bottom:3px solid #e63946;padding-bottom:8px}
article h3{font-size:20px;font-weight:700;margin:32px 0 12px;color:#1a1a2e}
article p{margin:0 0 18px;font-size:17px}
article strong{color:#16213e}
.cost-table{width:100%;border-collapse:collapse;margin:24px 0 32px;font-size:15px}
.cost-table th{background:#16213e;color:#fff;padding:12px 16px;text-align:left;font-weight:600}
.cost-table td{padding:12px 16px;border-bottom:1px solid #e5e5e5}
.cost-table tr:nth-child(even){background:#f8f9fa}
.cost-table tr:hover{background:#eef1f5}
.callout{background:#f0f4ff;border-left:4px solid #e63946;padding:20px 24px;margin:28px 0;border-radius:0 8px 8px 0;font-size:16px}
.callout strong{color:#e63946}
.cta-box{background:linear-gradient(135deg,#16213e,#1a1a2e);color:#fff;padding:40px 32px;border-radius:12px;text-align:center;margin:48px 0}
.cta-box h3{font-size:24px;margin-bottom:12px;font-weight:700;border:none;color:#fff}
.cta-box p{opacity:0.85;margin-bottom:20px;font-size:16px;color:#fff}
.cta-box a{display:inline-block;background:#e63946;color:#fff;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px}
.cta-box a:hover{background:#c1121f}
.faq{margin:40px 0}
.faq details{border:1px solid #e5e5e5;border-radius:8px;margin-bottom:12px;overflow:hidden}
.faq summary{padding:16px 20px;font-weight:600;font-size:17px;cursor:pointer;background:#f8f9fa;list-style:none}
.faq summary::-webkit-details-marker{display:none}
.faq summary::before{content:"+ ";color:#e63946;font-weight:700}
.faq details[open] summary::before{content:"− "}
.faq details[open] summary{border-bottom:1px solid #e5e5e5}
.faq .answer{padding:16px 20px;font-size:16px;line-height:1.6}
footer{background:#111;color:#999;text-align:center;padding:32px 24px;font-size:14px}
footer a{color:#e63946;text-decoration:none}
@media(max-width:600px){article{padding:24px 16px 60px}.cost-table{font-size:13px}.cost-table th,.cost-table td{padding:8px 10px}}
</style>
</head>
<body>
<nav class="nav">
  <a href="https://roofrfq.ca">RoofRFQ</a>
  <a href="https://roofrfq.ca" class="cta">Get Free Quotes</a>
</nav>
${body}
<footer>
  <p>&copy; 2026 <a href="https://roofrfq.ca">RoofRFQ</a> — Flat Roof Replacement Made Simple</p>
</footer>
${schemas.map((s) => `<script type="application/ld+json">${s}</script>`).join("\n")}
</body>
</html>`;
}

function getFlatRoofCostOntario() {
  const title = "Flat Roof Replacement Cost in Ontario (2026 Guide) | RoofRFQ";
  const description = "How much does flat roof replacement cost in Ontario in 2026? $8–$25 per sq ft depending on material. Full breakdown by material, city, and roof size.";
  const canonical = "https://roofrfq.ca/blog/flat-roof-replacement-cost-ontario";
  const datePublished = "2026-03-22";

  const faqs = [
    { q: "How long does a flat roof replacement take in Ontario?", a: "Most residential flat roof replacements take 2–5 days. Commercial projects of 2,000–5,000 sq ft typically take 5–10 days. Larger industrial projects can take 2–4 weeks." },
    { q: "What is the best flat roof material for Ontario's climate?", a: "Modified bitumen and EPDM perform best in cold climates due to their flexibility at low temperatures. TPO is ideal for energy efficiency. PVC is best for buildings with chemical exposure." },
    { q: "Do I need a permit to replace my flat roof in Ontario?", a: "Replacing a flat roof with the same material usually doesn't require a permit. Changing roofing systems, adding insulation, or structural modifications may require one. Check with your local building department." },
    { q: "Can you replace a flat roof in winter in Ontario?", a: "Yes, some systems can be installed in cold weather. Torch-applied modified bitumen works down to -10°C. TPO and PVC heat-welding works in cold temperatures but takes longer. Self-adhering membranes generally need above 5°C." },
    { q: "What warranty should I expect on a flat roof replacement?", a: "Expect a contractor workmanship warranty of 5–10 years and a manufacturer material warranty of 15–25 years. Manufacturer-certified contractors can often provide extended warranty coverage up to 30 years." },
  ];

  const body = `
<div class="hero">
  <h1>Flat Roof Replacement Cost in Ontario (2026 Guide)</h1>
  <p>Real pricing data for TPO, EPDM, PVC, modified bitumen, and built-up roofing systems across Ontario.</p>
  <div class="date">Last updated: March 2026</div>
</div>
<article>
  <p><strong>How much does flat roof replacement cost in Ontario?</strong> In 2026, Ontario property owners can expect to pay between <strong>$8 and $25 per square foot</strong> for a full flat roof replacement, with most projects landing between <strong>$10,000 and $35,000</strong> depending on roof size, material choice, and job complexity. Commercial and industrial flat roofs with difficult access, multiple layers, or specialized membrane systems can cost significantly more.</p>

  <p>This guide breaks down the real costs by material, city, and building type so you can budget accurately and compare quotes with confidence.</p>

  <h2>Flat Roof Replacement Cost by Material</h2>
  <p>Material choice is the single biggest factor in your total flat roof replacement project cost. Here's what Ontario property owners are paying in 2026:</p>

  <table class="cost-table">
    <thead>
      <tr><th>Material</th><th>Cost per sq ft</th><th>Lifespan</th><th>Best For</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Modified Bitumen</strong></td><td>$8–$14</td><td>15–25 years</td><td>Residential, mid-size commercial</td></tr>
      <tr><td><strong>EPDM (Rubber)</strong></td><td>$8–$16</td><td>20–30 years</td><td>Cold climates, large commercial</td></tr>
      <tr><td><strong>TPO</strong></td><td>$10–$18</td><td>20–30 years</td><td>Energy efficiency, warehouses</td></tr>
      <tr><td><strong>PVC</strong></td><td>$12–$22</td><td>25–35 years</td><td>Restaurants, industrial, chemical exposure</td></tr>
      <tr><td><strong>Built-Up (BUR)</strong></td><td>$10–$16</td><td>20–30 years</td><td>Proven multi-layer system</td></tr>
      <tr><td><strong>Spray Foam (SPF)</strong></td><td>$12–$20</td><td>Recoat every 10–15 yrs</td><td>Avoiding full tear-off, insulation upgrade</td></tr>
    </tbody>
  </table>

  <p><strong>Modified bitumen</strong> is the most common flat roofing system in Ontario. It combines asphalt with rubber-like polymers for excellent waterproofing and flexibility in cold weather. Applied using torch-on or peel-and-stick methods, it's a strong choice for residential flat roofs and mid-size commercial buildings across the GTA, Ottawa, and Hamilton.</p>

  <p><strong>EPDM rubber roofing</strong> is a synthetic rubber membrane known for its durability in extreme cold — making it well-suited to Ontario's harsh winters. Available in standard, reinforced, and fleece-backed options, EPDM is one of the most cost-effective flat roof materials for large commercial roofs in Toronto, Mississauga, and Brampton.</p>

  <p><strong>TPO roofing</strong> has become increasingly popular for commercial flat roof replacement due to its energy efficiency and UV reflectivity. The white membrane reduces cooling costs in summer and is heat-welded at seams for superior waterproofing. TPO is a top choice for warehouses, retail buildings, and multi-unit residential properties across Ontario.</p>

  <p><strong>PVC roofing</strong> is the premium single-ply option, offering the best chemical resistance and fire rating of any flat roofing membrane. It's ideal for restaurants, commercial kitchens, and industrial buildings in Ontario where grease or chemical exposure is a concern. PVC flat roofs can last 25–35 years with proper maintenance.</p>

  <h2>Flat Roof Replacement Cost by Roof Size</h2>
  <p>Here's what a typical flat roof replacement costs in Ontario based on common building sizes:</p>

  <table class="cost-table">
    <thead>
      <tr><th>Roof Size</th><th>Typical Cost Range</th><th>Building Type</th></tr>
    </thead>
    <tbody>
      <tr><td>1,000 sq ft</td><td>$8,000–$18,000</td><td>Small residential, garage</td></tr>
      <tr><td>2,000 sq ft</td><td>$16,000–$36,000</td><td>Average commercial building</td></tr>
      <tr><td>3,000 sq ft</td><td>$24,000–$54,000</td><td>Mid-size commercial</td></tr>
      <tr><td>5,000 sq ft</td><td>$40,000–$90,000</td><td>Large commercial / industrial</td></tr>
      <tr><td>10,000+ sq ft</td><td>$80,000–$150,000+</td><td>Warehouse, distribution centre</td></tr>
    </tbody>
  </table>

  <p>These ranges assume a single-layer tear-off, standard insulation, and moderate access difficulty. Multi-layer tear-offs, structural deck repairs, or difficult access (downtown Toronto row houses, for example) can increase flat roof replacement costs by 20–40%.</p>

  <h2>Flat Roof Replacement Cost by Ontario City</h2>
  <p>Labour rates, permitting requirements, and market competition vary across Ontario. Here's how flat roof pricing compares across major cities:</p>

  <table class="cost-table">
    <thead>
      <tr><th>City / Region</th><th>Cost per sq ft</th><th>Notes</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Toronto &amp; GTA</strong></td><td>$12–$25</td><td>15–25% higher than provincial avg. Urban access challenges.</td></tr>
      <tr><td><strong>Ottawa</strong></td><td>$10–$20</td><td>Moderate pricing. Bilingual contractor market.</td></tr>
      <tr><td><strong>Hamilton &amp; Niagara</strong></td><td>$9–$18</td><td>Strong contractor availability. Competitive pricing.</td></tr>
      <tr><td><strong>London / Kitchener-Waterloo</strong></td><td>$8–$16</td><td>Lower overhead. Good contractor quality.</td></tr>
      <tr><td><strong>Northern Ontario</strong></td><td>$10–$20</td><td>Higher material transport costs offset lower labour.</td></tr>
    </tbody>
  </table>

  <p><strong>Toronto and the GTA</strong> is consistently the most expensive market for flat roof replacement in Ontario. Higher labour costs, difficult urban access (particularly on downtown low-rise buildings), and strict municipal permitting all contribute to the premium. Property owners in Scarborough, North York, Etobicoke, Mississauga, and Brampton should budget accordingly.</p>

  <h2>What's Included in a Flat Roof Replacement Quote</h2>
  <p>A complete flat roof replacement quote in Ontario should include: tear-off and disposal of existing roofing materials, inspection and repair of the roof deck, new vapour barrier, new insulation (typically polyiso rigid board), new roofing membrane, new flashings around all penetrations (vents, pipes, HVAC units, skylights), new drip edge and perimeter metal, clean-up and debris removal, and both manufacturer and contractor warranties.</p>

  <p>Common extras that may not be included: tapered insulation for improved drainage, skylight replacement, parapet wall cap flashing, HVAC curb modifications, and structural deck repairs. Always ask contractors to specify what's included — the cheapest flat roof quote often excludes items that more detailed quotes include.</p>

  <h2>Key Factors That Affect Flat Roof Replacement Cost</h2>

  <h3>Number of Existing Layers</h3>
  <p>If your flat roof has multiple layers of old roofing materials, tear-off costs increase significantly. Each additional layer can add $1–$3 per square foot in removal and disposal. Ontario building codes typically require full tear-off when more than two layers exist on a flat roof.</p>

  <h3>Roof Access and Building Height</h3>
  <p>Downtown Toronto row houses with narrow laneways, or multi-storey commercial buildings without freight elevators, require more labour for material hoisting and debris removal. Difficult access can add 15–30% to your total flat roof replacement cost.</p>

  <h3>Insulation Requirements</h3>
  <p>The Ontario Building Code (OBC) requires minimum R-values for roof insulation. Upgrading insulation during a flat roof replacement adds cost but can reduce heating costs by 10–20%. Current code requires approximately R-31 for most commercial flat roofs in southern Ontario.</p>

  <h3>Structural Repairs</h3>
  <p>If the roof deck has water damage, rot, or sagging, structural repairs must be completed before the new flat roof membrane goes on. Deck replacement typically costs $3–$6 per square foot for plywood or $5–$10 per square foot for steel deck repairs in Ontario.</p>

  <div class="callout">
    <strong>Pro tip:</strong> Always get a moisture survey (infrared scan) before committing to a full flat roof replacement. If less than 25% of insulation is wet, a targeted repair or roof restoration may save you 40–60% versus a full replacement.
  </div>

  <h2>Flat Roof Repair vs. Full Replacement</h2>
  <p><strong>Repair makes sense</strong> when damage is localized (less than 15% of the roof), the flat roof is less than 15 years old, and a moisture survey shows less than 25% of insulation is saturated.</p>

  <p><strong>Full flat roof replacement makes sense</strong> when leaks are recurring in multiple locations, the roof has exceeded its expected lifespan, a moisture survey shows more than 25% wet insulation, or the roof has structural issues like sagging or chronic ponding water.</p>

  <h2>How to Get Competitive Flat Roof Quotes in Ontario</h2>
  <p>Getting the right price on your flat roof replacement starts with getting multiple quotes from qualified contractors. Get at least three quotes from contractors who specialize in flat roofing — not general roofers who primarily do shingle work. Ensure all quotes are based on the same scope of work, materials, and warranty terms. Check that contractors are licensed, insured, and in good standing with WSIB. Verify manufacturer certifications — contractors certified by membrane manufacturers like Soprema, Carlisle, or Firestone can offer extended warranties.</p>

  <div class="cta-box">
    <h3>Get Free Flat Roof Replacement Quotes</h3>
    <p>Submit your project details once and receive competitive quotes from pre-vetted flat roof contractors in Ontario. No cost, no obligation.</p>
    <a href="https://roofrfq.ca">Get Quotes →</a>
  </div>

  <h2>Frequently Asked Questions</h2>
  <div class="faq">
    <details>
      <summary>How long does a flat roof replacement take in Ontario?</summary>
      <div class="answer">Most residential flat roof replacements take 2–5 days. Commercial projects of 2,000–5,000 sq ft typically take 5–10 days. Larger industrial flat roof projects can take 2–4 weeks. Weather delays are common in Ontario, particularly during spring and fall.</div>
    </details>
    <details>
      <summary>What is the best flat roof material for Ontario's climate?</summary>
      <div class="answer">Modified bitumen and EPDM perform best in cold climates due to their flexibility at low temperatures. TPO is a strong choice if energy efficiency is a priority. PVC is ideal for buildings with chemical or grease exposure. There's no single "best" flat roof material — it depends on your building, budget, and performance requirements.</div>
    </details>
    <details>
      <summary>Do I need a permit to replace my flat roof in Ontario?</summary>
      <div class="answer">In most Ontario municipalities, replacing a flat roof with the same type of material does not require a permit. However, if you're changing the roofing system, adding insulation, or making structural modifications, a building permit may be required. Always check with your local building department before starting work.</div>
    </details>
    <details>
      <summary>Can you replace a flat roof in winter in Ontario?</summary>
      <div class="answer">Yes — some flat roofing systems can be installed in cold weather. Torch-applied modified bitumen works down to -10°C. TPO and PVC heat-welding works in cold temperatures but takes longer. Self-adhering membranes generally require temperatures above 5°C. Always discuss seasonal considerations with your flat roof contractor.</div>
    </details>
    <details>
      <summary>What warranty should I expect on a flat roof replacement?</summary>
      <div class="answer">A standard flat roof replacement in Ontario should come with two warranties: a contractor workmanship warranty (typically 5–10 years) and a manufacturer material warranty (typically 15–25 years, with some premium systems offering up to 30 years). Manufacturer-certified contractors can often provide extended warranty coverage.</div>
    </details>
  </div>

  <p style="margin-top:40px;font-size:14px;color:#666;">Pricing data reflects current Ontario flat roof replacement market rates from multiple contractor sources as of March 2026. For a personalized quote on your flat roof replacement project, visit <a href="https://roofrfq.ca" style="color:#e63946;">roofrfq.ca</a> to submit a free RFQ.</p>
</article>`;

  const schemas = [
    getArticleSchema(title, description, canonical, datePublished),
    getFaqSchema(faqs),
  ];

  return wrapHtml(title, description, canonical, body, schemas);
}

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);

  if (url.pathname === "/blog/flat-roof-replacement-cost-ontario") {
    return new Response(getFlatRoofCostOntario(), {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  return context.next();
};

export const config: Config = {
  path: ["/blog/*"],
};
