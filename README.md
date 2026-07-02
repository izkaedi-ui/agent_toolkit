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

## Current Baseline

- **Score**: 80/100 — 🟢 STRONG
- **Self-tests**: 3/3 passed
- **Benchmark Arena v1**: 4/4 passed
- **Benchmark Arena v2**: 12/12 passed
- **Mutation checks**: 3/3 passed
- **CI Build**: passing (GitHub Actions Run #9)
- **Report/viewer artifacts**: 35

---

## Quickstart

```bash
node --version   # must be >= 20
npm ci
npm run verify:all
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
| `npm run validate:reports` | Validate required reports and scorecard thresholds |
| `npm run benchmark:arena` | Run benchmark arena v1 checks |
| `npm run benchmark:arena:v2` | Run benchmark arena v2 checks |
| `npm run golden:verify` | Run golden shape report verification checks |
| `npm run mutation:test` | Run mutation robustness linter check |
| `npm run release:trust` | Run release trust checklist verifications |
| `npm run schema:validate` | Run JSON schema validations over generated reports |
| `npm run mcp:stdio` | Launch the stdio transport MCP server |
| `npm run mcp:smoke` | Run the MCP stdio compliance smoke test client |
| `npm run package:check` | Run npm publishing readiness checks |
| `npm run claim:diff` | Generate claim diff maps from code |
| `npm run proof:debt` | Count codebase TODO/FIXME proof debts |
| `npm run release:manifest` | Build final release metadata tag manifest |
| `npm run evidence:manifest` | Hash all JSON reports with SHA-256 |
| `npm run viewer:generate` | Build interactive HTML report viewer |
| `npm run verify:all` | Run all checks, manifests, and dashboards |

All generated reports are written to `agent-os-reports/` (git-ignored).

---

## MCP stdio Usage

Launch the compliant stdio transport server:
```bash
npm run mcp:stdio
```

Verify compliance using the smoke test client:
```bash
npm run mcp:smoke
```

### Supported JSON-RPC 2.0 Methods

- `initialize` — Handshake negotiated protocol version (`2024-11-05`)
- `notifications/initialized` — Complete handshake loop
- `tools/list` — List available tool commands (`agent_os.orchestrate`, `agent_os.score`, etc.)
- `tools/call` — Execute verification commands and return structured content payloads

Example JSON-RPC request format:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list"
}
```

---

## Reports Generated (35 Artifacts)

All validation, diagnostic, and viewer reports are written to `agent-os-reports/`:

* **ORCHESTRATION_DECISION_RECORD.md / .json**: Base meta-orchestrator selector mappings.
* **SUPERCHARGED_ORCHESTRATION.md / .json**: Supercharged risk and gate mapping logs.
* **PROTOCOL_LINT_REPORT.md / .json**: Markdown lint findings.
* **SELF_TEST_REPORT.md / .json**: Fixture sandbox outputs.
* **EVIDENCE_GRAPH.md / .json**: Node dependencies map.
* **SCORECARD.md / .json**: Unified performance scorecard.
* **TRUST_PACK_VALIDATION.md / .json**: Scorecard boundary and presence checks.
* **BENCHMARK_ARENA_REPORT.md / .json**: v1 benchmark results.
* **BENCHMARK_ARENA_V2_REPORT.md / .json**: v2 benchmark precision/recall/F1 metrics.
* **GOLDEN_REPORT_VERIFY.md / .json**: Shape property validators.
* **MUTATION_TEST_REPORT.md / .json**: Linter robustness verify logs.
* **RELEASE_TRUST_REPORT.md / .json**: Release readiness indicators.
* **PUBLISHING_READINESS_REPORT.md / .json**: Package property verification.
* **CLAIM_DIFF_REPORT.md / .json**: Documented claims mapped to implementations.
* **PROOF_DEBT_REPORT.md / .json**: TODO/FIXME proof debt counts.
* **RELEASE_ARTIFACT_MANIFEST.md / .json**: Release metadata summary linking tag to evidence.
* **VERSION_EVIDENCE_MANIFEST.md / .json**: SHA-256 hashes of verification output files.
* **index.html**: Static diagnostics viewer dashboard.

---

## Core truth principle

> **No claim may exceed evidence.**

Every audit, orchestration decision, and scorecard entry must be backed by measured data, not assertions.

---

## License

MIT
