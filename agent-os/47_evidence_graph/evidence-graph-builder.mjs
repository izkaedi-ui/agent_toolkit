#!/usr/bin/env node
/**
 * Agent OS Evidence Graph Builder
 * Reads orchestration reports and emits an evidence graph.
 *
 * No claim may exceed evidence.
 */

import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { existsSync } from 'node:fs';

const REPO_ROOT = process.cwd();
const REPORTS_DIR = join(REPO_ROOT, 'agent-os-reports');

async function readJsonReport(filename) {
  const path = join(REPORTS_DIR, filename);
  if (!existsSync(path)) return null;
  try {
    const content = await readFile(path, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

async function main() {
  console.log('🔗 Evidence Graph Builder starting...');

  const orchestration = await readJsonReport('ORCHESTRATION_DECISION_RECORD.json');
  const supercharged = await readJsonReport('SUPERCHARGED_ORCHESTRATION.json');
  const lintReport = await readJsonReport('PROTOCOL_LINT_REPORT.json');
  const selfTest = await readJsonReport('SELF_TEST_REPORT.json');

  const nodes = [];
  const timestamp = new Date().toISOString();

  // Build nodes from orchestration claims
  if (orchestration?.claimsDetected) {
    for (const claim of orchestration.claimsDetected) {
      nodes.push({
        id: `claim-${nodes.length + 1}`,
        type: 'claim',
        claim: claim.claim,
        status: 'UNPROVEN',
        source: claim.file,
        timestamp,
        evidence: [],
        links: [],
      });
    }
  }

  // Build nodes from gate selections
  const gates = supercharged?.selectedGates ?? orchestration?.selectedGates ?? [];
  for (const gate of gates) {
    nodes.push({
      id: `gate-${nodes.length + 1}`,
      type: 'gate',
      claim: `Gate: ${gate}`,
      status: 'PARTIAL',
      source: 'orchestrator',
      timestamp,
      evidence: [],
      links: [],
    });
  }

  // Build nodes from lint issues
  if (lintReport?.issues) {
    for (const issue of lintReport.issues.filter((i) => i.severity === 'error')) {
      nodes.push({
        id: `finding-${nodes.length + 1}`,
        type: 'finding',
        claim: issue.message,
        status: 'UNPROVEN',
        source: issue.file,
        timestamp,
        evidence: [],
        links: [],
      });
    }
  }

  // Build nodes from self-test results
  if (selfTest?.results) {
    for (const result of selfTest.results) {
      nodes.push({
        id: `proof-${nodes.length + 1}`,
        type: 'proof',
        claim: `Self-test: ${result.name}`,
        status: result.passed ? 'PROVEN' : 'REFUTED',
        source: 'self-test-runner',
        timestamp,
        evidence: result.detectedDomains ?? [],
        links: [],
      });
    }
  }

  const graph = {
    timestamp,
    version: '0.1.0',
    nodeCount: nodes.length,
    nodes,
    summary: {
      proven: nodes.filter((n) => n.status === 'PROVEN').length,
      unproven: nodes.filter((n) => n.status === 'UNPROVEN').length,
      partial: nodes.filter((n) => n.status === 'PARTIAL').length,
      refuted: nodes.filter((n) => n.status === 'REFUTED').length,
    },
    principle: 'No claim may exceed evidence.',
  };

  await mkdir(REPORTS_DIR, { recursive: true });

  await writeFile(
    join(REPORTS_DIR, 'EVIDENCE_GRAPH.json'),
    JSON.stringify(graph, null, 2),
    'utf-8',
  );

  const md = [
    '# Evidence Graph',
    '',
    '> **No claim may exceed evidence.**',
    '',
    `**Generated:** ${graph.timestamp}`,
    `**Nodes:** ${graph.nodeCount}`,
    '',
    '## Summary',
    '',
    `| Status | Count |`,
    `|---|---|`,
    `| ✅ Proven | ${graph.summary.proven} |`,
    `| ❓ Unproven | ${graph.summary.unproven} |`,
    `| 🔶 Partial | ${graph.summary.partial} |`,
    `| ❌ Refuted | ${graph.summary.refuted} |`,
    '',
    '## Nodes',
    '',
    ...nodes.map((n) => {
      const statusEmoji = { PROVEN: '✅', UNPROVEN: '❓', PARTIAL: '🔶', REFUTED: '❌' };
      return `- ${statusEmoji[n.status] ?? '•'} **[${n.type}]** ${n.claim} — \`${n.source}\``;
    }),
    '',
    '---',
    '> No claim may exceed evidence.',
  ].join('\n');

  await writeFile(
    join(REPORTS_DIR, 'EVIDENCE_GRAPH.md'),
    md,
    'utf-8',
  );

  console.log('✅ Evidence graph built.');
  console.log(`   Nodes: ${nodes.length} (${graph.summary.proven} proven, ${graph.summary.unproven} unproven)`);
  console.log(`   Reports written to: ${REPORTS_DIR}`);
  console.log(`   - EVIDENCE_GRAPH.md`);
  console.log(`   - EVIDENCE_GRAPH.json`);
}

main().catch((err) => {
  console.error('❌ Evidence graph builder failed:', err);
  process.exit(1);
});
