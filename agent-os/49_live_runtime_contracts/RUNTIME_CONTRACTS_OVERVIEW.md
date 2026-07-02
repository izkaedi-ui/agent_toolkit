# Live Runtime Contracts Overview

> **No claim may exceed evidence.**

## Purpose

Runtime contracts expose a typed API on `window.__AGENT_OS__` that allows agents, DevTools, and test harnesses to read live evidence from a running application.

## Contract shape

```typescript
window.__AGENT_OS__ = {
  claims: [],       // active claims from the running app
  proofs: [],       // collected proof values
  limits: {},       // defined limits (triangles, fps, etc.)
  diagnostics: {},  // live diagnostic values
  getReport() {}    // returns current state snapshot
}
```

## Usage

```typescript
import { installRuntimeContract, getRuntimeContract } from './runtime-contracts.js';

// Install in app entry point
installRuntimeContract({
  limits: { maxTriangles: 2_000_000, targetFps: 60 }
});

// Update from render loop
const contract = getRuntimeContract();
contract?.update('diagnostics', { triangleCount: renderer.info.render.triangles });

// Read from DevTools or test
const report = window.__AGENT_OS__?.getReport();
```
