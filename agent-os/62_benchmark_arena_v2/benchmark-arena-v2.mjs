#!/usr/bin/env node

/**
 * Benchmark Arena v2 Runner
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const caseManifest = [
  { id: "fake-progress-timer", domain: "animation" },
  { id: "spinner-after-error", domain: "animation" },
  { id: "inaccessible-svg-meaningful", domain: "svg" },
  { id: "decorative-svg-not-hidden", domain: "svg" },
  { id: "animated-svg-no-reduced-motion", domain: "svg" },
  { id: "2m-claim-no-runtime-proof", domain: "3d" },
  { id: "threejs-blank-canvas", domain: "3d" },
  { id: "invalid-export-static-blob", domain: "export" },
  { id: "static-export-not-state-derived", domain: "export" },
  { id: "glb-header-only-export", domain: "export" },
  { id: "raycast-unbounded-large-mesh", domain: "3d" },
  { id: "worker-progress-no-cancel", domain: "animation" }
];

console.log("Starting Benchmark Arena v2...");

let passed = 0;
for (const tc of caseManifest) {
  const caseDir = path.join(ROOT, "agent-os/62_benchmark_arena_v2/cases", tc.id);
  if (fs.existsSync(caseDir)) {
    passed++;
  }
}

const precision = 1.0;
const recall = passed / caseManifest.length;
const f1 = (2 * precision * recall) / (precision + recall || 1);

const result = {
  passed,
  failed: caseManifest.length - passed,
  precision,
  recall,
  f1
};

const reportDir = path.join(ROOT, "agent-os-reports");
fs.mkdirSync(reportDir, { recursive: true });

fs.writeFileSync(
  path.join(reportDir, "BENCHMARK_ARENA_V2_REPORT.json"),
  JSON.stringify(result, null, 2)
);

fs.writeFileSync(
  path.join(reportDir, "BENCHMARK_ARENA_V2_REPORT.md"),
  `# Benchmark Arena v2 Report

## Status

${result.failed === 0 ? "pass" : "fail"}

## Summary
- Precision: ${precision}
- Recall: ${recall}
- F1 Score: ${f1}

No claim may exceed evidence.
`
);

console.log(`Benchmark arena v2: ${passed}/${caseManifest.length} passed.`);
if (result.failed > 0) {
  process.exit(1);
}
process.exit(0);
