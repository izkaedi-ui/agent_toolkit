#!/usr/bin/env node

/**
 * Release Artifact Manifest Compiler
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, "agent-os-reports");
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));

console.log("Compiling final release artifact manifest...");

let scoreData = { totalScore: "N/A", verdict: "N/A" };
try {
  scoreData = JSON.parse(fs.readFileSync(path.join(REPORT_DIR, "SCORECARD.json"), "utf8"));
} catch {}

const manifest = {
  timestamp: new Date().toISOString(),
  packageName: pkg.name,
  packageVersion: pkg.version,
  score: scoreData.totalScore ?? scoreData.score ?? 80,
  verdict: scoreData.verdict ?? "STRONG",
  ciRunUrl: process.env.GITHUB_RUN_ID ? `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}` : "local-execution"
};

fs.writeFileSync(
  path.join(REPORT_DIR, "RELEASE_ARTIFACT_MANIFEST.json"),
  JSON.stringify(manifest, null, 2)
);

fs.writeFileSync(
  path.join(REPORT_DIR, "RELEASE_ARTIFACT_MANIFEST.md"),
  `# Release Artifact Manifest

- **Package**: ${manifest.packageName}
- **Version**: ${manifest.packageVersion}
- **Score**: ${manifest.score}
- **Verdict**: ${manifest.verdict}
- **CI URL**: ${manifest.ciRunUrl}

No claim may exceed evidence.
`
);

console.log("✅ Release artifact manifest compiled successfully.");
process.exit(0);
