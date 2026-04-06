import type { Context, Config } from "@netlify/edge-functions";

const GA_ID = "G-JS5X88KCTR";

interface CityData {
  name: string;
  province: string;
  costRange: string;
  typicalProject: string;
  materials: { name: string; cost: string; life: string }[];
  whyMore: { title: string; desc: string }[];
  areas: string[];
  climate: string;
  faqs: { q: string; a: string }[];
}

const cities: Record<string, CityData> = {
  "flat-roof-replacement-toronto": {
    name: "Toronto",
    province: "Ontario",
    costRange: "$12–$25",
    typicalProject: "$18K–$45K",
    materials: [
      { name: "Modified bitumen", cost: "$10–$16", life: "15–25 yrs" },
      { name: "EPDM (rubber)", cost: "$10–$18", life: "20–30 yrs" },
      { name: "TPO", cost: "$12–$20", life: "20–30 yrs" },
      { name: "PVC", cost: "$14–$25", life: "25–35 yrs" },
      { name: "Built-up (BUR)", cost: "$12–$18", life: "20–30 yrs" },
    ],
    whyMore: [
      { title: "Urban access challenges", desc: "Narrow laneways, tight lot lines, and multi-storey buildings increase labour for hoisting materials and removing debris across the GTA." },
      { title: "Higher labour rates", desc: "GTA labour rates for skilled flat roofers run 15–25% above provincial averages due to high demand and cost of living." },
      { title: "Strict permitting", desc: "City of Toronto permitting adds timeline and cost, particularly for heritage buildings and multi-unit residential properties." },
      { title: "Freeze-thaw cycles", desc: "Toronto averages 40+ freeze-thaw cycles per winter, accelerating membrane deterioration. Cold-flexible materials like EPDM and mod-bit are strongly recommended." },
    ],
    areas: ["Downtown Toronto", "North York", "Scarborough", "Etobicoke", "East York", "York", "Mississauga", "Brampton", "Markham", "Richmond Hill", "Vaughan", "Oakville"],
    climate: "Toronto's climate demands flat roofing materials with excellent cold-weather flexibility. Winters bring heavy snow loads, ice damming, and repeated freeze-thaw cycles that stress membrane seams. Modified bitumen and EPDM are the most popular choices for Toronto flat roofs due to their proven performance in these conditions.",
    faqs: [
      { q: "How much does flat roof replacement cost in Toronto?", a: "Toronto flat roof replacement costs $12–$25 per sq ft installed, with most commercial projects ranging from $18,000 to $45,000 for a 2,000 sq ft roof." },
      { q: "What is the best flat roof material for Toronto?", a: "Modified bitumen and EPDM are top choices due to cold-weather flexibility. TPO is popular for commercial buildings prioritizing energy efficiency." },
      { q: "Do I need a permit for flat roof replacement in Toronto?", a: "Like-for-like replacement typically doesn't require a permit. Changing roofing systems or structural work may require one from the City of Toronto." },
    ],
  },
  "flat-roof-replacement-vancouver": {
    name: "Vancouver",
    province: "British Columbia",
    costRange: "$11–$22",
    typicalProject: "$16K–$40K",
    materials: [
      { name: "Modified bitumen", cost: "$9–$15", life: "15–25 yrs" },
      { name: "EPDM (rubber)", cost: "$9–$16", life: "20–30 yrs" },
      { name: "TPO", cost: "$11–$19", life: "20–30 yrs" },
      { name: "PVC", cost: "$13–$22", life: "25–35 yrs" },
      { name: "Built-up (BUR)", cost: "$10–$16", life: "20–30 yrs" },
    ],
    whyMore: [
      { title: "Rain-heavy climate", desc: "Vancouver receives over 1,100mm of rain annually. Flat roofs must have exceptional waterproofing and drainage to prevent ponding and leaks." },
      { title: "Moisture management", desc: "High humidity and persistent rain mean vapour barriers and insulation must be carefully specified to prevent condensation damage inside the roof assembly." },
      { title: "Seismic considerations", desc: "Vancouver's seismic zone means roof assemblies must account for movement. Flexible membrane systems like EPDM and modified bitumen handle this well." },
      { title: "Skilled labour demand", desc: "Vancouver's construction boom keeps flat roof contractor availability tight, which can affect scheduling and pricing during peak season." },
    ],
    areas: ["Downtown Vancouver", "West End", "Kitsilano", "Mount Pleasant", "Commercial Drive", "Burnaby", "New Westminster", "North Vancouver", "West Vancouver", "Richmond", "Surrey", "Coquitlam"],
    climate: "Vancouver's wet, mild climate makes waterproofing the top priority for flat roofs. Unlike Ontario, freeze-thaw is less of a concern — but persistent rain and humidity demand superior drainage and moisture management. PVC and TPO are excellent choices for Vancouver due to their heat-welded watertight seams.",
    faqs: [
      { q: "How much does flat roof replacement cost in Vancouver?", a: "Vancouver flat roof replacement costs $11–$22 per sq ft installed. A typical 2,000 sq ft commercial project ranges from $16,000 to $40,000." },
      { q: "What flat roof material handles Vancouver rain best?", a: "PVC and TPO with heat-welded seams provide the best waterproofing for Vancouver's heavy rainfall. EPDM is also reliable with proper drainage." },
      { q: "How often should I inspect my flat roof in Vancouver?", a: "At least twice yearly — before and after the rainy season (October and April). Clear drains and gutters regularly to prevent ponding." },
    ],
  },
  "flat-roof-replacement-calgary": {
    name: "Calgary",
    province: "Alberta",
    costRange: "$9–$20",
    typicalProject: "$14K–$36K",
    materials: [
      { name: "Modified bitumen", cost: "$8–$14", life: "15–20 yrs" },
      { name: "EPDM (rubber)", cost: "$8–$15", life: "20–30 yrs" },
      { name: "TPO", cost: "$10–$18", life: "20–25 yrs" },
      { name: "PVC", cost: "$12–$20", life: "25–30 yrs" },
      { name: "Built-up (BUR)", cost: "$9–$15", life: "20–25 yrs" },
    ],
    whyMore: [
      { title: "Extreme temperature swings", desc: "Calgary can swing 30°C+ in a single day during chinook events. This thermal shock stresses flat roof membranes and seams more than almost any other Canadian city." },
      { title: "Hail exposure", desc: "Calgary is Canada's hail capital. Flat roofs need impact-resistant membranes and may require more frequent inspections after summer storms." },
      { title: "High UV exposure", desc: "Calgary gets more sunshine hours than most Canadian cities. UV degradation is a real concern — reflective TPO or PVC membranes help combat this." },
      { title: "Wind uplift", desc: "Strong chinook winds create significant uplift forces on flat roofs. Proper mechanical fastening or full adhesion is critical for Calgary flat roof installations." },
    ],
    areas: ["Downtown Calgary", "Beltline", "Kensington", "Inglewood", "Bridgeland", "Airdrie", "Cochrane", "Okotoks", "Chestermere", "SE Industrial", "NE Industrial", "Balzac"],
    climate: "Calgary's extreme temperature swings, chinook winds, hail risk, and high UV exposure create some of the toughest conditions for flat roofs in Canada. EPDM's flexibility handles thermal cycling well, while TPO's reflective surface combats UV degradation. Impact resistance should be a key consideration for any Calgary flat roof replacement.",
    faqs: [
      { q: "How much does flat roof replacement cost in Calgary?", a: "Calgary flat roof replacement costs $9–$20 per sq ft installed. A typical 2,000 sq ft commercial project ranges from $14,000 to $36,000." },
      { q: "What flat roof material handles Calgary hail best?", a: "PVC and modified bitumen offer the best impact resistance. Consider thicker membrane gauges and reinforced options for hail-prone areas." },
      { q: "Do chinook winds affect flat roof replacement?", a: "Yes. Chinook winds create strong uplift forces. Calgary flat roofs need proper mechanical fastening or full adhesion to resist wind damage." },
    ],
  },
  "flat-roof-replacement-ottawa": {
    name: "Ottawa",
    province: "Ontario",
    costRange: "$10–$20",
    typicalProject: "$15K–$36K",
    materials: [
      { name: "Modified bitumen", cost: "$8–$14", life: "15–25 yrs" },
      { name: "EPDM (rubber)", cost: "$8–$16", life: "20–30 yrs" },
      { name: "TPO", cost: "$10–$18", life: "20–30 yrs" },
      { name: "PVC", cost: "$12–$20", life: "25–35 yrs" },
      { name: "Built-up (BUR)", cost: "$9–$15", life: "20–30 yrs" },
    ],
    whyMore: [
      { title: "Extreme winter cold", desc: "Ottawa is one of the coldest national capitals in the world. Flat roof membranes must maintain flexibility at -30°C and below." },
      { title: "Heavy snow loads", desc: "Ottawa averages over 200cm of snowfall annually. Flat roofs must be engineered for significant snow load and proper drainage when melt occurs." },
      { title: "Heritage building stock", desc: "Ottawa's older government and heritage buildings often have complex flat roof configurations requiring specialized contractor expertise." },
      { title: "Bilingual contractor market", desc: "Access to both English and French-speaking contractors creates price competition, which can work in property owners' favour." },
    ],
    areas: ["Centretown", "Byward Market", "Glebe", "Westboro", "Kanata", "Barrhaven", "Orleans", "Nepean", "Gatineau", "Vanier", "Alta Vista", "Hunt Club"],
    climate: "Ottawa's brutal winters — regularly hitting -25°C to -35°C — demand flat roofing materials with exceptional cold-weather performance. EPDM rubber is the top choice for Ottawa due to its flexibility at extreme low temperatures. Modified bitumen with SBS polymers is also excellent. Snow load management and proper drainage are critical design considerations.",
    faqs: [
      { q: "How much does flat roof replacement cost in Ottawa?", a: "Ottawa flat roof replacement costs $10–$20 per sq ft installed. A typical 2,000 sq ft commercial project ranges from $15,000 to $36,000." },
      { q: "What flat roof material is best for Ottawa winters?", a: "EPDM rubber is the top choice — it stays flexible at -40°C. Modified bitumen with SBS polymers is also excellent for Ottawa's extreme cold." },
      { q: "How do I manage snow load on my Ottawa flat roof?", a: "Ensure proper drainage paths and consider tapered insulation during replacement. Have snow removed when accumulation exceeds your roof's design load." },
    ],
  },
  "flat-roof-replacement-montreal": {
    name: "Montreal",
    province: "Quebec",
    costRange: "$10–$22",
    typicalProject: "$16K–$40K",
    materials: [
      { name: "Modified bitumen", cost: "$9–$15", life: "15–25 yrs" },
      { name: "EPDM (rubber)", cost: "$9–$16", life: "20–30 yrs" },
      { name: "TPO", cost: "$11–$19", life: "20–30 yrs" },
      { name: "PVC", cost: "$13–$22", life: "25–35 yrs" },
      { name: "Built-up (BUR)", cost: "$10–$16", life: "20–30 yrs" },
    ],
    whyMore: [
      { title: "Harsh winter climate", desc: "Montreal's winters are long and severe, with heavy snowfall and temperatures regularly below -20°C. Flat roof materials must withstand extreme freeze-thaw cycling." },
      { title: "Aging building stock", desc: "Montreal has one of the oldest building stocks in Canada. Many flat roofs sit on century-old structures requiring careful assessment and potential deck repairs." },
      { title: "RBQ licensing requirements", desc: "Quebec's Régie du bâtiment du Québec (RBQ) licensing adds a layer of contractor regulation. Ensure your flat roof contractor holds valid RBQ certification." },
      { title: "Density and access", desc: "Montreal's dense urban neighbourhoods — the Plateau, Mile End, Rosemont — have tight access that increases labour costs for flat roof replacement." },
    ],
    areas: ["Plateau Mont-Royal", "Mile End", "Rosemont", "Villeray", "Verdun", "NDG", "Hochelaga", "Griffintown", "Old Montreal", "Laval", "Longueuil", "Brossard"],
    climate: "Montreal's combination of heavy snowfall, extreme cold, and aging building infrastructure makes flat roof replacement both critical and complex. Modified bitumen has traditionally dominated Montreal's flat roof market, but TPO and EPDM are gaining ground on commercial buildings. Quebec's RBQ licensing requirements add an extra layer of contractor vetting.",
    faqs: [
      { q: "How much does flat roof replacement cost in Montreal?", a: "Montreal flat roof replacement costs $10–$22 per sq ft installed. A typical 2,000 sq ft project ranges from $16,000 to $40,000." },
      { q: "Do I need an RBQ-licensed contractor in Montreal?", a: "Yes. Quebec law requires contractors performing flat roof replacement to hold valid RBQ certification. Always verify before hiring." },
      { q: "What flat roof material is most common in Montreal?", a: "Modified bitumen is the traditional choice due to excellent cold performance. TPO and EPDM are increasingly popular for commercial flat roofs." },
    ],
  },
  "flat-roof-replacement-edmonton": {
    name: "Edmonton",
    province: "Alberta",
    costRange: "$9–$19",
    typicalProject: "$14K–$34K",
    materials: [
      { name: "Modified bitumen", cost: "$8–$13", life: "12–20 yrs" },
      { name: "EPDM (rubber)", cost: "$8–$15", life: "20–30 yrs" },
      { name: "TPO", cost: "$10–$17", life: "18–25 yrs" },
      { name: "PVC", cost: "$12–$19", life: "25–30 yrs" },
      { name: "Built-up (BUR)", cost: "$9–$15", life: "18–25 yrs" },
    ],
    whyMore: [
      { title: "Extreme cold", desc: "Edmonton regularly hits -30°C to -40°C in winter. Only the most cold-flexible flat roof membranes survive without cracking or splitting." },
      { title: "Short installation season", desc: "Edmonton's reliable flat roof installation window runs May to October. Off-season work is possible but more expensive and weather-dependent." },
      { title: "UV and summer heat", desc: "Edmonton's long summer days bring significant UV exposure. Reflective membranes like TPO help reduce cooling costs on commercial flat roofs." },
      { title: "Industrial demand", desc: "Edmonton's oil and gas sector drives demand for industrial flat roof contractors, which can affect availability and pricing for commercial projects." },
    ],
    areas: ["Downtown Edmonton", "Old Strathcona", "Whyte Ave", "West Edmonton", "Sherwood Park", "St. Albert", "Leduc", "Spruce Grove", "Fort Saskatchewan", "Nisku Industrial", "South Edmonton", "Windermere"],
    climate: "Edmonton is one of Canada's coldest major cities — flat roof materials here must handle extreme cold, heavy snow loads, and intense summer UV. EPDM rubber is the top performer for Edmonton's temperature extremes. The short installation season means planning ahead is essential for competitive pricing.",
    faqs: [
      { q: "How much does flat roof replacement cost in Edmonton?", a: "Edmonton flat roof replacement costs $9–$19 per sq ft installed. A typical 2,000 sq ft project ranges from $14,000 to $34,000." },
      { q: "When is the best time to replace a flat roof in Edmonton?", a: "May through October is the ideal window. Book contractors in early spring for best availability and pricing during peak season." },
      { q: "What flat roof material handles Edmonton's cold best?", a: "EPDM rubber is the top choice — flexible at -40°C. Modified bitumen with SBS polymers is also excellent for extreme cold." },
    ],
  },
  "flat-roof-replacement-winnipeg": {
    name: "Winnipeg",
    province: "Manitoba",
    costRange: "$8–$18",
    typicalProject: "$12K–$32K",
    materials: [
      { name: "Modified bitumen", cost: "$7–$13", life: "12–20 yrs" },
      { name: "EPDM (rubber)", cost: "$8–$15", life: "20–30 yrs" },
      { name: "TPO", cost: "$9–$16", life: "18–25 yrs" },
      { name: "PVC", cost: "$11–$18", life: "25–30 yrs" },
      { name: "Built-up (BUR)", cost: "$8–$14", life: "18–25 yrs" },
    ],
    whyMore: [
      { title: "Extreme temperature range", desc: "Winnipeg swings from -40°C winters to +35°C summers — an 75°C range that punishes flat roof membranes harder than almost anywhere in Canada." },
      { title: "Lowest cost market", desc: "Winnipeg generally offers the most competitive flat roof pricing among major Canadian cities due to lower labour and overhead costs." },
      { title: "Heavy snow loads", desc: "Winnipeg's heavy, wet spring snow creates significant load on flat roofs. Proper structural capacity and drainage are essential." },
      { title: "Wind exposure", desc: "The prairies deliver sustained high winds that create uplift forces on flat roofs. Mechanical fastening is often preferred over adhesive-only systems." },
    ],
    areas: ["Downtown Winnipeg", "Exchange District", "St. Boniface", "Osborne Village", "Wolseley", "River Heights", "Transcona", "St. Vital", "St. James", "North Kildonan", "Fort Garry", "Headingley"],
    climate: "Winnipeg has one of the most extreme temperature ranges of any major city in the world. Flat roof materials must handle -40°C winters and +35°C summers without failure. EPDM's flexibility across this range makes it the go-to choice. Wind uplift resistance is also critical on the exposed prairies.",
    faqs: [
      { q: "How much does flat roof replacement cost in Winnipeg?", a: "Winnipeg flat roof replacement costs $8–$18 per sq ft installed. A typical 2,000 sq ft project ranges from $12,000 to $32,000." },
      { q: "Why is flat roofing cheaper in Winnipeg?", a: "Lower labour rates and overhead costs compared to Toronto and Vancouver make Winnipeg one of the most affordable markets for flat roof replacement." },
      { q: "What flat roof material handles Winnipeg's extremes?", a: "EPDM rubber handles the -40°C to +35°C range exceptionally well. Modified bitumen with SBS polymers is also proven in prairie climates." },
    ],
  },
  "flat-roof-replacement-hamilton": {
    name: "Hamilton",
    province: "Ontario",
    costRange: "$9–$18",
    typicalProject: "$14K–$32K",
    materials: [
      { name: "Modified bitumen", cost: "$8–$13", life: "15–25 yrs" },
      { name: "EPDM (rubber)", cost: "$8–$15", life: "20–30 yrs" },
      { name: "TPO", cost: "$10–$17", life: "20–30 yrs" },
      { name: "PVC", cost: "$11–$18", life: "25–35 yrs" },
      { name: "Built-up (BUR)", cost: "$9–$15", life: "20–30 yrs" },
    ],
    whyMore: [
      { title: "Industrial building stock", desc: "Hamilton's steel city heritage means a large inventory of industrial flat roofs that often require specialized membrane systems and structural assessments." },
      { title: "Competitive pricing", desc: "Hamilton offers 10–15% lower flat roof pricing than Toronto while maintaining access to GTA-quality contractors." },
      { title: "Escarpment climate effect", desc: "The Niagara Escarpment creates microclimates — buildings above and below the mountain can experience different wind and precipitation patterns." },
      { title: "Growing market", desc: "Hamilton's construction boom is increasing demand for flat roof contractors, though pricing remains more competitive than the GTA." },
    ],
    areas: ["Downtown Hamilton", "Westdale", "Dundas", "Ancaster", "Stoney Creek", "Grimsby", "Burlington", "Binbrook", "Waterdown", "Hamilton Mountain", "East Hamilton", "Industrial Core"],
    climate: "Hamilton benefits from slightly milder winters than Toronto due to lake effect, but still experiences significant freeze-thaw cycling. The city's large industrial building stock means many flat roofs are on commercial and warehouse properties requiring durable, cost-effective membrane systems. Modified bitumen and EPDM dominate the Hamilton market.",
    faqs: [
      { q: "How much does flat roof replacement cost in Hamilton?", a: "Hamilton flat roof replacement costs $9–$18 per sq ft installed. A typical 2,000 sq ft project ranges from $14,000 to $32,000." },
      { q: "Is Hamilton cheaper than Toronto for flat roof replacement?", a: "Yes, typically 10–15% less than Toronto due to lower labour and overhead costs while still having access to quality GTA contractors." },
      { q: "What flat roof material is best for Hamilton industrial buildings?", a: "EPDM and TPO are popular for large industrial flat roofs. Modified bitumen is common for smaller commercial properties." },
    ],
  },
  "flat-roof-replacement-mississauga": {
    name: "Mississauga",
    province: "Ontario",
    costRange: "$11–$23",
    typicalProject: "$17K–$42K",
    materials: [
      { name: "Modified bitumen", cost: "$9–$15", life: "15–25 yrs" },
      { name: "EPDM (rubber)", cost: "$9–$17", life: "20–30 yrs" },
      { name: "TPO", cost: "$11–$19", life: "20–30 yrs" },
      { name: "PVC", cost: "$13–$23", life: "25–35 yrs" },
      { name: "Built-up (BUR)", cost: "$10–$16", life: "20–30 yrs" },
    ],
    whyMore: [
      { title: "GTA pricing zone", desc: "Mississauga sits within the GTA pricing zone, with labour rates close to Toronto's but typically 5–10% lower due to easier suburban access." },
      { title: "Large commercial inventory", desc: "Mississauga's business parks, warehouses, and industrial zones represent a huge volume of commercial flat roofs requiring regular replacement." },
      { title: "Airport proximity", desc: "Buildings near Pearson Airport may have additional requirements around roofing materials and installation timing due to flight path regulations." },
      { title: "Rapid growth", desc: "Mississauga's ongoing development keeps flat roof contractor demand high. Book early in the season for the best scheduling and pricing." },
    ],
    areas: ["City Centre", "Square One", "Meadowvale", "Streetsville", "Port Credit", "Clarkson", "Erin Mills", "Malton", "Dixie", "Cooksville", "Hurontario Corridor", "Airport Corporate Centre"],
    climate: "Mississauga shares Toronto's climate challenges — freeze-thaw cycles, winter snow loads, and summer heat — but offers slightly better contractor access and pricing due to its suburban layout. The city's massive commercial and industrial footprint makes flat roof replacement a constant need. TPO is increasingly popular for Mississauga's commercial buildings.",
    faqs: [
      { q: "How much does flat roof replacement cost in Mississauga?", a: "Mississauga flat roof replacement costs $11–$23 per sq ft installed. A typical 2,000 sq ft project ranges from $17,000 to $42,000." },
      { q: "Is Mississauga cheaper than Toronto for flat roofing?", a: "Slightly — typically 5–10% less than downtown Toronto due to easier suburban access, though still within the GTA pricing zone." },
      { q: "What flat roof material is popular for Mississauga commercial buildings?", a: "TPO is the fastest-growing choice for commercial flat roofs in Mississauga due to energy efficiency and competitive pricing." },
    ],
  },
  "flat-roof-replacement-brampton": {
    name: "Brampton",
    province: "Ontario",
    costRange: "$10–$21",
    typicalProject: "$15K–$38K",
    materials: [
      { name: "Modified bitumen", cost: "$8–$14", life: "15–25 yrs" },
      { name: "EPDM (rubber)", cost: "$9–$16", life: "20–30 yrs" },
      { name: "TPO", cost: "$10–$18", life: "20–30 yrs" },
      { name: "PVC", cost: "$12–$21", life: "25–35 yrs" },
      { name: "Built-up (BUR)", cost: "$9–$15", life: "20–30 yrs" },
    ],
    whyMore: [
      { title: "Warehouse and logistics hub", desc: "Brampton is one of Canada's largest warehouse and logistics hubs. Large industrial flat roofs (10,000+ sq ft) are common, requiring specialized contractors." },
      { title: "GTA-adjacent pricing", desc: "Brampton pricing sits between Hamilton and Toronto — competitive while still within the GTA contractor network." },
      { title: "Rapid expansion", desc: "Brampton's explosive growth means many commercial buildings are reaching the 15–20 year mark where original flat roofs need replacement." },
      { title: "Diverse building types", desc: "From industrial warehouses to strip malls to multi-unit residential, Brampton has a wide range of flat roof types requiring different material solutions." },
    ],
    areas: ["Downtown Brampton", "Bramalea", "Heart Lake", "Mount Pleasant", "Springdale", "Castlemore", "Gore Industrial", "Queen Street Corridor", "Bram East", "Bram West", "Caledon East", "Bolton"],
    climate: "Brampton experiences the same freeze-thaw climate as greater Toronto, with cold winters and warm summers. The city's massive warehouse and logistics sector creates strong demand for large-scale commercial flat roof replacement. EPDM and TPO are the most common choices for Brampton's industrial buildings due to their performance on large roof areas.",
    faqs: [
      { q: "How much does flat roof replacement cost in Brampton?", a: "Brampton flat roof replacement costs $10–$21 per sq ft installed. A typical 2,000 sq ft project ranges from $15,000 to $38,000." },
      { q: "What flat roof material is best for Brampton warehouses?", a: "TPO and EPDM are the top choices for large warehouse flat roofs — cost-effective at scale with strong performance in Ontario's climate." },
      { q: "How do I find a flat roof contractor in Brampton?", a: "Submit a free RFQ through RoofRFQ to receive competitive quotes from pre-vetted flat roof contractors serving Brampton and the GTA." },
    ],
  },
};

