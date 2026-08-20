import fs from "fs";
import path from "path";

const root = process.cwd();
const seedDir = path.join(root, "public", "images", "seed");
const brandDir = path.join(root, "public", "brand");
const uploadsDir = path.join(root, "public", "uploads");

fs.mkdirSync(seedDir, { recursive: true });
fs.mkdirSync(brandDir, { recursive: true });
fs.mkdirSync(uploadsDir, { recursive: true });

const files = [
  ["hero-home", "Hero", "Build smarter. Reach further."],
  ["hero-about", "About", "Built to help small businesses move."],
  ["hero-services", "Services", "Your connected growth system"],
  ["hero-pricing", "Pricing", "Honest starting points"],
  ["hero-gallery", "Work", "Concept visual explorations"],
  ["hero-testimonials", "Testimonials", "Client stories in progress"],
  ["hero-faqs", "FAQs", "Clear answers"],
  ["hero-blog", "Insights", "Practical growth guidance"],
  ["hero-booking", "Booking", "Book a discovery call"],
  ["hero-contact", "Contact", "Let us talk growth"],
  ["device-laptop", "Device", "Website interface mockup"],
  ["device-mobile", "Mobile", "App screen composition"],
  ["device-tablet", "Tablet", "Responsive layout preview"],
  ["abstract-redline-1", "Redline", "Signal path composition"],
  ["abstract-redline-2", "Network", "Connected growth nodes"],
  ["abstract-redline-3", "Motion", "Kinetic brand geometry"],
  ["texture-business-1", "Texture", "Business environment detail"],
  ["texture-business-2", "Texture", "Production atmosphere"],
  ["service-web-design", "Web Design", "Custom web design visual"],
  ["service-automation", "Automation", "Workflow automation visual"],
  ["collage-grid", "Collage", "Modular image grid"],
  ["process-diagram", "Process", "Discover to optimise flow"],
];

function svg(name, label, subtitle, variant) {
  const accents = ["#F21D2F", "#FF3347", "#8D0715"];
  const accent = accents[variant % accents.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" role="img" aria-label="${label} placeholder for Netbrandit">
  <defs>
    <linearGradient id="bg-${name}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#050505"/>
      <stop offset="100%" stop-color="#0D0D0F"/>
    </linearGradient>
    <pattern id="grain-${name}" width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="4" height="4" fill="#111114"/>
      <circle cx="1" cy="1" r="0.6" fill="#1a1a1f" opacity="0.5"/>
    </pattern>
  </defs>
  <rect width="1200" height="800" fill="url(#bg-${name})"/>
  <rect width="1200" height="800" fill="url(#grain-${name})" opacity="0.35"/>
  <path d="M0 ${120 + variant * 8} H420 L520 ${40 + variant * 5} H1200 V800 H0 Z" fill="${accent}" opacity="0.18"/>
  <path d="M80 ${600 - variant * 10} C260 ${520 + variant * 4}, 420 ${680 - variant * 6}, 620 ${590 + variant * 3} S980 ${720 - variant * 8}, 1120 ${610 - variant * 4}" fill="none" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>
  <rect x="${720 - variant * 10}" y="${120 + variant * 6}" width="320" height="420" rx="24" fill="#18181B" stroke="${accent}" stroke-width="3"/>
  <rect x="${760 - variant * 8}" y="${160 + variant * 4}" width="240" height="28" rx="8" fill="#F7F4EF" opacity="0.85"/>
  <rect x="${760 - variant * 8}" y="${210 + variant * 4}" width="180" height="16" rx="6" fill="#9A9A9F" opacity="0.8"/>
  <rect x="${760 - variant * 8}" y="${240 + variant * 4}" width="200" height="16" rx="6" fill="#9A9A9F" opacity="0.55"/>
  <rect x="${760 - variant * 8}" y="${290 + variant * 4}" width="240" height="140" rx="16" fill="#050505" stroke="#5D5D63" stroke-width="2"/>
  <text x="80" y="120" fill="#F7F4EF" font-family="Arial, Helvetica, sans-serif" font-size="54" font-weight="700">NETBRAND<tspan fill="${accent}">IT</tspan></text>
  <text x="80" y="170" fill="#D8D4CE" font-family="Arial, Helvetica, sans-serif" font-size="28" letter-spacing="4">${label.toUpperCase()}</text>
  <text x="80" y="720" fill="#F7F4EF" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="600">${subtitle}</text>
  <text x="80" y="760" fill="#9A9A9F" font-family="Arial, Helvetica, sans-serif" font-size="18">Netbrandit seed placeholder · replace from admin</text>
</svg>`;
}

for (const [name, label, subtitle] of files) {
  fs.writeFileSync(
    path.join(seedDir, `${name}.svg`),
    svg(name, label, subtitle, files.findIndex((entry) => entry[0] === name)),
  );
}

const brandLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 120" role="img" aria-label="Netbrandit wordmark">
  <rect width="480" height="120" fill="#050505"/>
  <rect x="24" y="24" width="8" height="72" fill="#F21D2F"/>
  <text x="48" y="82" fill="#F7F4EF" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="700">NETBRAND<tspan fill="#F21D2F">IT</tspan></text>
</svg>`;

fs.writeFileSync(path.join(brandDir, "wordmark.svg"), brandLogo);
fs.writeFileSync(path.join(brandDir, "favicon-mark.svg"), brandLogo);
fs.writeFileSync(path.join(uploadsDir, ".gitkeep"), "");

console.log(`Created ${files.length} seed SVG files.`);
