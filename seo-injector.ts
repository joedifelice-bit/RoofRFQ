import type { Context, Config } from "@netlify/edge-functions";

// ============================================================
// RoofRFQ SEO & GEO Injector — Netlify Edge Function
// Injects schema markup, meta tags, and structured data
// into every HTML response before it reaches the browser.
// ============================================================

// ---------- SCHEMA MARKUP ----------

const organizationSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "RoofRFQ",
  url: "https://roofrfq.ca",
  logo: "https://roofrfq.ca/logo.png",
  description:
    "RoofRFQ simplifies flat roof replacement by connecting property owners with vetted roofing contractors through a streamlined RFQ process across Canada.",
  foundingDate: "2026",
  areaServed: { "@type": "Country", name: "Canada" },
  knowsAbout: [
    "Flat roof replacement",
    "TPO roofing",
    "EPDM roofing",
    "PVC roofing",
    "Modified bitumen roofing",
    "Built-up roofing",
    "Commercial roofing",
    "Roofing RFQ process",
  ],
  sameAs: [],
});

const serviceSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Flat Roof Replacement RFQ Platform",
  provider: {
    "@type": "Organization",
    name: "RoofRFQ",
    url: "https://roofrfq.ca",
  },
  areaServed: [
    { "@type": "City", name: "Toronto" },
    { "@type": "City", name: "Vancouver" },
    { "@type": "City", name: "Calgary" },
    { "@type": "City", name: "Ottawa" },
    { "@type": "City", name: "Montreal" },
    { "@type": "City", name: "Edmonton" },
    { "@type": "City", name: "Winnipeg" },
    { "@type": "City", name: "Hamilton" },
    { "@type": "City", name: "Mississauga" },
    { "@type": "City", name: "Brampton" },
  ],
  description:
    "Submit one RFQ and receive competitive quotes from pre-vetted flat roof contractors. Covers TPO, EPDM, PVC, modified bitumen, and built-up roofing systems.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CAD",
    description: "Free to submit — no cost to property owners",
  },
});

const faqSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does flat roof replacement cost in Canada?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Flat roof replacement in Canada typically costs $8 to $16 per square foot, depending on the material (TPO, EPDM, PVC, modified bitumen), roof size, insulation requirements, and regional labour rates. A 2,000 sq ft commercial flat roof generally ranges from $16,000 to $32,000. RoofRFQ helps you get competitive quotes to ensure fair pricing.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best material for a flat roof in Canada?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The best flat roofing material depends on your building and climate. TPO offers excellent energy efficiency and UV resistance. EPDM is durable and cost-effective for cold climates. PVC provides superior chemical resistance for industrial buildings. Modified bitumen is a proven choice for harsh Canadian winters.",
      },
    },
    {
      "@type": "Question",
      name: "How does the RoofRFQ process work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Submit your flat roof project details through RoofRFQ. We match your project with pre-vetted roofing contractors who specialize in your roof type and location. You receive competitive quotes, compare them side-by-side, and choose the best fit. The entire process is free for property owners.",
      },
    },
    {
      "@type": "Question",
      name: "How long does a flat roof replacement take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most flat roof replacements take 3 to 7 days for an average commercial building (2,000 to 5,000 sq ft). Larger projects or those requiring structural repairs may take 2 to 3 weeks. Weather delays are common in Canadian climates.",
      },
    },
    {
      "@type": "Question",
      name: "What types of flat roofs does RoofRFQ cover?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "RoofRFQ covers all major flat roofing systems: TPO (Thermoplastic Polyolefin), EPDM (Ethylene Propylene Diene Monomer), PVC (Polyvinyl Chloride), modified bitumen (SBS and APP), built-up roofing (BUR/tar and gravel), and spray polyurethane foam (SPF). Both commercial and residential flat roofs are supported.",
      },
    },
  ],
});

const speakableSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "RoofRFQ — Flat Roof Replacement Made Simple",
  description:
    "Get competitive flat roof replacement quotes from vetted contractors across Canada.",
  url: "https://roofrfq.ca",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", ".hero-description", ".faq-answer", "main p:first-of-type"],
  },
  about: {
    "@type": "Thing",
    name: "Flat Roof Replacement",
    description:
      "The process of removing and replacing a flat or low-slope roofing system on commercial or residential buildings.",
  },
});

// ---------- PAGE-SPECIFIC META ----------

interface PageMeta {
  title: string;
  description: string;
  canonical: string;
}

