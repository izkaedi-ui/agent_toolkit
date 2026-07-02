#!/usr/bin/env node
/**
 * Agent OS Meta-Orchestrator
 * Walks the repository, detects domains, selects gates, detects claims,
 * and produces orchestration decision records.
 *
 * No claim may exceed evidence.
 */

import { readdir, readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import { existsSync } from 'node:fs';

const REPO_ROOT = process.cwd();
const REPORTS_DIR = join(REPO_ROOT, 'agent-os-reports');
const IGNORE_DIRS = new Set(['.git', 'node_modules', 'dist', 'build', '.next', 'coverage']);

// Domain detection patterns
const DOMAIN_PATTERNS = [
  {
    domain: 'typescript',
    patterns: [/\.tsx?$/, /tsconfig\.json/, /typescript/i],
    gate: 'Frontend Rendering Mastery',
  },
  {
    domain: 'react',
    patterns: [/\.tsx$/, /react/i, /jsx/i, /useState|useEffect|useRef/],
    gate: 'Frontend Rendering Mastery',
  },
  {
    domain: 'threejs',
    patterns: [/three\.js|three\/src|from ['"]three['"]/i, /THREE\./],
    gate: '3D Browser Bible',
  },
  {
    domain: 'webgl',
    patterns: [/webgl/i, /gl\.draw|gl\.bind|getContext\(['"]webgl/i],
    gate: '3D Browser Bible',
  },
  {
    domain: 'webgpu',
    patterns: [/webgpu/i, /navigator\.gpu/i, /GPUDevice/i],
    gate: '3D Browser Bible (WebGPU)',
  },
  {
    domain: 'svg-animation',
    patterns: [/\.svg$/, /<animate|<animateTransform|<animateMotion/i],
    gate: 'MCP Animation Toolkit (SVG)',
  },
  {
    domain: 'css-animation',
    patterns: [/\.css$/, /@keyframes|animation:|transition:/i],
    gate: 'Elite Animation Systems',
  },
  {
    domain: 'gsap',
    patterns: [/gsap/i, /TweenLite|TweenMax|TimelineLite/i],
    gate: 'Elite Animation Systems',
  },
  {
    domain: 'framer-motion',
    patterns: [/framer-motion/i, /motion\./i],
    gate: 'Elite Animation Systems',
  },
  {
    domain: 'design-system',
    patterns: [/design.token|theme\.ts|tokens\.ts/i, /styled-components|emotion/i],
    gate: 'Design Systems',
  },
];

// Claim detection patterns
const CLAIM_PATTERNS = [
  { pattern: /60\s*fps/i, claim: '60fps performance' },
  { pattern: /2\s*million\s*tri|2M\s*tri/i, claim: '2M triangle support' },
  { pattern: /production.ready/i, claim: 'production ready' },
  { pattern: /optimized/i, claim: 'optimized' },
  { pattern: /smooth\s+animation/i, claim: 'smooth animation' },
  { pattern: /accessible/i, claim: 'accessible' },
  { pattern: /no\s+memory\s+leak/i, claim: 'no memory leaks' },
];

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

async function detectDomains(files) {
  const detected = new Map();

  for (const file of files) {
    const relPath = file.replace(REPO_ROOT + '/', '');
    const ext = extname(file);
    const name = basename(file);

    // Check filename patterns first
    for (const domainDef of DOMAIN_PATTERNS) {
      for (const pattern of domainDef.patterns) {
        if (pattern.test(name) || pattern.test(relPath)) {
          if (!detected.has(domainDef.domain)) {
            detected.set(domainDef.domain, {
              ...domainDef,
              files: [],
              contentMatches: [],
            });
          }
          detected.get(domainDef.domain).files.push(relPath);
          break;
        }
      }
    }

    // Check file content for text files
    const textExts = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.css', '.html', '.svg', '.md', '.json']);
    if (textExts.has(ext)) {
      let content = '';
      try {
        const fileStat = await stat(file);
        if (fileStat.size < 500_000) {
          content = await readFile(file, 'utf-8');
        }
      } catch {
        continue;
      }

      for (const domainDef of DOMAIN_PATTERNS) {
        for (const pattern of domainDef.patterns) {
          if (pattern.test(content)) {
            if (!detected.has(domainDef.domain)) {
              detected.set(domainDef.domain, {
                ...domainDef,
                files: [],
                contentMatches: [],
              });
            }
            const entry = detected.get(domainDef.domain);
            if (!entry.contentMatches.includes(relPath)) {
              entry.contentMatches.push(relPath);
            }
            break;
          }
        }
      }
    }
  }

  return detected;
}

async function detectClaims(files) {
  const claims = [];

  for (const file of files) {
    const ext = extname(file);
    const textExts = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.md', '.html']);
    if (!textExts.has(ext)) continue;

    let content = '';
    try {
      const fileStat = await stat(file);
      if (fileStat.size > 500_000) continue;
      content = await readFile(file, 'utf-8');
    } catch {
      continue;
    }

    const relPath = file.replace(REPO_ROOT + '/', '');
    for (const claimDef of CLAIM_PATTERNS) {
      if (claimDef.pattern.test(content)) {
        claims.push({
          claim: claimDef.claim,
          file: relPath,
          status: 'UNVERIFIED',
        });
      }
    }
  }

  return claims;
}

async function main() {
  console.log('🔍 Agent OS Meta-Orchestrator starting...');
  console.log(`   Repository root: ${REPO_ROOT}`);

  const files = await walkDir(REPO_ROOT);
  console.log(`   Files found: ${files.length}`);

  const domains = await detectDomains(files);
  console.log(`   Domains detected: ${domains.size}`);

  const claims = await detectClaims(files);
  console.log(`   Claims detected: ${claims.length}`);

  const selectedGates = [...new Set([...domains.values()].map((d) => d.gate))];

  const record = {
    timestamp: new Date().toISOString(),
    repositoryRoot: REPO_ROOT,
    filesScanned: files.length,
    domainsDetected: Object.fromEntries(
      [...domains.entries()].map(([k, v]) => [k, {
        gate: v.gate,
        fileMatches: v.files.length,
        contentMatches: v.contentMatches.length,
      }])
    ),
    selectedGates,
    claimsDetected: claims,
    principle: 'No claim may exceed evidence.',
  };

  await mkdir(REPORTS_DIR, { recursive: true });

  // Write JSON
  await writeFile(
    join(REPORTS_DIR, 'ORCHESTRATION_DECISION_RECORD.json'),
    JSON.stringify(record, null, 2),
    'utf-8',
  );

  // Write Markdown
  const md = [
    '# Orchestration Decision Record',
    '',
    `> **No claim may exceed evidence.**`,
    '',
    `**Generated:** ${record.timestamp}`,
    `**Files scanned:** ${record.filesScanned}`,
    '',
    '## Domains detected',
    '',
    '| Domain | Gate | File matches | Content matches |',
    '|---|---|---|---|',
    ...[...domains.entries()].map(([k, v]) =>
      `| ${k} | ${v.gate} | ${v.files.length} | ${v.contentMatches.length} |`
    ),
    '',
    '## Selected gates',
    '',
    ...selectedGates.map((g) => `- ${g}`),
    '',
    '## Claims detected',
    '',
    claims.length === 0
      ? '_No unverified claims detected._'
      : [
          '| Claim | File | Status |',
          '|---|---|---|',
          ...claims.map((c) => `| ${c.claim} | ${c.file} | ${c.status} |`),
        ].join('\n'),
    '',
    '## Recommended next steps',
    '',
    ...selectedGates.map((g) => `- Run "${g}" gate for all detected files.`),
    ...( claims.length > 0 ? ['- Collect evidence for all unverified claims.'] : []),
    '',
    '---',
    '> No claim may exceed evidence.',
  ].join('\n');

  await writeFile(
    join(REPORTS_DIR, 'ORCHESTRATION_DECISION_RECORD.md'),
    md,
    'utf-8',
  );

  console.log('✅ Orchestration complete.');
  console.log(`   Reports written to: ${REPORTS_DIR}`);
  console.log(`   - ORCHESTRATION_DECISION_RECORD.md`);
  console.log(`   - ORCHESTRATION_DECISION_RECORD.json`);
}

main().catch((err) => {
  console.error('❌ Orchestration failed:', err);
  process.exit(1);
});
