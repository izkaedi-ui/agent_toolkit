#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, "agent-os-reports");

const expected = [
  "SCORECARD.json",
  "TRUST_PACK_VALIDATION.json",
  "BENCHMARK_ARENA_REPORT.json",
  "SELF_TEST_REPORT.json"
];

const failures = [];
const warnings = [];

for (const file of expected) {
  const full = path.join(REPORT_DIR, file);
  if (!fs.existsSync(full)) {
    failures.push(`Missing release evidence: ${file}`);
  }
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(path.join(REPORT_DIR, file), "utf8"));
  } catch {
    return null;
  }
}

const scorecard = readJson("SCORECARD.json");
if (!scorecard) {
  failures.push("Missing or invalid SCORECARD.json");
} else {
  const score = scorecard.score ?? scorecard.finalScore ?? scorecard.total ?? scorecard.totalScore;
  if (typeof score !== "number") {
    failures.push("Scorecard is missing a numeric score property");
  } else if (score < 80) {
    failures.push(`Release score below 80: ${score}`);
  }
}

const selfTest = readJson("SELF_TEST_REPORT.json");
if (!selfTest) {
  failures.push("Missing or invalid SELF_TEST_REPORT.json");
} else {
  const failed = selfTest.failed ?? selfTest.summary?.failed ?? 0;
  if (failed > 0) failures.push(`Self-tests failed: ${failed}`);
}

const arena = readJson("BENCHMARK_ARENA_REPORT.json");
if (!arena) {
  failures.push("Missing or invalid BENCHMARK_ARENA_REPORT.json");
} else {
  const failed = arena.failed ?? 0;
  if (failed > 0) failures.push(`Benchmark arena failures: ${failed}`);
}

const arenaV2 = readJson("BENCHMARK_ARENA_V2_REPORT.json");
if (!arenaV2) {
  failures.push("Missing or invalid BENCHMARK_ARENA_V2_REPORT.json");
} else {
  const failed = arenaV2.failed ?? 0;
  if (failed > 0) failures.push(`Benchmark arena v2 failures: ${failed}`);
}

const result = {
  status: failures.length ? "fail" : "pass",
  failures,
  warnings
};

fs.mkdirSync(REPORT_DIR, { recursive: true });

fs.writeFileSync(
  path.join(REPORT_DIR, "RELEASE_TRUST_REPORT.json"),
  JSON.stringify(result, null, 2)
);

fs.writeFileSync(
  path.join(REPORT_DIR, "RELEASE_TRUST_REPORT.md"),
  `# Release Trust Report

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

console.log(`Release trust: ${result.status}`);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
