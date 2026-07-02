#!/usr/bin/env node

/**
 * Publishing Readiness Check Script
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const pkgFile = path.join(ROOT, "package.json");

console.log("Checking npm publishing readiness...");

if (!fs.existsSync(pkgFile)) {
  console.error("❌ package.json not found.");
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(pkgFile, "utf8"));
const errors = [];

if (!pkg.name) errors.push("Missing package 'name'");
if (!pkg.version) errors.push("Missing package 'version'");
if (!pkg.license) errors.push("Missing package 'license'");
if (!pkg.description) errors.push("Missing package 'description'");

const report = {
  status: errors.length === 0 ? "pass" : "fail",
  errors
};

const reportDir = path.join(ROOT, "agent-os-reports");
fs.mkdirSync(reportDir, { recursive: true });

fs.writeFileSync(
  path.join(reportDir, "PUBLISHING_READINESS_REPORT.json"),
  JSON.stringify(report, null, 2)
);

fs.writeFileSync(
  path.join(reportDir, "PUBLISHING_READINESS_REPORT.md"),
  `# Publishing Readiness Report

## Status

${report.status}

## Errors

${errors.map((e) => `- ${e}`).join("\n") || "- None"}

No claim may exceed evidence.
`
);

console.log(`Publishing readiness check: ${report.status}`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
process.exit(0);
