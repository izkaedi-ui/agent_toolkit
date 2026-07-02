#!/usr/bin/env node

/**
 * Version Evidence Manifest Generator
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, "agent-os-reports");
const pkgFile = path.join(ROOT, "package.json");

console.log("Generating version evidence manifest...");

const pkg = JSON.parse(fs.readFileSync(pkgFile, "utf8"));
const version = pkg.version || "0.0.0";

const hashes = {};
if (fs.existsSync(REPORT_DIR)) {
  const files = fs.readdirSync(REPORT_DIR).filter((f) => f.endsWith(".json") && f !== "VERSION_EVIDENCE_MANIFEST.json");
  for (const file of files) {
    const data = fs.readFileSync(path.join(REPORT_DIR, file));
    const hash = crypto.createHash("sha256").update(data).digest("hex");
    hashes[file] = hash;
  }
}

const manifest = {
  timestamp: new Date().toISOString(),
  version,
  hashes
};

fs.writeFileSync(
  path.join(REPORT_DIR, "VERSION_EVIDENCE_MANIFEST.json"),
  JSON.stringify(manifest, null, 2)
);

fs.writeFileSync(
  path.join(REPORT_DIR, "VERSION_EVIDENCE_MANIFEST.md"),
  `# Version Evidence Manifest

## Version
${version}

## Hashes

${Object.entries(hashes)
  .map(([file, hash]) => `- **${file}**: \`${hash}\``)
  .join("\n") || "- None"}

No claim may exceed evidence.
`
);

console.log("✅ Version evidence manifest generated.");
process.exit(0);
