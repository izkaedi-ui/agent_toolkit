# Protocol Linter Overview

> **No claim may exceed evidence.**

## Purpose

The protocol linter scans all markdown files in `agent-os/` to enforce documentation quality standards.

## Rules enforced

| Rule | Severity | Description |
|---|---|---|
| `weak-language` | Warning | Flags: probably, should work, maybe, appears to, basic implementation, mostly |
| `missing-evidence-principle` | Warning | Command/overview files missing "No claim may exceed evidence" |
| `empty-file` | Warning | Empty markdown files |
| `read-error` | Error | Files that cannot be read |

## Usage

```bash
npm run lint:protocols
```

## Output

- `agent-os-reports/PROTOCOL_LINT_REPORT.md`
- `agent-os-reports/PROTOCOL_LINT_REPORT.json`

The linter exits with a nonzero code only for errors (read failures), not for warnings.
