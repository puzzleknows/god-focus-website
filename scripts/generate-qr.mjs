#!/usr/bin/env node
/**
 * Generate God Focus smart-link QR codes locally (no third-party QR service).
 *
 * Usage:
 *   node scripts/generate-qr.mjs        # default: q1
 *   node scripts/generate-qr.mjs q1
 *   node scripts/generate-qr.mjs q2
 *
 * Output:
 *   qr/god-focus-<code>.png
 *   qr/god-focus-<code>.svg
 *
 * Encodes the branded short URL, never the App Store URL.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const code = String(process.argv[2] || "q1")
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9_-]/g, "");

if (!code) {
  console.error("Usage: node scripts/generate-qr.mjs <code>");
  process.exit(1);
}

const shortUrl = `https://godfocus.puzdev.com/go/${code}/`;
const outDir = join(root, "qr");
const pngPath = join(outDir, `god-focus-${code}.png`);
const svgPath = join(outDir, `god-focus-${code}.svg`);

async function loadQrcode() {
  try {
    return await import("qrcode");
  } catch {
    console.log("Installing local qrcode package (dev-only, not used at runtime)…");
    const install = spawnSync(
      "npm",
      ["install", "--no-save", "--prefix", root, "qrcode@1.5.4"],
      { stdio: "inherit", shell: false }
    );
    if (install.status !== 0) {
      throw new Error("Failed to install qrcode. Run: npm install qrcode@1.5.4");
    }
    const require = createRequire(import.meta.url);
    // Prefer package resolved under repo node_modules after install.
    return import(pathToFileURL(require.resolve("qrcode")).href);
  }
}

const QR = await loadQrcode();
await mkdir(outDir, { recursive: true });

await QR.toFile(pngPath, shortUrl, {
  type: "png",
  width: 1024,
  margin: 2,
  errorCorrectionLevel: "M",
  color: { dark: "#1c1915", light: "#ffffff" }
});

const svg = await QR.toString(shortUrl, {
  type: "svg",
  margin: 2,
  errorCorrectionLevel: "M",
  color: { dark: "#1c1915", light: "#ffffff" }
});
await writeFile(svgPath, svg, "utf8");

console.log("Encoded:", shortUrl);
console.log("Wrote:", pngPath);
console.log("Wrote:", svgPath);
