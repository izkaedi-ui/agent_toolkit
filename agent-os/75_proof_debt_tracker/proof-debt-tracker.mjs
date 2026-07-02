#!/usr/bin/env node

/**
 * Proof Debt Tracker Scanner
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");

console.log("Starting proof debt tracker scan...");

const files = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(ts|js|mjs)$/i.test(entry.name)) files.push(full);
  }
}
walk(SRC);

const debt = [];
for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  const matches = content.match(/TODO|FIXME/gi) || [];
  if (matches.length > 0) {
    debt.push({
      file: path.relative(ROOT, file),
      count: matches.length
    });
  }
}

const report = {
  timestamp: new Date().toISOString(),
  totalDebtCount: debt.reduce((acc, val) => acc + val.count, 0),
  debt
};

const reportDir = path.join(ROOT, "agent-os-reports");
fs.mkdirSync(reportDir, { recursive: true });

fs.writeFileSync(
  path.join(reportDir, "PROOF_DEBT_REPORT.json"),
  JSON.stringify(report, null, 2)
);

fs.writeFileSync(
  path.join(reportDir, "PROOF_DEBT_REPORT.md"),
  `# Proof Debt Report

## Summary
Detected ${report.totalDebtCount} total unresolved proof debt matches.

## Debt Map
${debt.map((d) => `- **${d.file}**: ${d.count} matches`).join("\n") || "- None"}

No claim may exceed evidence.
`
);

console.log(`✅ Proof debt tracker complete. Found ${report.totalDebtCount} items.`);
process.exit(0);
