import type { AuditResult, Finding, ReducedMotionData } from '../types.js';

export function auditReducedMotion(data: ReducedMotionData): AuditResult {
  const findings: Finding[] = [];

  if (!data.hasMediaQuery) {
    findings.push({
      id: 'reduced-motion-missing',
      category: 'reduced-motion',
      severity: 'high',
      message: 'No prefers-reduced-motion media query found',
      evidence: 'hasMediaQuery=false',
      recommendation: 'Add @media (prefers-reduced-motion: reduce) to all animation stylesheets.',
    });
  } else if (!data.hasPrefersReducedMotion) {
    findings.push({
      id: 'reduced-motion-incomplete',
      category: 'reduced-motion',
      severity: 'medium',
      message: 'Media query present but prefers-reduced-motion is not correctly applied',
      evidence: 'hasPrefersReducedMotion=false',
      recommendation: 'Ensure animation: none or transition: none is applied in reduced-motion context.',
    });
  }

  if (!data.hasReducedMotionAlternative) {
    findings.push({
      id: 'reduced-motion-no-alternative',
      category: 'reduced-motion',
      severity: 'medium',
      message: 'No static alternative provided for reduced-motion users',
      evidence: 'hasReducedMotionAlternative=false',
      recommendation: 'Provide a static or fade-only alternative for users who prefer reduced motion.',
    });
  }

  return {
    passed: findings.filter((f) => f.severity === 'high' || f.severity === 'critical').length === 0,
    findings,
    summary: 'Reduced Motion Audit',
  };
}
