import { THRESHOLDS } from '../thresholds.js';
import type { AuditResult, Finding, OptimizationData } from '../types.js';

export function auditOptimization(data: OptimizationData): AuditResult {
  const findings: Finding[] = [];
  const t = THRESHOLDS.optimization;

  for (const [metric, beforeValue] of Object.entries(data.beforeMetrics)) {
    const afterValue = data.afterMetrics[metric];
    if (afterValue === undefined) {
      findings.push({
        id: `optimization-missing-after-${metric}`,
        category: 'optimization',
        severity: 'medium',
        message: `Before metric "${metric}" has no corresponding after metric`,
        evidence: `beforeMetrics.${metric}=${beforeValue}`,
        recommendation: `Measure and record afterMetrics.${metric} to validate optimization.`,
      });
      continue;
    }

    if (beforeValue > 0) {
      const improvement = (beforeValue - afterValue) / beforeValue;
      if (improvement < t.minImprovementRatio && beforeValue !== afterValue) {
        findings.push({
          id: `optimization-insufficient-improvement-${metric}`,
          category: 'optimization',
          severity: 'low',
          message: `Optimization of "${metric}" shows only ${(improvement * 100).toFixed(1)}% improvement (min: ${t.minImprovementRatio * 100}%)`,
          evidence: `before=${beforeValue}, after=${afterValue}`,
          recommendation: 'Verify optimization was applied correctly.',
        });
      }
    }
  }

  if (!data.usesRealProgressUnits) {
    findings.push({
      id: 'fake-progress-optimization',
      category: 'optimization',
      severity: 'high',
      message: 'Optimization progress is not tied to real work units',
      evidence: 'usesRealProgressUnits=false',
      recommendation: 'Report optimization progress based on actual bytes processed, vertices reduced, etc.',
    });
  }

  if (!data.outputValidated) {
    findings.push({
      id: 'optimization-output-not-validated',
      category: 'optimization',
      severity: 'medium',
      message: 'Optimization output was not validated',
      evidence: 'outputValidated=false',
      recommendation: 'Validate that optimized output is functionally equivalent to input.',
    });
  }

  return {
    passed: findings.filter((f) => f.severity === 'high' || f.severity === 'critical').length === 0,
    findings,
    summary: 'Optimization Audit',
  };
}
