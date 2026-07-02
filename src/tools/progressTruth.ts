import type { AuditResult, Finding, ProgressTruthSignals } from '../types.js';

export function auditProgressTruth(signals: ProgressTruthSignals): AuditResult {
  const findings: Finding[] = [];

  if (signals.usesTimerOnly && !signals.hasRealWorkUnits) {
    findings.push({
      id: 'fake-progress-timer-only',
      category: 'progress-truth',
      severity: 'high',
      message: 'Progress bar is driven by a timer only, not real work units',
      evidence: 'usesTimerOnly=true, hasRealWorkUnits=false',
      recommendation: 'Tie progress updates to real async operations, chunk completions, or bytes transferred.',
    });
  }

  if (
    signals.reportedPercent !== undefined &&
    signals.actualWorkDone !== undefined &&
    signals.totalWorkUnits !== undefined &&
    signals.totalWorkUnits > 0
  ) {
    const realPercent = (signals.actualWorkDone / signals.totalWorkUnits) * 100;
    const drift = Math.abs(signals.reportedPercent - realPercent);
    if (drift > 10) {
      findings.push({
        id: 'fake-progress-percent-drift',
        category: 'progress-truth',
        severity: 'high',
        message: `Reported progress ${signals.reportedPercent.toFixed(1)}% drifts ${drift.toFixed(1)}% from real progress ${realPercent.toFixed(1)}%`,
        evidence: `reportedPercent=${signals.reportedPercent}, actualWorkDone=${signals.actualWorkDone}, totalWorkUnits=${signals.totalWorkUnits}`,
        recommendation: 'Compute progress from actualWorkDone / totalWorkUnits.',
      });
    }
  }

  return {
    passed: findings.filter((f) => f.severity === 'high' || f.severity === 'critical').length === 0,
    findings,
    summary: 'Progress Truth Audit',
  };
}
