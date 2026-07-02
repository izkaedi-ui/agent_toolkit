# Self-Test Harness Overview

> **No claim may exceed evidence.**

## Purpose

Validates the Agent OS detection pipeline against known-bad seeded fixture projects. If the orchestrator cannot detect these signals, it cannot be trusted on real repositories.

## Seeded projects

| Project | Expected domains | Expected risk |
|---|---|---|
| `fake-progress-ui/` | fake-progress, css-animation | CRITICAL |
| `2m-triangle-claim-no-proof/` | threejs, large-mesh | HIGH |
| `inaccessible-svg-dashboard/` | svg-animation | MEDIUM |

## Usage

```bash
npm run self-test
```

## Output

- `agent-os-reports/SELF_TEST_REPORT.md`
- `agent-os-reports/SELF_TEST_REPORT.json`

Exits nonzero if any test case fails.
