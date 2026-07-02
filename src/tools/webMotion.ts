import { THRESHOLDS } from '../thresholds.js';
import type { AuditResult, Finding, WebMotionData } from '../types.js';

export function auditWebMotion(data: WebMotionData): AuditResult {
  const findings: Finding[] = [];
  const t = THRESHOLDS.webMotion;

  const riskySet = new Set<string>(t.riskyProperties);
  const riskyUsed = data.riskyProperties.filter((p) => riskySet.has(p));
  if (riskyUsed.length > 0) {
    findings.push({
      id: 'web-motion-risky-properties',
      category: 'web-motion',
      severity: 'medium',
      message: `Animation uses layout-triggering properties: ${riskyUsed.join(', ')}`,
      evidence: `riskyProperties=[${riskyUsed.join(', ')}]`,
      recommendation: 'Prefer transform and opacity for GPU-accelerated animation.',
    });
  }

  if (data.hasInfiniteAnimation && data.animationCount > t.maxInfiniteAnimations) {
    findings.push({
      id: 'web-motion-too-many-infinite',
      category: 'web-motion',
      severity: 'medium',
      message: `${data.animationCount} infinite animations detected (max: ${t.maxInfiniteAnimations})`,
      evidence: `animationCount=${data.animationCount}, hasInfiniteAnimation=true`,
      recommendation: 'Limit infinite animations; pause off-screen animations.',
    });
  }

  if (!data.respectsReducedMotion) {
    findings.push({
      id: 'reduced-motion-missing',
      category: 'web-motion',
      severity: 'high',
      message: 'Animation does not respect prefers-reduced-motion media query',
      evidence: 'respectsReducedMotion=false',
      recommendation: 'Add @media (prefers-reduced-motion: reduce) { ... } to disable or reduce motion.',
    });
  }

  return {
    passed: findings.filter((f) => f.severity === 'high' || f.severity === 'critical').length === 0,
    findings,
    summary: 'Web Motion Audit',
  };
}
