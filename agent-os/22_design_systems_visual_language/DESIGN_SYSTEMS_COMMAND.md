# Design Systems & Visual Language Command

> **No claim may exceed evidence.**

## Purpose

Ensure agents build coherent, token-based design systems rather than ad-hoc visual decisions.

## Required checks

1. **Design tokens** — Colors, spacing, typography, radii, shadows defined as tokens, not hardcoded values.
2. **Component consistency** — UI components use the same token set throughout.
3. **Dark mode** — Dark mode supported via CSS custom properties or equivalent.
4. **Responsive breakpoints** — Breakpoints defined as tokens; no magic pixel values.
5. **Typography scale** — Font sizes follow a defined scale (e.g., Major Third, Perfect Fourth).
6. **Spacing system** — Spacing follows 4px or 8px base grid.
7. **Color contrast** — All text meets WCAG 4.5:1 (AA) contrast ratio, verified with tooling.
8. **Motion tokens** — Animation durations and easings are tokens, not hardcoded values.

## Final rule

An agent may not claim "consistent design" unless all UI decisions are traceable to defined tokens with documented rationale.

> No claim may exceed evidence.
