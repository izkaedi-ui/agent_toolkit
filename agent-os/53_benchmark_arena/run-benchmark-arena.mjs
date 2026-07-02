#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const manifestPath = path.join(ROOT, "agent-os/53_benchmark_arena/BENCHMARK_CASE_MANIFEST.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const domainPatterns = {
  animation: /progress|loading|spinner|setInterval|requestAnimationFrame|@keyframes|transition/i,
  svg: /<svg|\.svg|animateTransform|aria-label|aria-hidden/i,
  "large-3d": /2m|2 million|million triangles|large mesh|2000000|2_000_000/i,
  "3d": /three|webgl|gltf|glb|mesh|triangles|canvas/i,
  export: /export|download|Blob|createObjectURL|serialize/i
};

const findingPatterns = {
  "fake-progress-risk": /setInterval|fake progress|timer-driven/i,
  "svg-accessibility-unclassified": /<svg(?![^>]*(aria-label|aria-hidden|aria-labelledby|role))/i,
  "large-3d-proof-debt": /2m|2 million|million triangles|large mesh/i,
  "output-validation-required": /export|download|Blob|createObjectURL/i
};

function readCaseText(casePath) {
  const absolute = path.join(ROOT, casePath);
  const files = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else files.push(full);
    }
  }

  walk(absolute);

  return files
    .map((file) => {
      try {
        return fs.readFileSync(file, "utf8");
      } catch {
        return "";
      }
    })
    .join("\n");
}

const results = [];

for (const testCase of manifest.cases) {
  const text = readCaseText(testCase.path);

  const detectedDomains = Object.entries(domainPatterns)
    .filter(([, regex]) => regex.test(text))
    .map(([domain]) => domain);

  const detectedFindings = Object.entries(findingPatterns)
    .filter(([, regex]) => regex.test(text))
    .map(([finding]) => finding);

  const missingDomains = testCase.expectedDomains.filter(
    (domain) => !detectedDomains.includes(domain)
  );

  const missingFindings = testCase.expectedFindings.filter(
    (finding) => !detectedFindings.includes(finding)
  );

  results.push({
    id: testCase.id,
    passed: missingDomains.length === 0 && missingFindings.length === 0,
    detectedDomains,
    detectedFindings,
    missingDomains,
    missingFindings
  });
}

const passed = results.filter((result) => result.passed).length;
const failed = results.length - passed;

const reportDir = path.join(ROOT, "agent-os-reports");
fs.mkdirSync(reportDir, { recursive: true });

fs.writeFileSync(
  path.join(reportDir, "BENCHMARK_ARENA_REPORT.json"),
  JSON.stringify({ passed, failed, results }, null, 2)
);

fs.writeFileSync(
  path.join(reportDir, "BENCHMARK_ARENA_REPORT.md"),
  `# Benchmark Arena Report

## Status

${failed === 0 ? "pass" : "fail"}

## Summary

Passed ${passed}/${results.length} benchmark cases.

## Cases

| Case | Passed | Missing Domains | Missing Findings |
|---|---:|---|---|
${results
  .map(
    (result) =>
      `| ${result.id} | ${result.passed ? "yes" : "no"} | ${result.missingDomains.join(", ") || "none"} | ${result.missingFindings.join(", ") || "none"} |`
  )
  .join("\n")}

## Final Rule

No claim may exceed evidence.
`
);

console.log(`Benchmark arena: ${passed}/${results.length} passed.`);

if (failed > 0) process.exit(1);
