#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, "agent-os-reports");

const requiredJsonReports = [
  "SELF_TEST_REPORT.json",
  "SCORECARD.json",
  "SUPERCHARGED_ORCHESTRATION.json",
  "ORCHESTRATION_DECISION_RECORD.json"
];

const failures = [];

for (const report of requiredJsonReports) {
  const full = path.join(REPORT_DIR, report);

  if (!fs.existsSync(full)) {
    failures.push(`Missing report: ${report}`);
    continue;
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(full, "utf8"));
  } catch {
    failures.push(`Invalid JSON: ${report}`);
    continue;
  }

  if (!data || typeof data !== "object") {
    failures.push(`Report is not object: ${report}`);
  }

  if (report.includes("SELF_TEST") && !("passed" in data)) {
    failures.push("SELF_TEST_REPORT.json missing passed field.");
  }

  if (report.includes("SCORECARD")) {
    const score = data.score ?? data.finalScore ?? data.total ?? data.totalScore;
    if (typeof score !== "number") failures.push("SCORECARD.json missing numeric score.");
  }
}

const result = {
  status: failures.length ? "fail" : "pass",
  failures
};

fs.writeFileSync(
  path.join(REPORT_DIR, "GOLDEN_REPORT_VERIFY.json"),
  JSON.stringify(result, null, 2)
);

fs.writeFileSync(
  path.join(REPORT_DIR, "GOLDEN_REPORT_VERIFY.md"),
  `# Golden Report Verification

## Status

${result.status}

## Failures

${failures.map((failure) => `- ${failure}`).join("\n") || "- None"}

## Final Rule

No claim may exceed evidence.
`
);

console.log(`Golden report verification: ${result.status}`);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
