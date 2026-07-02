#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, "agent-os-reports");

const requiredReports = [
  "ORCHESTRATION_DECISION_RECORD.md",
  "ORCHESTRATION_DECISION_RECORD.json",
  "SUPERCHARGED_ORCHESTRATION.md",
  "SUPERCHARGED_ORCHESTRATION.json",
  "PROTOCOL_LINT_REPORT.md",
  "PROTOCOL_LINT_REPORT.json",
  "SELF_TEST_REPORT.md",
  "SELF_TEST_REPORT.json",
  "EVIDENCE_GRAPH.md",
  "EVIDENCE_GRAPH.json",
  "SCORECARD.md",
  "SCORECARD.json"
];

const failures = [];
const warnings = [];

for (const report of requiredReports) {
  const file = path.join(REPORT_DIR, report);

  if (!fs.existsSync(file)) {
    failures.push(`Missing required report: ${report}`);
    continue;
  }

  const stat = fs.statSync(file);
  if (stat.size === 0) {
    failures.push(`Report is empty: ${report}`);
  }
}

const scorecardPath = path.join(REPORT_DIR, "SCORECARD.json");

if (fs.existsSync(scorecardPath)) {
  try {
    const scorecard = JSON.parse(fs.readFileSync(scorecardPath, "utf8"));
    const score =
      scorecard.score ??
      scorecard.finalScore ??
      scorecard.total ??
      scorecard.totalScore ??
      scorecard.summary?.score;

    if (typeof score === "number") {
      if (score < 75) {
        failures.push(`Scorecard below threshold: ${score}/100. Required: >=75.`);
      } else if (score < 85) {
        warnings.push(`Scorecard is acceptable but not elite: ${score}/100.`);
      }
    } else {
      warnings.push("Could not find numeric score in SCORECARD.json.");
    }
  } catch (error) {
    failures.push(`Failed to parse SCORECARD.json: ${error.message}`);
  }
}

const selfTestPath = path.join(REPORT_DIR, "SELF_TEST_REPORT.json");

if (fs.existsSync(selfTestPath)) {
  try {
    const selfTest = JSON.parse(fs.readFileSync(selfTestPath, "utf8"));
    const failed =
      selfTest.failed ??
      selfTest.failures ??
      selfTest.summary?.failed ??
      0;

    if (failed > 0) {
      failures.push(`Self-test report has ${failed} failure(s).`);
    }
  } catch (error) {
    failures.push(`Failed to parse SELF_TEST_REPORT.json: ${error.message}`);
  }
}

const result = {
  status: failures.length ? "fail" : "pass",
  failures,
  warnings
};

fs.mkdirSync(REPORT_DIR, { recursive: true });

fs.writeFileSync(
  path.join(REPORT_DIR, "TRUST_PACK_VALIDATION.json"),
  JSON.stringify(result, null, 2)
);

fs.writeFileSync(
  path.join(REPORT_DIR, "TRUST_PACK_VALIDATION.md"),
  `# Trust Pack Validation

## Status

${result.status}

## Failures

${failures.map((failure) => `- ${failure}`).join("\n") || "- None"}

## Warnings

${warnings.map((warning) => `- ${warning}`).join("\n") || "- None"}

## Final Rule

No claim may exceed evidence.
`
);

console.log(`Trust Pack validation: ${result.status}`);

if (warnings.length) {
  console.warn(warnings.map((warning) => `Warning: ${warning}`).join("\n"));
}

if (failures.length) {
  console.error(failures.map((failure) => `Failure: ${failure}`).join("\n"));
  process.exit(1);
}
