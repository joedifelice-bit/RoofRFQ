import type { Context, Config } from "@netlify/edge-functions";

const SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://roofrfq.ca/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://roofrfq.ca/blog/flat-roof-replacement-cost-ontario</loc><lastmod>2026-03-22</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://roofrfq.ca/blog/tpo-vs-epdm-vs-pvc</loc><lastmod>2026-03-22</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://roofrfq.ca/blog/signs-flat-roof-needs-replacement</loc><lastmod>2026-03-22</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://roofrfq.ca/blog/how-to-choose-flat-roof-contractor</loc><lastmod>2026-03-22</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://roofrfq.ca/blog/flat-roof-replacement-process</loc><lastmod>2026-03-22</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://roofrfq.ca/flat-roof-replacement-toronto</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://roofrfq.ca/flat-roof-replacement-vancouver</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://roofrfq.ca/flat-roof-replacement-calgary</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://roofrfq.ca/flat-roof-replacement-ottawa</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://roofrfq.ca/flat-roof-replacement-montreal</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://roofrfq.ca/flat-roof-replacement-edmonton</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://roofrfq.ca/flat-roof-replacement-winnipeg</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://roofrfq.ca/flat-roof-replacement-hamilton</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://roofrfq.ca/flat-roof-replacement-mississauga</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://roofrfq.ca/flat-roof-replacement-brampton</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
</urlset>`;

const ROBOTS_TXT = `User-agent: *
Allow: /

Sitemap: https://roofrfq.ca/sitemap.xml

Disallow: /api/
Disallow: /_next/
Disallow: /static/chunk/`;

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  if (url.pathname === "/sitemap.xml") {
    return new Response(SITEMAP_XML, { headers: { "content-type": "application/xml; charset=utf-8" } });
  }
  if (url.pathname === "/robots.txt") {
    return new Response(ROBOTS_TXT, { headers: { "content-type": "text/plain; charset=utf-8" } });
  }
  return context.next();
};

export const config: Config = { path: ["/sitemap.xml", "/robots.txt"] };
