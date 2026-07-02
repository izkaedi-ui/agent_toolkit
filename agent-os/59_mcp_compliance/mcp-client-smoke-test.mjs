#!/usr/bin/env node

/**
 * MCP Stdio Server Smoke Test Client
 */
import { spawn } from "node:child_process";
import path from "node:path";

const ROOT = process.cwd();
const serverScript = path.join(ROOT, "agent-os/52_mcp_transport/mcp-stdio-server.mjs");

console.log("Starting MCP compliance smoke test...");

const server = spawn("node", [serverScript], {
  cwd: ROOT,
  shell: process.platform === "win32"
});

let buffer = "";
server.stdout.on("data", (data) => {
  buffer += data.toString();
  if (buffer.includes("\n")) {
    const lines = buffer.split("\n");
    buffer = lines.pop();

    for (const line of lines) {
      if (!line.trim()) continue;
      const msg = JSON.parse(line);
      console.log("Server response:", JSON.stringify(msg));

      if (msg.id === 1) {
        // Assert list response is formatted
        if (msg.result?.tools) {
          console.log("✅ Tool list compliance verified.");
        } else {
          console.error("❌ Tool list failed validation.");
          process.exit(1);
        }
        // Send unknown method request
        const unknownCall = {
          jsonrpc: "2.0",
          id: 2,
          method: "non_existent_method"
        };
        server.stdin.write(JSON.stringify(unknownCall) + "\n");
      } else if (msg.id === 2) {
        if (msg.error?.code === -32601) {
          console.log("✅ Server successfully returned -32601 for unknown method.");
        } else {
          console.error("❌ Failed structured error code validation:", msg);
          process.exit(1);
        }
        // Send tool call request
        const toolCall = {
          jsonrpc: "2.0",
          id: 3,
          method: "tools/call",
          params: { name: "agent_os.score" }
        };
        server.stdin.write(JSON.stringify(toolCall) + "\n");
      } else if (msg.id === 3) {
        if (msg.result?.content) {
          console.log("✅ Tool call response wrapped in content array.");
          console.log("✅ Stdio transport smoke test passed successfully.");
          server.kill();
          process.exit(0);
        } else {
          console.error("❌ Tool call format error:", msg);
          process.exit(1);
        }
      }
    }
  }
});

server.stderr.on("data", (data) => {
  console.error("Server Stderr:", data.toString());
});

server.on("exit", (code) => {
  if (code !== 0 && code !== null) {
    console.error(`Server process exited with code ${code}`);
    process.exit(1);
  }
});

// Start by sending list request
const handshake = {
  jsonrpc: "2.0",
  id: 1,
  method: "tools/list"
};
server.stdin.write(JSON.stringify(handshake) + "\n");

// Safety timeout
setTimeout(() => {
  console.error("❌ Smoke test timed out.");
  server.kill();
  process.exit(1);
}, 6000);
