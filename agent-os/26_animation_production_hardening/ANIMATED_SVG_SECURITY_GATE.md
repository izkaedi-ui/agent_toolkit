# Animated SVG Security Gate

> **No claim may exceed evidence.**

## Purpose

Animated assets are input files; input files are attack surfaces.

## Required security checks

### SVG sanitization
- [ ] All `<script>` elements removed from user-supplied SVG
- [ ] All `on*` event handler attributes removed
- [ ] `<foreignObject>` blocked or sandboxed
- [ ] External `href`/`src` references resolved and validated
- [ ] `<use>` references scoped to same document

### Resource exhaustion prevention
- [ ] SVG DOM node count bounded (max: 10,000)
- [ ] Path data length bounded
- [ ] Animation duration bounded (max: 60s for looping)
- [ ] Filter complexity bounded

### GLB/GLTF asset security
- [ ] File size validated before parsing
- [ ] Chunk length fields validated against actual data size
- [ ] External buffer/texture URIs validated
- [ ] No path traversal in external references

### Texture memory protection
- [ ] Texture dimensions bounded (max: 4096×4096)
- [ ] Total texture memory budget enforced
- [ ] No untrusted remote textures without CSP

## Final rule

No user-supplied SVG or 3D asset may be rendered without passing this security gate.

> No claim may exceed evidence.
