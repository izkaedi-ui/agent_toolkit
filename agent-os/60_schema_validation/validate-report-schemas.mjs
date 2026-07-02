#!/usr/bin/env node

/**
 * Report Schemas Validation Script
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, "agent-os-reports");
const SCHEMA_DIR = path.join(ROOT, "agent-os/60_schema_validation/schemas");

console.log("Starting report JSON schema validations...");

const schemaFiles = fs.readdirSync(SCHEMA_DIR).filter((f) => f.endsWith(".schema.json"));

let failures = 0;
for (const schemaFile of schemaFiles) {
  const schemaName = schemaFile.replace(".schema.json", "");
  // Map schema name to actual report file
  let reportName = "";
  if (schemaName === "orchestration") reportName = "ORCHESTRATION_DECISION_RECORD.json";
  else if (schemaName === "supercharged-orchestration") reportName = "SUPERCHARGED_ORCHESTRATION.json";
  else if (schemaName === "protocol-lint") reportName = "PROTOCOL_LINT_REPORT.json";
  else if (schemaName === "self-test") reportName = "SELF_TEST_REPORT.json";
  else if (schemaName === "scorecard") reportName = "SCORECARD.json";
  else if (schemaName === "benchmark-arena") reportName = "BENCHMARK_ARENA_REPORT.json";
  else if (schemaName === "trust-pack") reportName = "TRUST_PACK_VALIDATION.json";
  else if (schemaName === "mutation-test") reportName = "MUTATION_TEST_REPORT.json";
  else if (schemaName === "release-trust") reportName = "RELEASE_TRUST_REPORT.json";

  const reportPath = path.join(REPORT_DIR, reportName);
  const schemaPath = path.join(SCHEMA_DIR, schemaFile);

  if (!fs.existsSync(reportPath)) {
    console.error(`❌ Missing report file: ${reportName}`);
    failures++;
    continue;
  }

  const reportData = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));

  // Perform basic required fields validation
  const required = schema.required ?? [];
  for (const field of required) {
    if (!(field in reportData)) {
      console.error(`❌ Report ${reportName} missing required schema field: ${field}`);
      failures++;
    }
  }
}

if (failures > 0) {
  console.error(`❌ Validation failed with ${failures} errors.`);
  process.exit(1);
}

console.log("✅ All JSON schemas passed validation checks.");
process.exit(0);
