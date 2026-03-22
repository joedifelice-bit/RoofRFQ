# RoofRFQ — SEO & GEO Implementation Playbook

**Site:** roofrfq.ca · **Platform:** Webflow · **Date:** March 22, 2026

---

## 1. Technical SEO — Webflow Implementation

### 1.1 Global Meta Tags (Webflow → Project Settings → Custom Code → Head)

```html
<!-- Primary Meta -->
<meta name="description" content="Get competitive flat roof replacement quotes from vetted contractors across Canada. RoofRFQ simplifies the RFQ process for commercial and residential flat roofs — TPO, EPDM, PVC, modified bitumen.">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<link rel="canonical" href="https://roofrfq.ca/">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="RoofRFQ">
<meta property="og:title" content="RoofRFQ — Flat Roof Replacement Made Simple">
<meta property="og:description" content="Get competitive flat roof replacement quotes from vetted contractors across Canada.">
<meta property="og:url" content="https://roofrfq.ca/">
<meta property="og:image" content="https://roofrfq.ca/og-image.jpg">
<meta property="og:locale" content="en_CA">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="RoofRFQ — Flat Roof Replacement Made Simple">
<meta name="twitter:description" content="Get competitive flat roof replacement quotes from vetted contractors across Canada.">

<!-- Geo Tags (for Local SEO) -->
<meta name="geo.region" content="CA-ON">
<meta name="geo.placename" content="Toronto">
```

### 1.2 Organization Schema (Webflow → Project Settings → Custom Code → Footer)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "RoofRFQ",
  "url": "https://roofrfq.ca",
  "logo": "https://roofrfq.ca/logo.png",
  "description": "RoofRFQ simplifies flat roof replacement by connecting property owners with vetted roofing contractors through a streamlined RFQ process across Canada.",
  "areaServed": {
    "@type": "Country",
    "name": "Canada"
  },
  "serviceType": ["Flat Roof Replacement Quotes", "Roofing RFQ Platform", "Commercial Roofing Quotes"],
  "sameAs": [
    "https://www.linkedin.com/company/roofrfq",
    "https://www.instagram.com/roofrfq"
  ]
}
</script>
```

### 1.3 Service Schema (add to homepage or services page)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Flat Roof Replacement RFQ",
  "provider": {
    "@type": "Organization",
    "name": "RoofRFQ",
    "url": "https://roofrfq.ca"
  },
  "areaServed": [
    {"@type": "City", "name": "Toronto", "containedInPlace": {"@type": "Province", "name": "Ontario"}},
    {"@type": "City", "name": "Vancouver", "containedInPlace": {"@type": "Province", "name": "British Columbia"}},
    {"@type": "City", "name": "Calgary", "containedInPlace": {"@type": "Province", "name": "Alberta"}},
    {"@type": "City", "name": "Ottawa", "containedInPlace": {"@type": "Province", "name": "Ontario"}},
    {"@type": "City", "name": "Montreal", "containedInPlace": {"@type": "Province", "name": "Quebec"}}
  ],
  "description": "Submit one RFQ and receive competitive quotes from pre-vetted flat roof contractors. Covers TPO, EPDM, PVC, modified bitumen, and built-up roofing systems.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "CAD",
    "description": "Free to submit an RFQ"
  }
}
</script>
```

