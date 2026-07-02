# Frontend Rendering Mastery Command

> **No claim may exceed evidence.**

## Purpose

Ensure agent-generated frontend code follows elite rendering practices: correct render modes, hydration, streaming, and performance.

## Required checks

1. **Render mode selection** — SSR/SSG/CSR/ISR choice is documented and justified by data.
2. **Hydration correctness** — No hydration mismatches. Server and client render identical initial markup.
3. **Streaming support** — Long pages use streaming SSR or Suspense where available.
4. **Core Web Vitals** — LCP, CLS, FID/INP targets defined and measured.
5. **Code splitting** — Routes and heavy components are lazy-loaded.
6. **Image optimization** — All images use optimized formats (WebP/AVIF) with width/height attributes.
7. **Font loading** — Fonts use `font-display: swap` or equivalent; no invisible text flash.
8. **Third-party impact** — Third-party script load impact measured and bounded.

## Render mode decision matrix

| Traffic pattern | Data freshness | Recommendation |
|---|---|---|
| Static content | hours/days | SSG |
| Semi-dynamic | minutes | ISR |
| User-specific | request | SSR |
| Fully interactive | real-time | CSR with SSR shell |

## Final rule

No rendering claim ("fast", "optimized", "server-rendered") is valid without Core Web Vitals evidence collected on target hardware.

> No claim may exceed evidence.
