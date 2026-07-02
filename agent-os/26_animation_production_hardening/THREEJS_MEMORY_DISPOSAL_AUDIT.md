# Three.js Memory Disposal Audit

> **No claim may exceed evidence.**

## Purpose

A 3D app that works once but leaks on every reload is not production-ready.

## Required disposal checks

### On component unmount / scene destroy
- [ ] `geometry.dispose()` called for all geometries
- [ ] `material.dispose()` called for all materials (including array materials)
- [ ] `texture.dispose()` called for all textures
- [ ] `renderTarget.dispose()` for all render targets
- [ ] `renderer.dispose()` on final cleanup
- [ ] `renderer.forceContextLoss()` if needed

### Animation loop
- [ ] `requestAnimationFrame` loop cancelled with `cancelAnimationFrame`
- [ ] All `setTimeout`/`setInterval` cleared

### Event listeners
- [ ] `resize` listener removed
- [ ] `mousemove`/`pointermove` removed
- [ ] WebGL context event listeners removed

### Workers
- [ ] Worker threads terminated on cleanup
- [ ] `ObjectURL.revokeObjectURL` called for blob workers

## Detection pattern

```javascript
// Attach to renderer
const info = renderer.info;
console.log('Geometries:', info.memory.geometries);
console.log('Textures:', info.memory.textures);
// Should approach 0 after scene dispose
```

> No claim may exceed evidence.
