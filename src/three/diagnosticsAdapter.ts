export interface ThreeDiagnosticsState {
  triangleCount: number;
  drawCalls: number;
  fps: number;
  frameTime: number;
  perFrameRebuilds: number;
  dpr: number;
  lastUpdated: number;
}

export interface McpAnimationGlobal {
  version: string;
  state: ThreeDiagnosticsState;
  update(patch: Partial<ThreeDiagnosticsState>): void;
  getReport(): ThreeDiagnosticsState;
}

declare global {
  interface Window {
    __MCP_ANIMATION__?: McpAnimationGlobal;
  }
}

export function installDiagnosticsAdapter(): McpAnimationGlobal {
  const state: ThreeDiagnosticsState = {
    triangleCount: 0,
    drawCalls: 0,
    fps: 0,
    frameTime: 0,
    perFrameRebuilds: 0,
    dpr: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    lastUpdated: Date.now(),
  };

  const adapter: McpAnimationGlobal = {
    version: '0.1.0',
    state,
    update(patch: Partial<ThreeDiagnosticsState>) {
      Object.assign(state, patch, { lastUpdated: Date.now() });
    },
    getReport(): ThreeDiagnosticsState {
      return { ...state };
    },
  };

  if (typeof window !== 'undefined') {
    window.__MCP_ANIMATION__ = adapter;
  }

  return adapter;
}

export function getDiagnosticsAdapter(): McpAnimationGlobal | undefined {
  if (typeof window !== 'undefined') {
    return window.__MCP_ANIMATION__;
  }
  return undefined;
}
