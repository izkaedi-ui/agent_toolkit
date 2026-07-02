import type { AuditResult, Finding } from './types.js';

export function generateReport(results: AuditResult[]): string {
  const lines: string[] = [
    '# MCP Animation Toolkit Audit Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    '> No claim may exceed evidence.',
    '',
  ];

  for (const result of results) {
    lines.push(`## ${result.summary}`);
    lines.push('');
    lines.push(`**Status:** ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);
    lines.push('');

    if (result.findings.length === 0) {
      lines.push('No findings.');
    } else {
      lines.push('### Findings');
      lines.push('');
      for (const finding of result.findings) {
        lines.push(formatFinding(finding));
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

function formatFinding(f: Finding): string {
  const lines = [
    `**[${f.severity.toUpperCase()}]** \`${f.id}\` — ${f.message}`,
  ];
  if (f.evidence) lines.push(`  - Evidence: ${f.evidence}`);
  if (f.recommendation) lines.push(`  - Recommendation: ${f.recommendation}`);
  return lines.join('\n');
}
