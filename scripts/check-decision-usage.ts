#!/usr/bin/env tsx
// Why: 레지스트리와 실제 코드 사용이 엇갈리면 죽은 규칙·미등록 사용이 누적됨.
/**
 * 결정 사용 추적 — 미사용·미등록 탐지
 * (Constitution 디렉터리 내 스크립트 — 프로젝트 루트에서 tsx docs/constitution/scripts/check-decision-usage.ts 로 실행)
 *
 * 레지스트리에 있지만 코드에서 한 번도 사용되지 않는 decision → 경고
 *
 * 사용:
 *   pnpm run check:decision-usage
 *   pnpm run check:decision-usage -- --fail-on-unused
 *   pnpm run check:decision-usage -- --json
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..', '..', '..');
const CONSTITUTION_DIR = path.join(ROOT, 'docs', 'constitution');

function getRegistryPath(): string {
  const arg = process.argv.find((a) => a.startsWith('--registry='));
  if (arg) return path.resolve(ROOT, arg.slice('--registry='.length).trim());
  const env = process.env.CONSTITUTION_REGISTRY_PATH;
  if (env) return path.resolve(ROOT, env);
  const itemwiki = path.join(ROOT, 'docs', 'itemwiki-constitution', 'decision-registry.json');
  if (fs.existsSync(itemwiki)) return itemwiki;
  return path.join(CONSTITUTION_DIR, 'decision-registry.json');
}
const EXCLUDE_DIRS = ['node_modules', '.next', 'dist', 'build', '.git', 'coverage', 'test-results', 'playwright-report'];
const EXCLUDE_FILES = [
  'registry-generated.ts',
  'packages/lib/core/decisions/index.ts',
  'decision-ids.ts',
  'decision-registry.json',
  'check-decision-usage.ts',
  'generate-from-registry.ts',
];

interface Decision {
  id: string;
  title?: string;
}

function loadRegistry(registryPath: string): Decision[] {
  const raw = fs.readFileSync(registryPath, 'utf-8');
  const data = JSON.parse(raw) as { decisions: Decision[] };
  return data.decisions;
}

function* walkTsTsx(dir: string): Generator<string> {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (EXCLUDE_DIRS.includes(e.name)) continue;
      yield* walkTsTsx(full);
    } else if (e.isFile() && /\.(ts|tsx)$/.test(e.name)) {
      if (!EXCLUDE_FILES.some((x) => e.name === x || full.includes(x))) yield full;
    }
  }
}

function main(): void {
  const failOnUnused = process.argv.includes('--fail-on-unused');
  const outputJson = process.argv.includes('--json');
  const REGISTRY_PATH = getRegistryPath();

  console.log('🔍 결정 사용 추적 (미사용·미등록)...\n');

  if (!fs.existsSync(REGISTRY_PATH)) {
    console.error('❌ decision-registry.json 없음');
    process.exit(1);
  }

  const decisions = loadRegistry(REGISTRY_PATH);
  const ids = new Set(decisions.map((d) => d.id));

  const usedIds = new Set<string>();
  const searchDirs = ['packages', 'app', 'components', 'scripts', 'tests'].map((d) => path.join(ROOT, d));

  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue;
    for (const file of walkTsTsx(dir)) {
      const content = fs.readFileSync(file, 'utf-8');
      for (const id of ids) {
        if (usedIds.has(id)) continue;
        if (content.includes(id)) usedIds.add(id);
      }
    }
  }

  const unused = [...ids].filter((id) => !usedIds.has(id)).sort();

  if (outputJson) {
    const out = {
      timestamp: new Date().toISOString(),
      total: ids.size,
      used: usedIds.size,
      unused: unused.length,
      unusedIds: unused,
      status: unused.length === 0 ? 'pass' : 'warn',
    };
    console.log(JSON.stringify(out, null, 2));
    process.exit(failOnUnused && unused.length > 0 ? 1 : 0);
  }

  if (unused.length === 0) {
    console.log('✅ 모든 결정 ID가 코드에서 참조됨.');
    process.exit(0);
  }

  console.log(`⚠️ 레지스트리에 있지만 코드에서 참조되지 않는 결정 (${unused.length}개):\n`);
  unused.forEach((id) => {
    const d = decisions.find((x) => x.id === id);
    console.log(`   - ${id}${d?.title ? ` (${d.title})` : ''}`);
  });
  console.log('\n참고: checkDecision(id) 또는 DECISION_IDS/DecisionId를 사용하면 참조로 집계됩니다.');
  console.log('      미사용 결정은 제거하거나, 문서/주석에서만 쓰는 경우 --fail-on-unused 없이 경고만 유지하세요.');

  if (failOnUnused) process.exit(1);
  process.exit(0);
}

main();
