# 3D Browser Agent Bible

> **No claim may exceed evidence.**

## Purpose

The authoritative reference for agents building WebGL/WebGPU/Three.js applications in the browser.

## The 12 Laws of 3D Browser Development

### Law 1: Triangle budgets are real
Never claim a scene "performs well" without measuring triangle count, draw calls, and FPS on target hardware.
Maximum before optimization required: **2,000,000 triangles**, **500 draw calls**, **60 FPS target**.

### Law 2: Memory must be managed
Every geometry, material, and texture must be disposed of when removed from the scene.
`geometry.dispose()`, `material.dispose()`, `texture.dispose()` are not optional.

### Law 3: DPR must be capped
`renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` is the minimum standard.
Uncapped DPR on a Retina/4K display multiplies fragment work by 4×.

### Law 4: The render loop is sacred
Never allocate objects in the render loop. No `new Vector3()`, no `new Array()`, no `.map()`.
Pre-allocate everything before the loop starts.

### Law 5: LOD is required for large scenes
Any mesh over 100k triangles requires an LOD strategy. Claims of "smooth performance" on large scenes require LOD evidence.

### Law 6: Raycasting must be bounded
Unbounded raycasting against complex geometry is O(n·triangles). Use BVH, layers, or simplified collision geometry.

### Law 7: Shader cost must be considered
Complex fragment shaders on large geometry multiply cost. Measure with GPU timers or DevTools frame inspector.

### Law 8: Context loss must be handled
WebGL context loss happens on mobile. Implement `webglcontextlost` and `webglcontextrestored` handlers.

### Law 9: Loading must show real progress
Loading progress must reflect real bytes loaded, not a timer. `THREE.LoadingManager` must be wired to actual asset loads.

### Law 10: Accessibility must not be sacrificed
3D scenes must provide text alternatives, reduced-motion alternatives, and keyboard access to important interactions.

### Law 11: Mobile is a first-class target
Test on mid-range Android and iOS. Halve your triangle budget for mobile. Use `isMobile` detection for adaptive quality.

### Law 12: Evidence precedes all claims
No performance, quality, or compatibility claim is valid without measured data from real devices.

> No claim may exceed evidence.
