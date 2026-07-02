export const THRESHOLDS = {
  large3d: {
    maxTriangles: 2_000_000,
    maxDpr: 2,
    maxDrawCalls: 500,
    maxPerFrameRebuilds: 0,
    maxRayCastTargets: 1000,
  },
  svgAnimation: {
    maxFilters: 5,
    maxAnimatedNodes: 100,
    minDurationMs: 100,
  },
  webMotion: {
    riskyProperties: ['top', 'left', 'right', 'bottom', 'width', 'height', 'margin', 'padding'],
    maxInfiniteAnimations: 3,
  },
  optimization: {
    minImprovementRatio: 0.1,
  },
} as const;
