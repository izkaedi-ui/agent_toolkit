import type { AuditResult, Finding } from './types.js';

export class QualityGateError extends Error {
  constructor(
    message: string,
    public readonly findings: Finding[],
  ) {
    super(message);
    this.name = 'QualityGateError';
  }
}

export interface QualityGateOptions {
  maxHighFindings?: number;
  maxCriticalFindings?: number;
  failOnFakeProgress?: boolean;
  requireReducedMotion?: boolean;
}

export function qualityGate(
  results: AuditResult[],
  options: QualityGateOptions = {},
): void {
  const {
    maxHighFindings = 0,
    maxCriticalFindings = 0,
    failOnFakeProgress = true,
    requireReducedMotion = true,
  } = options;

  const allFindings = results.flatMap((r) => r.findings);
  const highFindings = allFindings.filter((f) => f.severity === 'high');
  const criticalFindings = allFindings.filter((f) => f.severity === 'critical');
  const fakeProgressFindings = allFindings.filter((f) =>
    f.id.includes('fake-progress'),
  );
  const reducedMotionFindings = allFindings.filter((f) =>
    f.id.includes('reduced-motion-missing'),
  );

  const failures: string[] = [];

  if (criticalFindings.length > maxCriticalFindings) {
    failures.push(
      `${criticalFindings.length} critical finding(s) (max: ${maxCriticalFindings})`,
    );
  }

  if (highFindings.length > maxHighFindings) {
    failures.push(
      `${highFindings.length} high finding(s) (max: ${maxHighFindings})`,
    );
  }

  if (failOnFakeProgress && fakeProgressFindings.length > 0) {
    failures.push(
      `${fakeProgressFindings.length} fake-progress finding(s) detected`,
    );
  }

  if (requireReducedMotion && reducedMotionFindings.length > 0) {
    failures.push(
      `${reducedMotionFindings.length} missing reduced-motion finding(s)`,
    );
  }

  if (failures.length > 0) {
    throw new QualityGateError(
      `Quality gate failed:\n${failures.map((f) => `  - ${f}`).join('\n')}`,
      allFindings,
    );
  }
}