function css(){return `<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1a1a1a;line-height:1.7;background:#fff}.nav{background:#111;padding:16px 24px;display:flex;align-items:center;justify-content:space-between}.nav a{color:#fff;text-decoration:none;font-weight:700;font-size:18px}.nav .cta{background:#e63946;color:#fff;padding:8px 20px;border-radius:6px;font-size:14px;font-weight:600}.hero{background:linear-gradient(135deg,#1a1a2e,#16213e);color:#fff;padding:48px 24px;text-align:center}.hero p.sub{font-size:12px;text-transform:uppercase;letter-spacing:1.5px;opacity:.6;margin:0 0 8px}.hero h1{font-size:clamp(26px,4vw,38px);max-width:700px;margin:0 auto 12px;line-height:1.2;font-weight:800}.hero p.desc{font-size:16px;opacity:.8;max-width:540px;margin:0 auto 20px}.cta-btn{display:inline-block;background:#e63946;color:#fff;padding:12px 32px;border-radius:8px;font-weight:700;font-size:15px;text-decoration:none}.main{max-width:780px;margin:0 auto;padding:36px 24px 60px}.metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:0 0 28px}.metric{background:#f8f9fa;border-radius:8px;padding:16px;text-align:center}.metric .label{font-size:12px;color:#666;margin:0 0 4px}.metric .val{font-size:22px;font-weight:700;margin:0;color:#16213e}.metric .sub{font-size:11px;color:#999;margin:4px 0 0}h2{font-size:22px;font-weight:700;margin:36px 0 14px;color:#16213e;border-bottom:3px solid #e63946;padding-bottom:8px}p{margin:0 0 16px;font-size:16px}table{width:100%;border-collapse:collapse;font-size:14px;margin:16px 0 24px}th{background:#16213e;color:#fff;padding:10px 14px;text-align:left;font-weight:600}td{padding:10px 14px;border-bottom:1px solid #e5e5e5}.grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:16px 0 24px}.card{background:#f8f9fa;border-radius:8px;padding:14px}.card h4{font-size:14px;font-weight:700;margin:0 0 4px;color:#16213e}.card p{font-size:13px;color:#555;margin:0;line-height:1.5}.tags{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 24px}.tag{background:#f0f0f0;padding:6px 14px;border-radius:20px;font-size:13px;color:#555}.faq-item{border:1px solid #e5e5e5;border-radius:8px;margin:0 0 10px;overflow:hidden;padding:14px 16px}.faq-item h4{font-size:15px;font-weight:600;margin:0 0 6px;color:#1a1a1a}.faq-item p{font-size:14px;color:#555;margin:0;line-height:1.5}.cta-box{background:linear-gradient(135deg,#16213e,#1a1a2e);border-radius:12px;padding:32px 24px;text-align:center;margin:36px 0}.cta-box h3{font-size:22px;font-weight:700;color:#fff;margin:0 0 8px}.cta-box p{color:rgba(255,255,255,.7);font-size:15px;margin:0 0 16px}footer{background:#111;color:#999;text-align:center;padding:24px;font-size:13px}footer a{color:#e63946;text-decoration:none}@media(max-width:600px){.metrics{grid-template-columns:1fr}.grid2{grid-template-columns:1fr}.main{padding:24px 16px 48px}table{font-size:12px}th,td{padding:8px 10px}}</style>`;}