### 1.4 FAQ Schema (add to FAQ section / page)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does flat roof replacement cost in Canada?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Flat roof replacement in Canada typically costs $8–$16 per square foot, depending on material (TPO, EPDM, PVC, modified bitumen), roof size, insulation requirements, and regional labour rates. A 2,000 sq ft commercial flat roof generally ranges from $16,000 to $32,000. RoofRFQ helps you get competitive quotes to ensure fair pricing."
      }
    },
    {
      "@type": "Question",
      "name": "What is the best material for a flat roof in Canada?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The best flat roofing material depends on your building and climate. TPO offers excellent energy efficiency and UV resistance. EPDM is durable and cost-effective for cold climates. PVC provides superior chemical resistance for industrial buildings. Modified bitumen is a proven choice for harsh Canadian winters. RoofRFQ connects you with specialists in each system."
      }
    },
    {
      "@type": "Question",
      "name": "How does the RoofRFQ process work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Submit your flat roof project details through RoofRFQ. We match your project with pre-vetted roofing contractors who specialize in your roof type and location. You receive competitive quotes, compare them side-by-side, and choose the best fit. The entire process is free for property owners."
      }
    },
    {
      "@type": "Question",
      "name": "How long does flat roof replacement take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most flat roof replacements take 3–7 days for an average commercial building (2,000–5,000 sq ft). Larger projects or those requiring structural repairs may take 2–3 weeks. Weather delays are common in Canadian climates. RoofRFQ contractors provide detailed project timelines in their quotes."
      }
    }
  ]
}
</script>
```

### 1.5 Webflow SEO Settings Checklist

| Setting | Where in Webflow | Action |
|---------|-----------------|--------|
| SSL | Hosting → SSL | Ensure HTTPS is forced on |
| Sitemap | SEO → Auto-generated | Enable (auto at /sitemap.xml) |
| 301 Redirects | Hosting → 301 Redirects | Set www → non-www (or vice versa) |
| Custom 404 | Pages → 404 | Create branded 404 with links to key pages |
| Alt text | Every image | Add descriptive alt text with keywords |
| Page slugs | Page settings | Use clean slugs: /flat-roof-replacement-toronto |
| H1 tags | Designer | Exactly 1 H1 per page, keyword-rich |
| Open Graph image | Page settings → OG | Upload 1200×630 branded image per page |
| robots.txt | Hosting | Webflow generates automatically, verify at /robots.txt |

---

## 2. Keyword Strategy & Content Plan

### 2.1 Primary Keywords (High Intent)

| Keyword | Monthly Search Vol (est.) | Difficulty | Priority | Target Page |
|---------|--------------------------|------------|----------|-------------|
| flat roof replacement cost Canada | Medium | Medium | P1 | /flat-roof-replacement-cost |
| flat roof replacement Toronto | Medium | High | P1 | /flat-roof-replacement-toronto |
| commercial flat roof replacement | Medium | Medium | P1 | /commercial-flat-roof-replacement |
| flat roof RFQ | Low | Low | P1 | Homepage |
| flat roof contractors near me | High | High | P1 | /find-contractors |
| TPO roofing contractors Canada | Low-Med | Low | P2 | /tpo-roofing |
| EPDM roof replacement | Medium | Medium | P2 | /epdm-roofing |
| flat roof replacement quotes | Low-Med | Low | P1 | Homepage / CTA |

### 2.2 Long-Tail Keywords (Content Targets)

| Keyword Cluster | Content Type | URL Slug |
|----------------|--------------|----------|
| how much does flat roof replacement cost in Ontario | Guide | /blog/flat-roof-replacement-cost-ontario |
| TPO vs EPDM vs PVC flat roof comparison | Comparison guide | /blog/tpo-vs-epdm-vs-pvc |
| signs your flat roof needs replacement | Checklist | /blog/signs-flat-roof-needs-replacement |
| flat roof replacement process step by step | Guide | /blog/flat-roof-replacement-process |
| commercial flat roof maintenance schedule | Template | /blog/flat-roof-maintenance-schedule |
| flat roof insulation options Canada | Guide | /blog/flat-roof-insulation-canada |
| how to choose a flat roof contractor | Guide | /blog/how-to-choose-flat-roof-contractor |
| flat roof warranty what to look for | Guide | /blog/flat-roof-warranty-guide |
| flat roof replacement in winter Canada | Seasonal | /blog/flat-roof-replacement-winter |
| condo flat roof replacement who pays | FAQ | /blog/condo-flat-roof-replacement |

### 2.3 Local SEO Pages to Create

Build one landing page per market with unique content, local contractor info, and city-specific pricing:

| City | URL | Title Tag |
|------|-----|-----------|
| Toronto | /flat-roof-replacement-toronto | Flat Roof Replacement Toronto · Get Free Quotes · RoofRFQ |
| Vancouver | /flat-roof-replacement-vancouver | Flat Roof Replacement Vancouver · Get Free Quotes · RoofRFQ |
| Calgary | /flat-roof-replacement-calgary | Flat Roof Replacement Calgary · Get Free Quotes · RoofRFQ |
| Ottawa | /flat-roof-replacement-ottawa | Flat Roof Replacement Ottawa · Get Free Quotes · RoofRFQ |
| Montreal | /flat-roof-replacement-montreal | Flat Roof Replacement Montreal · Get Free Quotes · RoofRFQ |
| Edmonton | /flat-roof-replacement-edmonton | Flat Roof Replacement Edmonton · Get Free Quotes · RoofRFQ |
| Winnipeg | /flat-roof-replacement-winnipeg | Flat Roof Replacement Winnipeg · Get Free Quotes · RoofRFQ |
| Hamilton | /flat-roof-replacement-hamilton | Flat Roof Replacement Hamilton · Get Free Quotes · RoofRFQ |
| Mississauga | /flat-roof-replacement-mississauga | Flat Roof Replacement Mississauga · Get Free Quotes · RoofRFQ |
| Brampton | /flat-roof-replacement-brampton | Flat Roof Replacement Brampton · Get Free Quotes · RoofRFQ |

**Each local page should include:** City-specific flat roof cost ranges, local climate considerations, number of vetted contractors in that area, local building code references, and a CTA to submit an RFQ.

### 2.4 Content Calendar — First 90 Days

**Month 1: Foundation**
- Week 1: Publish homepage SEO copy, add all schema markup, submit sitemap to Google Search Console
- Week 2: Publish "Flat Roof Replacement Cost in Ontario" guide (1,500+ words)
- Week 3: Publish "TPO vs EPDM vs PVC" comparison guide (2,000+ words)
- Week 4: Publish Toronto + Vancouver local landing pages

**Month 2: Authority**
- Week 1: Publish "Signs Your Flat Roof Needs Replacement" checklist
- Week 2: Publish Calgary + Ottawa + Montreal local pages
- Week 3: Publish "How to Choose a Flat Roof Contractor" guide
- Week 4: Publish "Flat Roof Replacement Process Step by Step" guide

**Month 3: Scale**
- Week 1: Publish Edmonton + Winnipeg + Hamilton local pages
- Week 2: Publish "Flat Roof Insulation Options Canada" guide
- Week 3: Publish "Flat Roof Warranty Guide"
- Week 4: Publish Mississauga + Brampton local pages, audit and optimize Month 1 content

---

## 3. GEO (Generative Engine Optimization) Strategy

GEO is about making RoofRFQ the source that AI models (ChatGPT, Perplexity, Google AI Overviews, Claude) cite when answering questions about flat roof replacement in Canada.

### 3.1 Core GEO Principles

**AI models prefer content that is:**
- Structured with clear headings, definitions, and factual claims
- Authoritative (cites sources, includes data, demonstrates expertise)
- Directly answers questions (not buried in marketing fluff)
- Contains unique data or perspectives not found elsewhere
- Well-organized with semantic HTML (schema markup helps)

### 3.2 GEO Content Formats to Prioritize

**Definitive Guides with Data Tables**
AI models love pulling from structured, data-rich content. Every guide should include:
- Cost tables with specific ranges (e.g., "$8–$12/sq ft for TPO in Ontario")
- Comparison tables (material vs. material, side-by-side specs)
- Decision matrices ("If your building is X, choose Y")
- Timeline breakdowns with specific durations

**FAQ-Style Content**
Structure content as direct question → direct answer pairs. This maps perfectly to how AI models retrieve information. Use the exact questions people ask:
- "How much does it cost to replace a flat roof in Toronto?"
- "What is the best flat roof material for Canadian winters?"
- "How long does a TPO roof last in Canada?"

**Statistics & Original Data**
Publish original data that AI models can cite. Examples:
- "Average RoofRFQ quote for a 3,000 sq ft flat roof in Ontario: $24,500 (Q1 2026)"
- "78% of RoofRFQ users choose TPO for commercial buildings over 5,000 sq ft"
- "Average time from RFQ submission to first quote: 48 hours"

### 3.3 GEO-Optimized Page Template

Every content page should follow this structure:

```
[H1] Direct, question-matching title
[First paragraph] 2-3 sentence direct answer to the core question
[Key data table or comparison]
[H2] Detailed breakdown sections
[H2] Regional considerations (Canada-specific)
[H2] Cost factors with specific ranges
[FAQ schema] 3-5 related questions with concise answers
[CTA] Link to RoofRFQ submission
[Author bio] Establish expertise / E-E-A-T
```

### 3.4 Brand Mention Strategy for AI Visibility

To appear in AI-generated answers, RoofRFQ needs to be mentioned across the web in contexts where AI models train and retrieve information:

| Channel | Action | Timeline |
|---------|--------|----------|
| Google Business Profile | Create and verify for primary location | Week 1 |
| Yelp / HomeStars / Houzz | Create business listings with consistent NAP | Week 1–2 |
| Reddit | Participate in r/roofing, r/HomeImprovement, r/canadiancontractor | Ongoing |
| Quora | Answer flat roof questions, mention RoofRFQ naturally | Ongoing |
| Industry directories | List on Canadian Construction Association, provincial directories | Month 1 |
| Press releases | Announce platform launch via Canada Newswire | Month 1 |
| Guest posts | Contribute to construction industry blogs | Month 2–3 |
| YouTube | "How flat roof RFQ works" explainer video | Month 2 |
| Podcast appearances | Pitch to construction/real estate podcasts | Month 2–3 |

### 3.5 Technical GEO Signals

Add to every page in Webflow custom code:

```html
<!-- Speakable schema for voice/AI assistants -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".hero-text", ".faq-answer", ".cost-summary"]
  },
  "name": "Flat Roof Replacement Made Simple — RoofRFQ",
  "description": "Get competitive flat roof replacement quotes from vetted contractors across Canada."
}
</script>
```

### 3.6 AI-Citability Checklist

For every piece of content, verify:
- [ ] Title directly matches a common search query
- [ ] First 2 sentences provide a complete, standalone answer
- [ ] At least one data table with specific numbers
- [ ] FAQ schema markup is present
- [ ] Content includes "Canada" or specific city names
- [ ] Author byline with credentials
- [ ] Published date visible on page
- [ ] Internal links to related RoofRFQ pages
- [ ] External links to authoritative sources (NRC, provincial building codes)
- [ ] Content is 1,500+ words for guides, 500+ for local pages

---

## 4. Google Search Console & Analytics Setup

### 4.1 Immediate Actions

1. **Verify roofrfq.ca in Google Search Console** — use DNS TXT record method
2. **Submit sitemap** — https://roofrfq.ca/sitemap.xml
3. **Connect Google Analytics 4** — add GA4 tag in Webflow Project Settings → Custom Code → Head
4. **Set up Bing Webmaster Tools** — Bing data feeds into Copilot AI answers
5. **Register with Yandex Webmaster** — growing AI search player

### 4.2 Google Search Console Monitoring

Check weekly:
- Index coverage (ensure all pages are indexed)
- Core Web Vitals (Webflow generally scores well)
- Search queries driving impressions
- Click-through rates by page
- Manual actions or security issues

---

## 5. Quick Wins — Do This Today

1. Add all schema markup from Section 1 to Webflow custom code
2. Submit sitemap to Google Search Console
3. Create Google Business Profile
4. Publish first blog post: "Flat Roof Replacement Cost in Ontario"
5. Create HomeStars listing
6. Set up Bing Webmaster Tools
7. Add FAQ section to homepage with FAQ schema
8. Ensure every image has keyword-rich alt text
9. Set up 301 redirect from www to non-www (or vice versa)
10. Create and list on 5+ business directories with consistent NAP

---

*This playbook was generated for RoofRFQ on March 22, 2026. Review and update quarterly.*
