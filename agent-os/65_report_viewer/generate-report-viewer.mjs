#!/usr/bin/env node

/**
 * Report Viewer Index Page Generator
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, "agent-os-reports");
const templateFile = path.join(ROOT, "agent-os/65_report_viewer/template.html");

console.log("Generating Report Viewer index.html...");

let scorecardData = { totalScore: "N/A", verdict: "N/A" };
try {
  scorecardData = JSON.parse(
    fs.readFileSync(path.join(REPORT_DIR, "SCORECARD.json"), "utf8")
  );
} catch {}

let benchmarkData = { passed: 0, failed: 0 };
try {
  benchmarkData = JSON.parse(
    fs.readFileSync(path.join(REPORT_DIR, "BENCHMARK_ARENA_V2_REPORT.json"), "utf8")
  );
} catch {}

let selfTestData = { passed: 0, failed: 0 };
try {
  selfTestData = JSON.parse(
    fs.readFileSync(path.join(REPORT_DIR, "SELF_TEST_REPORT.json"), "utf8")
  );
} catch {}

const reportsList = fs.existsSync(REPORT_DIR) ? fs.readdirSync(REPORT_DIR) : [];

let templateHtml = fs.readFileSync(templateFile, "utf8");

templateHtml = templateHtml
  .replace("{{SCORE}}", scorecardData.totalScore ?? scorecardData.score ?? scorecardData.total ?? "N/A")
  .replace("{{VERDICT}}", scorecardData.verdict ?? "N/A")
  .replace("{{BENCHMARK_PASSED}}", benchmarkData.passed)
  .replace("{{BENCHMARK_FAILED}}", benchmarkData.failed)
  .replace("{{SELF_TEST_PASSED}}", selfTestData.passed)
  .replace("{{SELF_TEST_FAILED}}", selfTestData.failed)
  .replace(
    "{{REPORTS_LIST}}",
    reportsList.map((f) => `<li><a href="${f}">${f}</a></li>`).join("\n")
  );

fs.writeFileSync(path.join(REPORT_DIR, "index.html"), templateHtml);
console.log("✅ Report Viewer generated at agent-os-reports/index.html");
process.exit(0);
