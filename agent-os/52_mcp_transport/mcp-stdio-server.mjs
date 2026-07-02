#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

const ROOT = process.cwd();

const commands = {
  "agent_os.orchestrate": ["npm", ["run", "orchestrate"]],
  "agent_os.orchestrate_super": ["npm", ["run", "orchestrate:super"]],
  "agent_os.lint_protocols": ["npm", ["run", "lint:protocols"]],
  "agent_os.self_test": ["npm", ["run", "self-test"]],
  "agent_os.score": ["npm", ["run", "score"]],
  "agent_os.validate_reports": ["npm", ["run", "validate:reports"]]
};

function respond(id, result) {
  process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, result }) + "\n");
}

function error(id, code, message) {
  process.stdout.write(
    JSON.stringify({
      jsonrpc: "2.0",
      id,
      error: { code, message }
    }) + "\n"
  );
}

function runTool(name) {
  const command = commands[name];

  if (!command) {
    return {
      ok: false,
      message: `Unknown tool: ${name}`
    };
  }

  const [bin, args] = command;

  const run = spawnSync(bin, args, {
    cwd: ROOT,
    shell: process.platform === "win32",
    encoding: "utf8"
  });

  return {
    ok: run.status === 0,
    status: run.status,
    stdout: run.stdout,
    stderr: run.stderr
  };
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on("line", (line) => {
  if (!line.trim()) return;

  let message;

  try {
    message = JSON.parse(line);
  } catch {
    error(null, -32700, "Invalid JSON");
    return;
  }

  const { id, method, params } = message;

  if (method === "tools/list") {
    const manifestPath = path.join(ROOT, "agent-os/52_mcp_transport/mcp-tools.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    respond(id, { tools: manifest.tools });
    return;
  }

  if (method === "tools/call") {
    const name = params?.name;

    if (!name) {
      error(id, -32602, "Missing params.name");
      return;
    }

    const result = runTool(name);
    respond(id, result);
    return;
  }

  error(id, -32601, `Unknown method: ${method}`);
});
