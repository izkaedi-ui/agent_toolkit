#!/usr/bin/env node

/**
 * Agent OS Unified CLI Wrapper
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const command = process.argv[2];

if (!command) {
  console.log("Usage: node agent-os-cli.mjs [verify | reports | mcp-smoke]");
  process.exit(1);
}

if (command === "verify") {
  console.log("Executing verify all...");
  execSync("npm run verify:all", { cwd: ROOT, stdio: "inherit" });
} else if (command === "reports") {
  const reportDir = path.join(ROOT, "agent-os-reports");
  if (fs.existsSync(reportDir)) {
    const files = fs.readdirSync(reportDir);
    console.log("Generated reports:");
    for (const file of files) {
      console.log(`- ${file}`);
    }
  } else {
    console.log("No reports generated yet.");
  }
} else if (command === "mcp-smoke") {
  console.log("Executing MCP smoke tests...");
  execSync("npm run mcp:smoke", { cwd: ROOT, stdio: "inherit" });
} else {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}
