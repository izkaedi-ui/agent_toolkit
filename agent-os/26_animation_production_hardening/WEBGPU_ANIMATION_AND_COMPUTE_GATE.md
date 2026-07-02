# WebGPU Animation & Compute Gate

> **No claim may exceed evidence.**

## Purpose

WebGPU shifts more responsibility to the app; diagnostics must follow.

## Required checks

1. **Adapter/device availability** — `navigator.gpu.requestAdapter()` called; fallback to WebGL if unavailable.
2. **Fallback path** — WebGL2 fallback implemented and tested.
3. **Buffer allocation** — Buffers pre-allocated; no per-frame buffer creation.
4. **Compute shader validation** — Shader WGSL validated at startup.
5. **Bind group lifecycle** — Bind groups cached; no per-frame recreation.
6. **Pipeline reuse** — Render pipelines cached by material type.
7. **Device loss handling** — `device.lost` promise handled; device reinitialization path exists.
8. **GPU timing** — `timestamp-query` feature requested if available for profiling.
9. **Memory pressure** — Buffer sizes bounded; total GPU memory budget documented.

## Final rule

No WebGPU claim is valid without adapter availability evidence and device-loss handling proof.

> No claim may exceed evidence.
