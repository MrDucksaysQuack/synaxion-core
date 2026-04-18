#!/usr/bin/env tsx
// Why: 소스의 `checkDecision('id')`가 레지스트리에 없으면 타입·문서 우회로 고아·미등록 호출이 생김.
/**
 * G1 역방향 — 소스에 등장하는 `checkDecision('id')` 문자열이 decision-registry.json 에 등록돼 있는지 검사.
 * (DecisionId 타입이 우회되거나 스크립트·테스트에만 문자열이 있을 때 방어)
 *
 *   pnpm run check:decision-call-registry
 *   pnpm run check:decision-call-registry -- --warn-only   # exit 0, 미등록만 stderr
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..', '..', '..');

function getRegistryPath(): string {
  const arg = process.argv.find((a) => a.startsWith('--registry='));
  if (arg) return path.resolve(ROOT, arg.slice('--registry='.length).trim());
  const env = process.env.CONSTITUTION_REGISTRY_PATH;
  if (env) return path.resolve(ROOT, env);
  const itemwiki = path.join(ROOT, 'docs', 'itemwiki-constitution', 'decision-registry.json');
  if (fs.existsSync(itemwiki)) return itemwiki;
  return path.join(ROOT, 'docs', 'constitution', 'decision-registry.json');
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

const EXCLUDE_FILE_NAMES = new Set([
  'registry-generated.ts',
  'check-decision-call-registry.ts',
  'check-decision-usage.ts',
  'generate-from-registry.ts',
]);

/** checkDecision( 를 정의하는 구현 파일 — 호출 탐지에서 제외 */
const EXCLUDE_PATH_SUBSTR = ['packages/lib/core/decisions/index.ts'];

const CALL_RE = /checkDecision\s*\(\s*['"]([a-z0-9-]+)['"]\s*\)/g;

interface Decision {
  id: string;
}

function loadRegistryIds(registryPath: string): Set<string> {
  const raw = fs.readFileSync(registryPath, 'utf-8');
  const data = JSON.parse(raw) as { decisions: Decision[] };
  return new Set(data.decisions.map((d) => d.id));
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
      if (EXCLUDE_FILE_NAMES.has(e.name)) continue;
      if (EXCLUDE_PATH_SUBSTR.some((s) => full.includes(s))) continue;
      yield full;
    }
  }
}

function main(): void {
  const warnOnly = process.argv.includes('--warn-only');
  const registryPath = getRegistryPath();

  if (!fs.existsSync(registryPath)) {
    console.error('❌ decision-registry.json 없음');
    process.exit(1);
  }

  const registered = loadRegistryIds(registryPath);
  const scanRoots = [
    'packages',
    'app',
    'components',
    'scripts',
    'tests',
    'workers',
    'docs/constitution/scripts',
  ].map((d) => path.join(ROOT, d));

  const hits: { file: string; id: string }[] = [];

  for (const root of scanRoots) {
    if (!fs.existsSync(root)) continue;
    for (const file of walkTsTsx(root)) {
      const rel = path.relative(ROOT, file);
      const content = fs.readFileSync(file, 'utf-8');
      let m: RegExpExecArray | null;
      const re = new RegExp(CALL_RE.source, 'g');
      while ((m = re.exec(content)) !== null) {
        const id = m[1];
        if (id === undefined) continue;
        if (!registered.has(id)) {
          hits.push({ file: rel.split(path.sep).join('/'), id });
        }
      }
    }
  }

  if (hits.length === 0) {
    console.log('✅ checkDecision(…) 문자열이 모두 레지스트리에 등록됨.');
    process.exit(0);
  }

  console.error(`❌ 레지스트리에 없는 checkDecision id (${hits.length}건):\n`);
  for (const h of hits) {
    console.error(`   ${h.id}  ←  ${h.file}`);
  }
  console.error('\n조치: docs/itemwiki-constitution/decision-registry.json 에 id 추가 후 pnpm run generate:from-registry');

  process.exit(warnOnly ? 0 : 1);
}

main();
