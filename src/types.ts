export interface Large3dMetrics {
  triangleCount: number;
  dpr: number;
  drawCalls: number;
  perFrameRebuildCount: number;
  hasFullWireframe: boolean;
  rayCastTargetCount: number;
}

export interface ProgressTruthSignals {
  usesTimerOnly: boolean;
  hasRealWorkUnits: boolean;
  reportedPercent?: number;
  actualWorkDone?: number;
  totalWorkUnits?: number;
}

export interface SvgAnimationData {
  hasViewBox: boolean;
  accessibilityRole?: string;
  ariaLabel?: string;
  filterCount: number;
  animatedNodeCount: number;
  isFakeProgress: boolean;
  durationMs?: number;
}

export interface WebMotionData {
  riskyProperties: string[];
  hasInfiniteAnimation: boolean;
  respectsReducedMotion: boolean;
  animationCount: number;
}

export interface ReducedMotionData {
  hasMediaQuery: boolean;
  hasPrefersReducedMotion: boolean;
  hasReducedMotionAlternative: boolean;
}

export interface OptimizationData {
  beforeMetrics: Record<string, number>;
  afterMetrics: Record<string, number>;
  usesRealProgressUnits: boolean;
  outputValidated: boolean;
}

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface Finding {
  id: string;
  category: string;
  severity: Severity;
  message: string;
  evidence?: string;
  recommendation?: string;
}

export interface AuditResult {
  passed: boolean;
  findings: Finding[];
  summary: string;
}