const pageMeta: Record<string, PageMeta> = {
  "/": {
    title: "Flat Roof Replacement Made Simple — RoofRFQ",
    description:
      "Get competitive flat roof replacement quotes from vetted contractors across Canada. Free RFQ platform for TPO, EPDM, PVC, and modified bitumen flat roofs.",
    canonical: "https://roofrfq.ca/",
  },
  "/about": {
    title: "About RoofRFQ — Canada's Flat Roof RFQ Platform",
    description:
      "RoofRFQ connects property owners with pre-vetted flat roof contractors across Canada. Learn how our free RFQ platform simplifies roof replacement.",
    canonical: "https://roofrfq.ca/about",
  },
  "/flat-roof-replacement-toronto": {
    title: "Flat Roof Replacement Toronto — Get Free Quotes | RoofRFQ",
    description:
      "Get competitive flat roof replacement quotes from vetted Toronto contractors. TPO, EPDM, PVC, modified bitumen. Free RFQ — no obligation.",
    canonical: "https://roofrfq.ca/flat-roof-replacement-toronto",
  },
  "/flat-roof-replacement-vancouver": {
    title: "Flat Roof Replacement Vancouver — Get Free Quotes | RoofRFQ",
    description:
      "Get competitive flat roof replacement quotes from vetted Vancouver contractors. TPO, EPDM, PVC, modified bitumen. Free RFQ — no obligation.",
    canonical: "https://roofrfq.ca/flat-roof-replacement-vancouver",
  },
  "/flat-roof-replacement-calgary": {
    title: "Flat Roof Replacement Calgary — Get Free Quotes | RoofRFQ",
    description:
      "Get competitive flat roof replacement quotes from vetted Calgary contractors. TPO, EPDM, PVC, modified bitumen. Free RFQ — no obligation.",
    canonical: "https://roofrfq.ca/flat-roof-replacement-calgary",
  },
  "/flat-roof-replacement-ottawa": {
    title: "Flat Roof Replacement Ottawa — Get Free Quotes | RoofRFQ",
    description:
      "Get competitive flat roof replacement quotes from vetted Ottawa contractors. TPO, EPDM, PVC, modified bitumen. Free RFQ — no obligation.",
    canonical: "https://roofrfq.ca/flat-roof-replacement-ottawa",
  },
  "/flat-roof-replacement-montreal": {
    title: "Flat Roof Replacement Montreal — Get Free Quotes | RoofRFQ",
    description:
      "Get competitive flat roof replacement quotes from vetted Montreal contractors. TPO, EPDM, PVC, modified bitumen. Free RFQ — no obligation.",
    canonical: "https://roofrfq.ca/flat-roof-replacement-montreal",
  },
};

// ---------- BUILD INJECTION HTML ----------

function buildHeadInjection(pathname: string): string {
  const meta = pageMeta[pathname] || pageMeta["/"];

  return `
<!-- ===== RoofRFQ SEO Injector (Netlify Edge Function) ===== -->

<!-- Primary Meta -->
<meta name="description" content="${meta.description}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<link rel="canonical" href="${meta.canonical}">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="RoofRFQ">
<meta property="og:title" content="${meta.title}">
<meta property="og:description" content="${meta.description}">
<meta property="og:url" content="${meta.canonical}">
<meta property="og:image" content="https://roofrfq.ca/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_CA">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${meta.title}">
<meta name="twitter:description" content="${meta.description}">
<meta name="twitter:image" content="https://roofrfq.ca/og-image.jpg">

<!-- Geo Tags -->
<meta name="geo.region" content="CA-ON">
<meta name="geo.placename" content="Toronto">
<meta name="geo.position" content="43.6532;-79.3832">
<meta name="ICBM" content="43.6532, -79.3832">

<!-- ===== END SEO META ===== -->
`;
}

function buildBodyEndInjection(): string {
  return `
<!-- ===== RoofRFQ Schema Markup (Netlify Edge Function) ===== -->
<script type="application/ld+json">${organizationSchema}</script>
<script type="application/ld+json">${serviceSchema}</script>
<script type="application/ld+json">${faqSchema}</script>
<script type="application/ld+json">${speakableSchema}</script>
<!-- ===== END Schema Markup ===== -->
`;
}

// ---------- EDGE FUNCTION ----------

export default async (req: Request, context: Context) => {
  // Get the original response
  const response = await context.next();

  // Only modify HTML responses
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  let html = await response.text();
  const url = new URL(req.url);
  const pathname = url.pathname.replace(/\/$/, "") || "/";

  // Inject meta tags into <head>
  const headInjection = buildHeadInjection(pathname);
  if (html.includes("</head>")) {
    html = html.replace("</head>", `${headInjection}</head>`);
  }

  // Inject schema markup before </body>
  const bodyInjection = buildBodyEndInjection();
  if (html.includes("</body>")) {
    html = html.replace("</body>", `${bodyInjection}</body>`);
  }

  // Return modified response with original headers
  const newHeaders = new Headers(response.headers);
  newHeaders.delete("content-length"); // Recalculate after modification

  return new Response(html, {
    status: response.status,
    headers: newHeaders,
  });
};

export const config: Config = {
  path: "/*",
  excludedPath: ["/assets/*", "/_next/*", "/static/*", "/images/*", "/*.js", "/*.css", "/*.json", "/*.xml", "/*.txt", "/*.ico", "/*.png", "/*.jpg", "/*.svg", "/*.woff*"],
};