function render(c: CityData, slug: string) {
  const title = `Flat Roof Replacement ${c.name} — Get Free Quotes | RoofRFQ`;
  const desc = `Get competitive flat roof replacement quotes from vetted ${c.name} contractors. TPO, EPDM, PVC, modified bitumen. ${c.costRange}/sq ft. Free RFQ.`;
  const canonical = `https://roofrfq.ca/${slug}`;
  const faqSchema = JSON.stringify({"@context":"https://schema.org","@type":"FAQPage",mainEntity:c.faqs.map(f=>({"@type":"Question",name:f.q,acceptedAnswer:{"@type":"Answer",text:f.a}}))});
  const localSchema = JSON.stringify({"@context":"https://schema.org","@type":"Service",serviceType:"Flat Roof Replacement",provider:{"@type":"Organization",name:"RoofRFQ",url:"https://roofrfq.ca"},areaServed:{"@type":"City",name:c.name,containedInPlace:{"@type":"Province",name:c.province}},description:`Flat roof replacement quotes from pre-vetted contractors in ${c.name}. Covers TPO, EPDM, PVC, modified bitumen, and built-up roofing systems.`});

  return `<!DOCTYPE html><html lang="en-CA"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${title}</title><meta name="description" content="${desc}">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website"><meta property="og:site_name" content="RoofRFQ">
<meta property="og:title" content="${title}"><meta property="og:description" content="${desc}">
<meta property="og:url" content="${canonical}"><meta property="og:locale" content="en_CA">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}">
<meta name="geo.region" content="CA-${c.province === 'Ontario' ? 'ON' : c.province === 'British Columbia' ? 'BC' : c.province === 'Alberta' ? 'AB' : c.province === 'Quebec' ? 'QC' : 'MB'}">
<meta name="geo.placename" content="${c.name}">
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');</script>
${css()}
</head><body>
<nav class="nav"><a href="https://roofrfq.ca">RoofRFQ</a><a href="https://roofrfq.ca" class="cta">Get Free Quotes</a></nav>
<div class="hero">
<p class="sub">Local flat roof experts</p>
<h1>Flat roof replacement in ${c.name}</h1>
<p class="desc">Get competitive quotes from pre-vetted flat roof contractors serving ${c.name} and surrounding areas. Free, no obligation.</p>
<a href="https://roofrfq.ca" class="cta-btn">Submit Your RFQ — It's Free</a>
</div>
<div class="main">
<div class="metrics">
<div class="metric"><p class="label">${c.name} avg cost</p><p class="val">${c.costRange}</p><p class="sub">per sq ft installed</p></div>
<div class="metric"><p class="label">Typical project</p><p class="val">${c.typicalProject}</p><p class="sub">2,000 sq ft commercial</p></div>
<div class="metric"><p class="label">Avg time to quote</p><p class="val">48 hrs</p><p class="sub">from RFQ submission</p></div>
</div>

<h2>Flat roof replacement costs in ${c.name}</h2>
<p>${c.climate}</p>
<table><thead><tr><th>Material</th><th>Cost / sq ft</th><th>Lifespan</th></tr></thead><tbody>
${c.materials.map(m => `<tr><td><strong>${m.name}</strong></td><td>${m.cost}</td><td>${m.life}</td></tr>`).join("")}
</tbody></table>

<h2>Why flat roofing costs vary in ${c.name}</h2>
<div class="grid2">
${c.whyMore.map(w => `<div class="card"><h4>${w.title}</h4><p>${w.desc}</p></div>`).join("")}
</div>

<h2>Areas we serve</h2>
<div class="tags">
${c.areas.map(a => `<span class="tag">${a}</span>`).join("")}
</div>

<h2>Frequently asked questions</h2>
${c.faqs.map(f => `<div class="faq-item"><h4>${f.q}</h4><p>${f.a}</p></div>`).join("")}

<div class="cta-box">
<h3>Get free flat roof quotes in ${c.name}</h3>
<p>Submit once. Receive competitive quotes from vetted ${c.name} contractors.</p>
<a href="https://roofrfq.ca" class="cta-btn">Get Quotes →</a>
</div>
</div>
<footer><p>&copy; 2026 <a href="https://roofrfq.ca">RoofRFQ</a> — Flat Roof Replacement Made Simple</p></footer>
<script type="application/ld+json">${faqSchema}</script>
<script type="application/ld+json">${localSchema}</script>
</body></html>`;
}

export default async (req: Request, context: Context) => {
  const slug = new URL(req.url).pathname.replace(/^\//, "");
  const city = cities[slug];
  if (city) {
    return new Response(render(city, slug), { headers: { "content-type": "text/html; charset=utf-8" } });
  }
  return context.next();
};

// Disabled: static HTML city pages now exist in /cities/*.html
// Served via netlify.toml redirects. This edge function is kept as a reference only.
export const config: Config = { path: [] };
