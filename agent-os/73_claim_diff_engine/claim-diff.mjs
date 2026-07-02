#!/usr/bin/env node

/**
 * Claim Diff Scanner
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const AGENT_OS = path.join(ROOT, "agent-os");

console.log("Starting claim diff scan...");

const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.md$/i.test(entry.name)) files.push(full);
  }
}
walk(AGENT_OS);

const claims = [];
for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  const matches = content.match(/claim/gi) || [];
  if (matches.length > 0) {
    claims.push({
      file: path.relative(ROOT, file),
      count: matches.length
    });
  }
}

const report = {
  timestamp: new Date().toISOString(),
  totalClaimsCount: claims.reduce((acc, val) => acc + val.count, 0),
  claims
};

const reportDir = path.join(ROOT, "agent-os-reports");
fs.mkdirSync(reportDir, { recursive: true });

fs.writeFileSync(
  path.join(reportDir, "CLAIM_DIFF_REPORT.json"),
  JSON.stringify(report, null, 2)
);

fs.writeFileSync(
  path.join(reportDir, "CLAIM_DIFF_REPORT.md"),
  `# Claim Diff Report

## Summary
Detected ${report.totalClaimsCount} total claim matches.

## Claims Map
${claims.map((c) => `- **${c.file}**: ${c.count} matches`).join("\n") || "- None"}

No claim may exceed evidence.
`
);

console.log(`✅ Claim diff scan complete. Found ${report.totalClaimsCount} matches.`);
process.exit(0);
