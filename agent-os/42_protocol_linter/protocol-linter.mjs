#!/usr/bin/env node
/**
 * Agent OS Protocol Linter
 * Scans protocol markdown files for weak language, missing evidence principles,
 * and empty files.
 *
 * No claim may exceed evidence.
 */

import { readdir, readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';

const REPO_ROOT = process.cwd();
const AGENT_OS_DIR = join(REPO_ROOT, 'agent-os');
const REPORTS_DIR = join(REPO_ROOT, 'agent-os-reports');

const WEAK_LANGUAGE = [
  { pattern: /\bprobably\b/gi, term: 'probably' },
  { pattern: /\bshould work\b/gi, term: 'should work' },
  { pattern: /\bmaybe\b/gi, term: 'maybe' },
  { pattern: /\bappears to\b/gi, term: 'appears to' },
  { pattern: /\bbasic implementation\b/gi, term: 'basic implementation' },
  { pattern: /\bmostly\b/gi, term: 'mostly' },
  { pattern: /\bsomewhat\b/gi, term: 'somewhat' },
  { pattern: /\btypically\b/gi, term: 'typically' },
];

const EVIDENCE_PHRASE = 'No claim may exceed evidence';
const COMMAND_FILE_PATTERNS = [/COMMAND\.md$/i, /OVERVIEW\.md$/i, /BIBLE\.md$/i, /GATE\.md$/i];

async function walkDir(dir, files = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkDir(fullPath, files);
    } else if (extname(entry.name) === '.md') {
      files.push(fullPath);
    }
  }
  return files;
}

async function lintFile(file) {
  const relPath = file.replace(REPO_ROOT + '/', '');
  const name = basename(file);
  const issues = [];

  let content = '';
  try {
    const fileStat = await stat(file);
    if (fileStat.size === 0) {
      issues.push({
        severity: 'warning',
        rule: 'empty-file',
        message: 'Markdown file is empty',
        file: relPath,
        line: null,
      });
      return issues;
    }
    content = await readFile(file, 'utf-8');
  } catch (err) {
    issues.push({
      severity: 'error',
      rule: 'read-error',
      message: `Cannot read file: ${err.message}`,
      file: relPath,
      line: null,
    });
    return issues;
  }

  const lines = content.split('\n');

  // Check for weak language
  for (let i = 0; i < lines.length; i++) {
    for (const weak of WEAK_LANGUAGE) {
      if (weak.pattern.test(lines[i])) {
        issues.push({
          severity: 'warning',
          rule: 'weak-language',
          message: `Weak language detected: "${weak.term}"`,
          file: relPath,
          line: i + 1,
          context: lines[i].trim(),
        });
        weak.pattern.lastIndex = 0; // reset regex state
      }
    }
  }

  // Check for missing evidence phrase in command/overview files
  const isCommandFile = COMMAND_FILE_PATTERNS.some((p) => p.test(name));
  if (isCommandFile && !content.includes(EVIDENCE_PHRASE)) {
    issues.push({
      severity: 'warning',
      rule: 'missing-evidence-principle',
      message: `Command/overview file is missing phrase: "${EVIDENCE_PHRASE}"`,
      file: relPath,
      line: null,
    });
  }

  return issues;
}

async function main() {
  console.log('🔍 Agent OS Protocol Linter starting...');

  let mdFiles = [];
  try {
    mdFiles = await walkDir(AGENT_OS_DIR);
  } catch {
    // agent-os dir may not exist yet
    console.log('   Warning: agent-os/ directory not found, scanning whole repo...');
    const { readdir: rd } = await import('node:fs/promises');
    try {
      await rd(AGENT_OS_DIR);
    } catch {
      // ignore
    }
  }

  // Also lint README
  try {
    await stat(join(REPO_ROOT, 'README.md'));
    mdFiles.push(join(REPO_ROOT, 'README.md'));
  } catch { /* no readme */ }

  console.log(`   Markdown files found: ${mdFiles.length}`);

  const allIssues = [];
  for (const file of mdFiles) {
    const issues = await lintFile(file);
    allIssues.push(...issues);
  }

  const warnings = allIssues.filter((i) => i.severity === 'warning');
  const errors = allIssues.filter((i) => i.severity === 'error');

  console.log(`   Issues: ${errors.length} errors, ${warnings.length} warnings`);

  const report = {
    timestamp: new Date().toISOString(),
    filesLinted: mdFiles.length,
    totalIssues: allIssues.length,
    errors: errors.length,
    warnings: warnings.length,
    issues: allIssues,
    principle: 'No claim may exceed evidence.',
  };

  await mkdir(REPORTS_DIR, { recursive: true });

  await writeFile(
    join(REPORTS_DIR, 'PROTOCOL_LINT_REPORT.json'),
    JSON.stringify(report, null, 2),
    'utf-8',
  );

  const severityEmoji = { error: '❌', warning: '⚠️' };
  const md = [
    '# Protocol Lint Report',
    '',
    '> **No claim may exceed evidence.**',
    '',
    `**Generated:** ${report.timestamp}`,
    `**Files linted:** ${report.filesLinted}`,
    `**Errors:** ${report.errors}`,
    `**Warnings:** ${report.warnings}`,
    '',
    '## Issues',
    '',
    allIssues.length === 0
      ? '_No issues found._'
      : allIssues.map((i) => {
          const loc = i.line ? `:${i.line}` : '';
          const ctx = i.context ? `\n  > ${i.context}` : '';
          return `${severityEmoji[i.severity] ?? '•'} **[${i.rule}]** \`${i.file}${loc}\` — ${i.message}${ctx}`;
        }).join('\n\n'),
    '',
    '---',
    '> No claim may exceed evidence.',
  ].join('\n');

  await writeFile(
    join(REPORTS_DIR, 'PROTOCOL_LINT_REPORT.md'),
    md,
    'utf-8',
  );

  console.log('✅ Protocol lint complete.');
  console.log(`   Reports written to: ${REPORTS_DIR}`);
  console.log(`   - PROTOCOL_LINT_REPORT.md`);
  console.log(`   - PROTOCOL_LINT_REPORT.json`);

  // Exit nonzero only for severe errors
  if (errors.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('❌ Protocol linter failed:', err);
  process.exit(1);
});
