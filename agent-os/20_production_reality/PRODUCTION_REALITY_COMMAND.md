# Production Reality Command

> **No claim may exceed evidence.**

## Purpose

Enforce production-grade standards on all agent-generated code. Agents must not confuse "it compiles" with "it works in production."

## Required checks

1. **Error handling** — All async operations have catch handlers or try/catch. Unhandled promise rejections are forbidden.
2. **Environment configuration** — No hardcoded secrets, API keys, or environment-specific values in source.
3. **Dependency security** — No known critical CVEs in direct dependencies.
4. **Logging** — Errors are logged with structured context, not swallowed.
5. **Build reproducibility** — `npm ci` succeeds on a clean machine.
6. **Performance budget** — Initial load meets defined TTI/LCP targets with evidence.
7. **Accessibility baseline** — WCAG 2.1 AA compliance verified with automated tools.
8. **Browser compatibility** — Target browsers defined and tested.

## Final rule

An agent may not claim "production ready" unless all eight checks above are satisfied with measured evidence, not assertions.

> No claim may exceed evidence.
