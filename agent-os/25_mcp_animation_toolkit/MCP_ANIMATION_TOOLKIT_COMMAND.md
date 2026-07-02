# MCP Animation Toolkit Command

> **No claim may exceed evidence.**

## Purpose

The MCP Animation Toolkit provides structured audit tools for animation quality, accessible as MCP tool calls. This command describes how to invoke the toolkit and interpret results.

## Available tools

| Tool | Input | Purpose |
|---|---|---|
| `audit_large_3d` | `Large3dMetrics` | Triangle/DPR/draw-call/wireframe/raycast audit |
| `audit_progress_truth` | `ProgressTruthSignals` | Detect fake timer-only progress |
| `audit_svg_animation` | `SvgAnimationData` | SVG a11y/filters/fake-progress/node count |
| `audit_web_motion` | `WebMotionData` | Risky properties/infinite loops/reduced motion |
| `audit_reduced_motion` | `ReducedMotionData` | prefers-reduced-motion compliance |
| `audit_optimization` | `OptimizationData` | Before/after metrics, real progress units |
| `run_quality_gate` | `{ results, options }` | Fail on high findings/fake progress/missing reduced motion |

## Invocation pattern

```json
{
  "name": "audit_large_3d",
  "arguments": {
    "triangleCount": 1500000,
    "dpr": 2,
    "drawCalls": 300,
    "perFrameRebuildCount": 0,
    "hasFullWireframe": false,
    "rayCastTargetCount": 200
  }
}
```

## Final rule

No animation quality claim is valid without a passing audit result from the MCP Animation Toolkit.

> No claim may exceed evidence.
