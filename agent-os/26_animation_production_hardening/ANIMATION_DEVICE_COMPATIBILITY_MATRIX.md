# Animation Device Compatibility Matrix

> **No claim may exceed evidence.**

## Principle

"60fps" means nothing unless you say on what device.

## Target device matrix

| Device | GPU | WebGL | WebGPU | Triangle budget | Draw call budget | Notes |
|---|---|---|---|---|---|---|
| Desktop Chrome (high-end) | Dedicated | WebGL2 | Yes | 5M | 1000 | Full capabilities |
| Desktop Chrome (integrated) | Intel iris | WebGL2 | Partial | 1M | 500 | Thermal throttle risk |
| Desktop Firefox | Any | WebGL2 | Partial | 1M | 500 | No WebGPU in stable |
| Safari macOS | Apple Silicon | WebGL2 | Yes | 2M | 500 | Metal backend |
| iOS Safari | A-series | WebGL1/2 | Limited | 500k | 200 | Memory pressure |
| Android Chrome (mid) | Mali/Adreno | WebGL2 | No | 300k | 150 | Hot/throttle prone |
| Android Chrome (low) | Mali-G52 | WebGL1 | No | 100k | 100 | 512MB GPU budget |

## Animation-specific limits

| Browser | CSS animations | Web Animations API | GSAP | Framer Motion |
|---|---|---|---|---|
| Chrome | Full | Full | Full | Full |
| Firefox | Full | Full | Full | Full |
| Safari | Full | Partial | Full | Full |
| iOS Safari | Partial (transform only GPU) | Partial | Full | Full |
| Android Chrome | Full | Full | Full | Full |

## Required evidence for each claim

- FPS measurement tool used: (record here)
- Device tested: (record here)
- Test date: (record here)
- Scene description: (record here)

> No claim may exceed evidence.
