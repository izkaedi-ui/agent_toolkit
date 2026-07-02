# Elite Animation Systems Command

> **No claim may exceed evidence.**

## Purpose

Apply production-grade standards to all animation systems, whether CSS, JavaScript, SVG, WebGL, or physics-based.

## Required checks

1. **Real state drives animation** — Animation state must derive from real application state, not an independent timer.
2. **Reduced motion** — Every animated component has a `prefers-reduced-motion` alternative.
3. **60fps budget** — Animations must complete their work within 16ms per frame. Evidence required.
4. **No layout thrash** — Animations use `transform` and `opacity` unless there is documented justification.
5. **Infinite loops are limited** — No more than 3 simultaneous infinite CSS/JS animations without explicit justification.
6. **Easing is intentional** — No `linear` easing on UI transitions. Easing type documented with rationale.
7. **Progress is honest** — Progress animations reflect real work completion, not elapsed time.
8. **Memory is cleaned up** — Animation loops, event listeners, and timers are removed when components unmount.

## Animation quality tiers

| Tier | Description | Evidence required |
|---|---|---|
| Basic | Fade in/out, simple slide | Reduced motion check |
| Standard | Sequenced transitions, enter/exit | FPS measurement |
| Advanced | Physics, 3D, complex choreography | FPS + jank trace + reduced motion |
| Elite | Immersive, data-driven, GPU-accelerated | Full audit report |

## Final rule

An agent may not claim an animation is "smooth", "professional", or "polished" without measured FPS evidence and confirmed reduced-motion support.

> No claim may exceed evidence.
