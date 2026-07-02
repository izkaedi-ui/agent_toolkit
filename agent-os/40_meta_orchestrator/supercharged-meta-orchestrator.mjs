#!/usr/bin/env node
/**
 * Agent OS Supercharged Meta-Orchestrator
 * Enhanced version with deeper domain detection, claim evidence analysis,
 * risk scoring, and comprehensive decision records.
 *
 * No claim may exceed evidence.
 */

import { readdir, readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';

const REPO_ROOT = process.cwd();
const REPORTS_DIR = join(REPO_ROOT, 'agent-os-reports');
const IGNORE_DIRS = new Set(['.git', 'node_modules', 'dist', 'build', '.next', 'coverage']);

const DOMAIN_DETECTORS = [
  {
    domain: 'typescript',
    description: 'TypeScript source code',
    tests: [
      { type: 'ext', value: '.ts' },
      { type: 'ext', value: '.tsx' },
      { type: 'filename', value: 'tsconfig.json' },
    ],
    gate: 'Frontend Rendering Mastery',
    riskLevel: 'low',
  },
  {
    domain: 'react',
    description: 'React component tree',
    tests: [
      { type: 'ext', value: '.tsx' },
      { type: 'content', value: /from ['"]react['"]/i },
      { type: 'content', value: /useState|useEffect|useRef|useCallback/i },
    ],
    gate: 'Frontend Rendering Mastery',
    riskLevel: 'medium',
  },
  {
    domain: 'threejs',
    description: 'Three.js 3D engine',
    tests: [
      { type: 'content', value: /from ['"]three['"]/i },
      { type: 'content', value: /THREE\.\w+/i },
      { type: 'content', value: /new THREE\./i },
    ],
    gate: '3D Browser Bible',
    riskLevel: 'high',
  },
  {
    domain: 'webgl',
    description: 'Raw WebGL',
    tests: [
      { type: 'content', value: /getContext\(['"]webgl/i },
      { type: 'content', value: /gl\.(draw|bind|create|uniform)/i },
    ],
    gate: '3D Browser Bible',
    riskLevel: 'high',
  },
  {
    domain: 'webgpu',
    description: 'WebGPU API',
    tests: [
      { type: 'content', value: /navigator\.gpu/i },
      { type: 'content', value: /GPUDevice|GPUAdapter|GPUBuffer/i },
    ],
    gate: '3D Browser Bible (WebGPU)',
    riskLevel: 'high',
  },
  {
    domain: 'svg-animation',
    description: 'SVG animation',
    tests: [
      { type: 'ext', value: '.svg' },
      { type: 'content', value: /<animate|<animateTransform|<animateMotion/i },
      { type: 'content', value: /\.svg\b/i },
    ],
    gate: 'MCP Animation Toolkit (SVG)',
    riskLevel: 'medium',
  },
  {
    domain: 'css-animation',
    description: 'CSS animations and transitions',
    tests: [
      { type: 'ext', value: '.css' },
      { type: 'content', value: /@keyframes/i },
      { type: 'content', value: /animation:|transition:/i },
    ],
    gate: 'Elite Animation Systems',
    riskLevel: 'medium',
  },
  {
    domain: 'gsap',
    description: 'GSAP animation library',
    tests: [
      { type: 'content', value: /from ['"]gsap['"]/i },
      { type: 'content', value: /gsap\.(to|from|timeline)/i },
    ],
    gate: 'Elite Animation Systems',
    riskLevel: 'medium',
  },
  {
    domain: 'framer-motion',
    description: 'Framer Motion animation library',
    tests: [
      { type: 'content', value: /from ['"]framer-motion['"]/i },
      { type: 'content', value: /motion\.\w+/i },
    ],
    gate: 'Elite Animation Systems',
    riskLevel: 'medium',
  },
  {
    domain: 'design-system',
    description: 'Design token/system',
    tests: [
      { type: 'filename', value: 'tokens.ts' },
      { type: 'filename', value: 'theme.ts' },
      { type: 'content', value: /design.token|css.variable|--color|--spacing/i },
    ],
    gate: 'Design Systems',
    riskLevel: 'low',
  },
  {
    domain: 'fake-progress',
    description: 'Potential fake progress pattern',
    tests: [
      { type: 'content', value: /setInterval.*progress|progress.*setInterval/i },
      { type: 'content', value: /setTimeout.*100|progress.*timer/i },
    ],
    gate: 'MCP Animation Toolkit (Progress Truth)',
    riskLevel: 'critical',
  },
  {
    domain: 'large-mesh',
    description: 'Large 3D mesh claim',
    tests: [
      { type: 'content', value: /2.000.000|2M.tri|million.tri/i },
      { type: 'content', value: /triangleCount|vertexCount/i },
    ],
    gate: 'MCP Animation Toolkit (Large 3D)',
    riskLevel: 'high',
  },
];

const RISK_WEIGHTS = { low: 1, medium: 3, high: 7, critical: 15 };

async function walkDir(dir, files = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkDir(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

async function analyzeFile(file) {
  const relPath = file.replace(REPO_ROOT + '/', '');
  const ext = extname(file);
  const name = basename(file);
  const textExts = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.css', '.html', '.svg', '.md', '.json']);

  let content = '';
  if (textExts.has(ext)) {
    try {
      const fileStat = await stat(file);
      if (fileStat.size < 500_000) {
        content = await readFile(file, 'utf-8');
      }
    } catch {
      // skip
    }
  }

  const matches = [];
  for (const detector of DOMAIN_DETECTORS) {
    for (const test of detector.tests) {
      let matched = false;
      if (test.type === 'ext' && ext === test.value) matched = true;
      else if (test.type === 'filename' && name === test.value) matched = true;
      else if (test.type === 'content' && content && test.value.test(content)) matched = true;

      if (matched) {
        matches.push({ domain: detector.domain, gate: detector.gate, riskLevel: detector.riskLevel });
        break;
      }
    }
  }

  return { relPath, matches };
}

async function main() {
  console.log('🚀 Agent OS Supercharged Meta-Orchestrator starting...');
  console.log(`   Repository root: ${REPO_ROOT}`);

  const files = await walkDir(REPO_ROOT);
  console.log(`   Files found: ${files.length}`);

  // Analyze all files
  const fileAnalyses = await Promise.all(files.map(analyzeFile));

  // Aggregate domain stats
  const domainMap = new Map();
  for (const analysis of fileAnalyses) {
    for (const match of analysis.matches) {
      if (!domainMap.has(match.domain)) {
        const detector = DOMAIN_DETECTORS.find((d) => d.domain === match.domain);
        domainMap.set(match.domain, {
          domain: match.domain,
          description: detector?.description ?? '',
          gate: match.gate,
          riskLevel: match.riskLevel,
          files: [],
          riskScore: 0,
        });
      }
      const entry = domainMap.get(match.domain);
      entry.files.push(analysis.relPath);
      entry.riskScore += RISK_WEIGHTS[match.riskLevel] ?? 1;
    }
  }

  // Deduplicate files per domain
  for (const entry of domainMap.values()) {
    entry.files = [...new Set(entry.files)];
  }

  // Sort by risk score
  const domains = [...domainMap.values()].sort((a, b) => b.riskScore - a.riskScore);
  const selectedGates = [...new Set(domains.map((d) => d.gate))];

  // Compute overall risk score
  const overallRiskScore = domains.reduce((sum, d) => sum + d.riskScore, 0);
  let riskTier = 'LOW';
  if (overallRiskScore > 100) riskTier = 'CRITICAL';
  else if (overallRiskScore > 50) riskTier = 'HIGH';
  else if (overallRiskScore > 20) riskTier = 'MEDIUM';

  const recommendations = [];
  for (const domain of domains) {
    if (domain.domain === 'fake-progress') {
      recommendations.push('CRITICAL: Run MCP Animation Toolkit progress truth audit immediately.');
    }
    if (domain.domain === 'threejs' || domain.domain === 'webgl') {
      recommendations.push('HIGH: Run 3D Browser Bible gate and large-3D audit.');
    }
    if (domain.domain === 'css-animation' || domain.domain === 'framer-motion' || domain.domain === 'gsap') {
      recommendations.push('MEDIUM: Run Elite Animation Systems gate including reduced-motion check.');
    }
    if (domain.domain === 'large-mesh') {
      recommendations.push('HIGH: Verify large mesh triangle claim with measured renderer.info data.');
    }
  }

  const uniqueRecommendations = [...new Set(recommendations)];

  const record = {
    timestamp: new Date().toISOString(),
    orchestratorVersion: 'supercharged-1.0.0',
    repositoryRoot: REPO_ROOT,
    filesScanned: files.length,
    overallRiskScore,
    riskTier,
    domainsDetected: domains.map((d) => ({
      domain: d.domain,
      description: d.description,
      gate: d.gate,
      riskLevel: d.riskLevel,
      riskScore: d.riskScore,
      fileCount: d.files.length,
      topFiles: d.files.slice(0, 5),
    })),
    selectedGates,
    recommendations: uniqueRecommendations,
    principle: 'No claim may exceed evidence.',
  };

  await mkdir(REPORTS_DIR, { recursive: true });

  await writeFile(
    join(REPORTS_DIR, 'SUPERCHARGED_ORCHESTRATION.json'),
    JSON.stringify(record, null, 2),
    'utf-8',
  );

  const riskEmoji = { LOW: '🟢', MEDIUM: '🟡', HIGH: '🟠', CRITICAL: '🔴' };

  const md = [
    '# Supercharged Orchestration Decision Record',
    '',
    '> **No claim may exceed evidence.**',
    '',
    `**Generated:** ${record.timestamp}`,
    `**Orchestrator:** ${record.orchestratorVersion}`,
    `**Files scanned:** ${record.filesScanned}`,
    `**Overall risk score:** ${record.overallRiskScore} ${riskEmoji[record.riskTier] ?? ''} ${record.riskTier}`,
    '',
    '## Domains detected (by risk score)',
    '',
    '| Domain | Description | Gate | Risk | Score | Files |',
    '|---|---|---|---|---|---|',
    ...domains.map((d) =>
      `| ${d.domain} | ${d.description} | ${d.gate} | ${d.riskLevel.toUpperCase()} | ${d.riskScore} | ${d.fileCount} |`
    ),
    '',
    '## Selected gates',
    '',
    ...selectedGates.map((g) => `- ${g}`),
    '',
    '## Recommendations',
    '',
    uniqueRecommendations.length === 0
      ? '_No high-risk patterns detected._'
      : uniqueRecommendations.map((r) => `- ${r}`).join('\n'),
    '',
    '## Top risk files',
    '',
    ...domains
      .filter((d) => d.riskLevel === 'critical' || d.riskLevel === 'high')
      .flatMap((d) => d.files.slice(0, 3).map((f) => `- \`${f}\` (${d.domain})`)),
    '',
    '---',
    '> No claim may exceed evidence.',
  ].join('\n');

  await writeFile(
    join(REPORTS_DIR, 'SUPERCHARGED_ORCHESTRATION.md'),
    md,
    'utf-8',
  );

  console.log('✅ Supercharged orchestration complete.');
  console.log(`   Overall risk: ${riskTier} (score: ${overallRiskScore})`);
  console.log(`   Domains: ${domains.length}, Gates: ${selectedGates.length}`);
  console.log(`   Reports written to: ${REPORTS_DIR}`);
  console.log(`   - SUPERCHARGED_ORCHESTRATION.md`);
  console.log(`   - SUPERCHARGED_ORCHESTRATION.json`);
}

main().catch((err) => {
  console.error('❌ Supercharged orchestration failed:', err);
  process.exit(1);
});
