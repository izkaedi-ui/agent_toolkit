#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const AGENT_OS = path.join(ROOT, "agent-os");
const DOCS = path.join(ROOT, "docs");

const sections = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(full);
    } else if (/\.md$/i.test(entry.name)) {
      const rel = path.relative(ROOT, full).replaceAll("\\", "/");
      const firstLine = fs.readFileSync(full, "utf8").split(/\r?\n/).find((line) => line.startsWith("# "));
      sections.push({
        title: firstLine ? firstLine.replace(/^#\s+/, "") : rel,
        path: rel
      });
    }
  }
}

walk(AGENT_OS);

sections.sort((a, b) => a.path.localeCompare(b.path));

fs.mkdirSync(DOCS, { recursive: true });

fs.writeFileSync(
  path.join(DOCS, "index.md"),
  `# Agent OS Toolkit Documentation

Generated index of Agent OS protocols and commands.

## Protocol Index

${sections.map((section) => `- [${section.title}](../${section.path})`).join("\n")}

## Core Principle

No claim may exceed evidence.
`
);

console.log(`Generated docs/index.md with ${sections.length} entries.`);
