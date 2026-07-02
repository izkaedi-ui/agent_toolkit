# Animation Repair Cookbook

> **No claim may exceed evidence.**

## Recipe 1: Repair fake progress

**Symptom:** Progress bar reaches 100% but work is still running, or jumps to 100% instantly.

**Detection:** `auditProgressTruth({ usesTimerOnly: true, hasRealWorkUnits: false })`

**Root cause:** Progress driven by `setTimeout` or `setInterval`, not real work completion signals.

**Safe fix:**
```javascript
// Before (fake)
let progress = 0;
const interval = setInterval(() => { progress += 10; }, 100);

// After (real)
async function doWork() {
  for (let i = 0; i < chunks.length; i++) {
    await processChunk(chunks[i]);
    setProgress((i + 1) / chunks.length * 100);
  }
}
```

**Test/proof:** `auditProgressTruth({ usesTimerOnly: false, hasRealWorkUnits: true })` must pass.

---

## Recipe 2: Repair large 3D jank

**Symptom:** Frame rate drops below 30fps with large meshes loaded.

**Detection:** `auditLarge3d({ triangleCount: 5000000, drawCalls: 800, ... })`

**Root cause:** Unoptimized mesh imported directly; no LOD; too many draw calls.

**Safe fix:**
1. Apply `SimplifyModifier` or Draco compression
2. Implement `THREE.LOD` with 3 levels
3. Merge static geometries with `BufferGeometryUtils.mergeGeometries`
4. Use `InstancedMesh` for repeated objects

**Test/proof:** FPS measured at ≥ 60 on target hardware with `renderer.info.render.triangles` logged.

---

## Recipe 3: Repair SVG animation accessibility

**Symptom:** SVG spinner/chart fails automated a11y scan.

**Detection:** `auditSvgAnimation({ hasViewBox: true, accessibilityRole: undefined, ariaLabel: undefined, ... })`

**Safe fix:**
```html
<!-- Before -->
<svg class="spinner">...</svg>

<!-- After -->
<svg class="spinner" role="img" aria-label="Loading, please wait" aria-live="polite">
  <title>Loading</title>
  ...
</svg>
```

**Test/proof:** axe-core scan passes; `auditSvgAnimation` returns `passed: true`.

---

## Recipe 4: Repair missing reduced motion

**Symptom:** Users with vestibular disorders report dizziness from animations.

**Detection:** `auditReducedMotion({ hasMediaQuery: false, ... })`

**Safe fix:**
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .spinner { animation: none; opacity: 0.7; }
}
```

**Test/proof:** `auditReducedMotion({ hasMediaQuery: true, hasPrefersReducedMotion: true, hasReducedMotionAlternative: true })` passes.

> No claim may exceed evidence.
