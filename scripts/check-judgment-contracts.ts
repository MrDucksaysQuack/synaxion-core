#!/usr/bin/env tsx
/**
 * G1·1.3 — evaluateJudgment 직접 import/호출이 허용 목록 밖에 있으면 실패
 *
 *   pnpm run check:judgment-contracts
 *   `check:constitution-pr`에 포함 (PR 머지 게이트)
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..', '..', '..');

/** posix relative from repo root */
function toPosixRel(file: string): string {
  return path.relative(ROOT, file).split(path.sep).join('/');
}

const EXCLUDE_DIRS = new Set([
  'node_modules',
  '.next',
  'dist',
  'build',
  '.git',
  'coverage',
  'test-results',
  'playwright-report',
]);

const ALLOW_EVALUATE_JUDGMENT = new Set([
  'packages/lib/core/judgment/evaluate.ts',
  'packages/lib/core/judgment/with-judgment.ts',
  'packages/lib/core/judgment/replay-judgment.ts',
  'docs/constitution/scripts/judgment-eval-demo.ts',
  'docs/constitution/scripts/judgment-itemwiki-demo.ts',
  'docs/constitution/scripts/judgment-rule-productivity-experiment.ts',
  'docs/constitution/scripts/judgment-federation-poc-demo.ts',
]);

const SCAN_ROOTS = ['app', 'components', 'packages', 'workers', 'tests', 'scripts'].map((d) => path.join(ROOT, d));

function hasEvaluateJudgmentImport(content: string): boolean {
  const re = /import\s*\{([\s\S]*?)\}\s*from\s*['"]([^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    const names = m[1] ?? '';
    if (/\bevaluateJudgment\b/.test(names)) return true;
  }
  return /import\s+evaluateJudgment\s+from/.test(content);
}

function hasEvaluateJudgmentCall(content: string): boolean {
  return /\bevaluateJudgment\s*\(/.test(content);
}

function* walkTsTsx(dir: string): Generator<string> {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (EXCLUDE_DIRS.has(e.name)) continue;
      yield* walkTsTsx(full);
    } else if (e.isFile() && /\.(ts|tsx)$/.test(e.name)) {
      yield full;
    }
  }
}

function main(): void {
  console.log('🔍 check:judgment-contracts — evaluateJudgment 허용 목록 검사\n');

  const violations: string[] = [];

  for (const root of SCAN_ROOTS) {
    for (const file of walkTsTsx(root)) {
      const rel = toPosixRel(file);
      const content = fs.readFileSync(file, 'utf-8');
      if (!content.includes('evaluateJudgment')) continue;
      if (ALLOW_EVALUATE_JUDGMENT.has(rel)) continue;
      if (!hasEvaluateJudgmentImport(content) && !hasEvaluateJudgmentCall(content)) continue;
      violations.push(rel);
    }
  }

  if (violations.length === 0) {
    console.log('✅ 허용 목록 외 evaluateJudgment 사용 없음.');
    process.exit(0);
  }

  console.error('❌ 다음 파일에서 evaluateJudgment import/호출이 허용되지 않습니다:\n');
  violations.sort().forEach((v) => console.error(`   - ${v}`));
  console.error('\n정책: docs/constitution/12-judgment-constitution/JUDGMENT_ENTRYPOINT_POLICY.md');
  console.error('인벤토리: docs/analysis/synaxion-judgment-path-inventory.md');
  process.exit(1);
}

main();
