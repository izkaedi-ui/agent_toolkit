# Agent OS Toolkit

> **No claim may exceed evidence.**

A TypeScript/Node 20 toolkit containing the Agent OS protocol library, a supercharged meta-orchestrator, MCP animation toolkit, protocol linter, self-test harness, scorecard, and CI workflow.

---

## What is Agent OS Toolkit?

Agent OS Toolkit provides:

- **Protocol library** — Markdown command files covering production reality, frontend rendering mastery, design systems, 3D/browser agent rules, elite animation systems, MCP animation toolkit, and animation production hardening.
- **Supercharged meta-orchestrator** — Walks any repository, detects domains, selects gates, finds claims, and writes decision records.
- **MCP animation toolkit** — TypeScript modules for auditing large 3D scenes, SVG animation, web motion, reduced motion, and optimization.
- **Protocol linter** — Scans protocol markdown for weak language, missing evidence principles, and empty files.
- **Self-test harness** — Seeded fixture projects with expected failures; validates the orchestrator pipeline end-to-end.
- **Evidence graph** — Reads orchestration reports and emits an evidence graph.
- **Scorecard** — Aggregates all reports into a final pass/fail score.
- **CI workflow** — GitHub Actions pipeline running all steps and uploading reports.

---

## Install

```bash
node --version   # must be >= 20
npm install
```

---

## Commands

| Command | What it does |
|---|---|
| `npm run build` | Compile TypeScript source to `dist/` |
| `npm run typecheck` | Type-check without emitting |
| `npm run orchestrate` | Run the meta-orchestrator; write `agent-os-reports/ORCHESTRATION_DECISION_RECORD.*` |
| `npm run orchestrate:super` | Run the supercharged orchestrator; write `agent-os-reports/SUPERCHARGED_ORCHESTRATION.*` |
| `npm run lint:protocols` | Lint protocol markdown; write `agent-os-reports/PROTOCOL_LINT_REPORT.*` |
| `npm run self-test` | Run self-test harness against seeded projects; write `agent-os-reports/SELF_TEST_REPORT.*` |
| `npm run score` | Aggregate all reports into `agent-os-reports/SCORECARD.*` |

All generated reports are written to `agent-os-reports/` (git-ignored).

---

## Reports generated

| File | Source |
|---|---|
| `agent-os-reports/ORCHESTRATION_DECISION_RECORD.md` | `npm run orchestrate` |
| `agent-os-reports/ORCHESTRATION_DECISION_RECORD.json` | `npm run orchestrate` |
| `agent-os-reports/SUPERCHARGED_ORCHESTRATION.md` | `npm run orchestrate:super` |
| `agent-os-reports/SUPERCHARGED_ORCHESTRATION.json` | `npm run orchestrate:super` |
| `agent-os-reports/PROTOCOL_LINT_REPORT.md` | `npm run lint:protocols` |
| `agent-os-reports/PROTOCOL_LINT_REPORT.json` | `npm run lint:protocols` |
| `agent-os-reports/SELF_TEST_REPORT.md` | `npm run self-test` |
| `agent-os-reports/SELF_TEST_REPORT.json` | `npm run self-test` |
| `agent-os-reports/EVIDENCE_GRAPH.md` | `npm run score` (via evidence graph builder) |
| `agent-os-reports/EVIDENCE_GRAPH.json` | `npm run score` |
| `agent-os-reports/SCORECARD.md` | `npm run score` |
| `agent-os-reports/SCORECARD.json` | `npm run score` |

---

## Supercharged meta-orchestrator

```bash
npm run orchestrate:super
```

The supercharged orchestrator walks the repository, detects domains from file names and content patterns (TypeScript, React, Three.js, SVG, CSS animation, GSAP, Framer Motion, WebGL/WebGPU, etc.), selects applicable protocol gates, detects unproven claims, and writes a full decision record with recommended next steps.

---

## MCP animation toolkit

The TypeScript source under `src/` exposes:

- `auditLarge3d(metrics)` — audit Three.js scenes for triangle count, DPR, draw calls, per-frame rebuilds, raycast risk
- `auditProgressTruth(signals)` — detect fake timer-only progress bars
- `auditSvgAnimation(data)` — audit SVG animations for accessibility, filters, fake progress, animated node count
- `auditWebMotion(data)` — detect risky CSS/JS animation properties, infinite animations, reduced-motion violations
- `auditReducedMotion(data)` — validate reduced-motion media query support
- `auditOptimization(data)` — verify before/after optimization metrics are real and progress units are honest
- `generateReport(findings)` — produce a Markdown report
- `qualityGate(findings)` — pass/fail gate; throws on high findings, fake progress, or missing reduced-motion

Three.js diagnostics adapter (`src/three/diagnosticsAdapter.ts`) exposes `window.__MCP_ANIMATION__` at runtime.

MCP server adapter (`src/mcp/server.ts`) exports tool-style functions for MCP-compatible invocation.

---

## Core truth principle

> **No claim may exceed evidence.**

Every audit, orchestration decision, and scorecard entry must be backed by measured data, not assertions.

---

## License

MIT
