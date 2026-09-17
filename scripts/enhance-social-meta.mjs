import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const root = process.cwd();

const imageOverrides = new Map([
  ["blog/compressed-sofa-aql-inspection-defect-classification.html", "/assets/factory/assembly-line.jpg"],
  ["blog/compressed-sofa-certificates-import-documents-checklist.html", "/assets/factory/export-cartons.jpg"],
  ["blog/compressed-sofa-compression-recovery-test-protocol.html", "/assets/images/FN-011B.webp"],
  ["blog/compressed-sofa-damage-claims-checklist.html", "/assets/images/FN-204C.webp"],
  ["blog/compressed-sofa-factory-audit-checklist.html", "/assets/factory/factory-hall.jpg"],
  ["blog/compressed-sofa-landed-cost-breakdown.html", "/assets/factory/packing-cbm-1200.webp"],
  ["blog/compressed-sofa-packing-guide-for-importers.html", "/assets/images/packing-carton.png"],
  ["blog/compressed-sofa-replacement-parts-after-sales-guide.html", "/assets/factory/assembly-line.jpg"],
  ["blog/compressed-sofa-vs-traditional-sofa.html", "/assets/images/FN-204C.webp"],
  ["blog/compressed-sofa-warranty-claim-form-evidence-pack.html", "/assets/images/packing-carton.png"],
  ["blog/compressed-sofa-warranty-terms-claim-response-sla.html", "/assets/factory/factory-team-floor.jpg"],
  ["blog/how-many-compressed-sofas-fit-in-40hq.html", "/assets/factory/packing-cbm-1200.webp"],
  ["blog/index.html", "/assets/factory/factory-hall.jpg"],
  ["blog/oem-sofa-manufacturing-process.html", "/assets/factory/upholstery-workshop.jpg"],
  ["blog/vacuum-packed-sofa-recovery-time.html", "/assets/images/FN-011B.webp"],
  ["blog/what-is-a-compressed-sofa.html", "/assets/images/FN-204C.webp"],
  ["certificates/index.html", "/assets/factory/factory-hall.jpg"],
  ["contact/index.html", "/assets/factory/factory-team-floor.jpg"],
  ["fabric/index.html", "/assets/images/fabric_0.webp"],
  ["oem-odm/index.html", "/assets/factory/upholstery-workshop.jpg"],
  ["packing/index.html", "/assets/factory/packing-cbm-1200.webp"],
  ["ru/contact/index.html", "/assets/factory/factory-team-floor.jpg"],
  ["sofa-bed/index.html", "/assets/images/FN-104.webp"],
]);

async function listHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listHtml(path)));
    else if (entry.name.endsWith(".html")) files.push(path);
  }
  return files;
}

function match(content, expression) {
  return content.match(expression)?.[1]?.trim() ?? "";
}

function metaContent(content, attribute, value) {
  const tag = content.match(new RegExp(`<meta\\s+[^>]*${attribute}=["']${value}["'][^>]*>`, "i"))?.[0] ?? "";
  return match(tag, /content="([^"]*)"/i) || match(tag, /content='([^']*)'/i);
}

function absoluteImage(path) {
  if (/^https?:\/\//i.test(path)) return path;
  return `https://weieryang.com${path.startsWith("/") ? "" : "/"}${path}`;
}

function addMeta(content, anchor, tag) {
  return content.includes(tag.match(/(?:property|name)="([^"]+)"/)?.[1] ?? "")
    ? content
    : content.replace(anchor, `${anchor}\n  ${tag}`);
}

let updated = 0;
for (const file of await listHtml(root)) {
  let content = await readFile(file, "utf8");
  if (/name=["']robots["'][^>]*noindex/i.test(content)) continue;

  const path = relative(root, file).split(sep).join("/");
  const title = match(content, /<title>([\s\S]*?)<\/title>/i);
  const description = metaContent(content, "name", "description");
  const canonical = match(content, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["'][^>]*>/i);
  if (!title || !description || !canonical) continue;

  const override = imageOverrides.get(path);
  const rawExistingImage = metaContent(content, "property", "og:image");
  const existingImage = /\.svg(?:$|\?)/i.test(rawExistingImage) ? "" : rawExistingImage;
  const firstContentImage = match(content, /<(?:figure|picture)[^>]*>[\s\S]*?<img[^>]+src=["']([^"']+)["']/i);
  const image = absoluteImage(existingImage || override || firstContentImage || "/assets/factory/factory-hero-1600.webp");
  const ogTitle = metaContent(content, "property", "og:title") || title;
  const ogDescription = metaContent(content, "property", "og:description") || description;

  const anchor = content.match(/<meta\s+name=["']robots["'][^>]*>/i)?.[0]
    ?? content.match(/<link\s+rel=["']canonical["'][^>]*>/i)?.[0];
  if (!anchor) continue;

  let next = content;
  if (rawExistingImage && rawExistingImage !== image) {
    next = next.split(rawExistingImage).join(image);
  }
  next = addMeta(next, anchor, `<meta property="og:type" content="website">`);
  next = addMeta(next, anchor, `<meta property="og:title" content="${ogTitle}">`);
  next = addMeta(next, anchor, `<meta property="og:description" content="${ogDescription}">`);
  next = addMeta(next, anchor, `<meta property="og:url" content="${canonical}">`);
  next = addMeta(next, anchor, `<meta property="og:image" content="${image}">`);
  next = addMeta(next, anchor, `<meta property="og:site_name" content="Weieryang">`);
  next = addMeta(next, anchor, `<meta name="twitter:card" content="summary_large_image">`);
  next = addMeta(next, anchor, `<meta name="twitter:title" content="${ogTitle}">`);
  next = addMeta(next, anchor, `<meta name="twitter:description" content="${ogDescription}">`);
  next = addMeta(next, anchor, `<meta name="twitter:image" content="${image}">`);

  if (next !== content) {
    await writeFile(file, next, "utf8");
    updated += 1;
  }
}

console.log(`Updated social metadata in ${updated} HTML files.`);
