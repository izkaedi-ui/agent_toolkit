#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const AGENT_OS = path.join(ROOT, "agent-os");

const mutations = [
  {
    id: "missing-truth-principle-detected",
    check() {
      const files = [];

      function walk(dir) {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) walk(full);
          else if (/COMMAND|OVERVIEW/i.test(entry.name) && /\.md$/i.test(entry.name)) files.push(full);
        }
      }

      walk(AGENT_OS);

      const missing = files.filter(
        (file) => !fs.readFileSync(file, "utf8").includes("No claim may exceed evidence")
      );

      return {
        passed: missing.length === 0,
        details: missing.map((file) => path.relative(ROOT, file))
      };
    }
  },
  {
    id: "weak-language-detector-has-patterns",
    check() {
      const linterPath = path.join(ROOT, "agent-os/42_protocol_linter/protocol-linter.mjs");
      const text = fs.readFileSync(linterPath, "utf8");

      const required = ["probably", "should work", "maybe", "appears to", "mostly"];
      const missing = required.filter((word) => !text.includes(word));

      return {
        passed: missing.length === 0,
        details: missing
      };
    }
  },
  {
    id: "benchmark-arena-covers-fake-progress",
    check() {
      const manifest = JSON.parse(
        fs.readFileSync(path.join(ROOT, "agent-os/53_benchmark_arena/BENCHMARK_CASE_MANIFEST.json"), "utf8")
      );

      const hasFakeProgress = manifest.cases?.some((item) => item.id === "fake-progress");

      return {
        passed: Boolean(hasFakeProgress),
        details: []
      };
    }
  }
];

const results = mutations.map((mutation) => ({
  id: mutation.id,
  ...mutation.check()
}));

const passed = results.filter((result) => result.passed).length;
const failed = results.length - passed;

const reportDir = path.join(ROOT, "agent-os-reports");
fs.mkdirSync(reportDir, { recursive: true });

fs.writeFileSync(
  path.join(reportDir, "MUTATION_TEST_REPORT.json"),
  JSON.stringify({ passed, failed, results }, null, 2)
);

fs.writeFileSync(
  path.join(reportDir, "MUTATION_TEST_REPORT.md"),
  `# Mutation Test Report

## Status

${failed === 0 ? "pass" : "fail"}

## Summary

Passed ${passed}/${results.length} mutation checks.

## Checks

| Check | Passed | Details |
|---|---:|---|
${results.map((result) => `| ${result.id} | ${result.passed ? "yes" : "no"} | ${result.details.join(", ") || "none"} |`).join("\n")}

## Final Rule

No claim may exceed evidence.
`
);

console.log(`Mutation tests: ${passed}/${results.length} passed.`);

if (failed > 0) process.exit(1);
