import { THRESHOLDS } from '../thresholds.js';
import type { AuditResult, Finding, SvgAnimationData } from '../types.js';

export function auditSvgAnimation(data: SvgAnimationData): AuditResult {
  const findings: Finding[] = [];
  const t = THRESHOLDS.svgAnimation;

  if (!data.hasViewBox) {
    findings.push({
      id: 'svg-missing-viewbox',
      category: 'svg-animation',
      severity: 'medium',
      message: 'SVG is missing a viewBox attribute',
      evidence: 'hasViewBox=false',
      recommendation: 'Add a viewBox to ensure proper scaling.',
    });
  }

  if (!data.accessibilityRole || data.accessibilityRole === 'presentation') {
    if (!data.ariaLabel) {
      findings.push({
        id: 'svg-missing-accessibility',
        category: 'svg-animation',
        severity: 'high',
        message: 'Animated SVG lacks accessible role and aria-label',
        evidence: `accessibilityRole=${data.accessibilityRole ?? 'none'}, ariaLabel=${data.ariaLabel ?? 'none'}`,
        recommendation: 'Add role="img" and aria-label, or role="presentation" if purely decorative.',
      });
    }
  }

  if (data.filterCount > t.maxFilters) {
    findings.push({
      id: 'svg-excessive-filters',
      category: 'svg-animation',
      severity: 'medium',
      message: `SVG uses ${data.filterCount} filters (max: ${t.maxFilters})`,
      evidence: `filterCount=${data.filterCount}`,
      recommendation: 'Reduce filter count; cache filtered elements with will-change or CSS filter.',
    });
  }

  if (data.animatedNodeCount > t.maxAnimatedNodes) {
    findings.push({
      id: 'svg-too-many-animated-nodes',
      category: 'svg-animation',
      severity: 'high',
      message: `${data.animatedNodeCount} animated nodes exceeds limit ${t.maxAnimatedNodes}`,
      evidence: `animatedNodeCount=${data.animatedNodeCount}`,
      recommendation: 'Reduce animated node count or use canvas/WebGL for complex animations.',
    });
  }

  if (data.isFakeProgress) {
    findings.push({
      id: 'fake-progress-svg',
      category: 'svg-animation',
      severity: 'high',
      message: 'SVG animation appears to fake progress (timer-driven, no real work units)',
      evidence: 'isFakeProgress=true',
      recommendation: 'Tie SVG progress animation to real async work completion.',
    });
  }

  if (data.durationMs !== undefined && data.durationMs < t.minDurationMs) {
    findings.push({
      id: 'svg-too-fast',
      category: 'svg-animation',
      severity: 'low',
      message: `Animation duration ${data.durationMs}ms is below recommended minimum ${t.minDurationMs}ms`,
      evidence: `durationMs=${data.durationMs}`,
      recommendation: 'Increase animation duration for perceptibility and accessibility.',
    });
  }

  return {
    passed: findings.filter((f) => f.severity === 'high' || f.severity === 'critical').length === 0,
    findings,
    summary: 'SVG Animation Audit',
  };
}
