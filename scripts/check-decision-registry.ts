#!/usr/bin/env tsx
// Why: decision 레지스트리 스키마와 등록된 검증 스크립트 일관성 — 헌법 게이트의 단일 진입점.
/**
 * Decision Registry 강제화 검사
 * (Constitution 디렉터리 내 스크립트 — 프로젝트 루트에서 tsx docs/constitution/scripts/check-decision-registry.ts 로 실행)
 *
 * 1. decision-registry.json 스키마 검증
 * 2. 레지스트리에 등록된 모든 verificationScript 실행 → 하나라도 실패 시 실패
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const ROOT = path.resolve(__dirname, '..', '..', '..');
const CONSTITUTION_DIR = path.join(ROOT, 'docs', 'constitution');
const SCHEMA_PATH = path.join(CONSTITUTION_DIR, 'decision-registry.schema.json');

function getRegistryPath(): string {
  const arg = process.argv.find((a) => a.startsWith('--registry='));
  if (arg) return path.resolve(ROOT, arg.slice('--registry='.length).trim());
  const env = process.env.CONSTITUTION_REGISTRY_PATH;
  if (env) return path.resolve(ROOT, env);
  const inConstitution = path.join(CONSTITUTION_DIR, 'decision-registry.json');
  const itemwiki = path.join(ROOT, 'docs', 'itemwiki-constitution', 'decision-registry.json');
  if (fs.existsSync(itemwiki)) return itemwiki;
  return inConstitution;
}

interface Decision {
  id: string;
  title: string;
  singleSource: string;
  verificationScript?: string | null;
  layers?: string[];
}

interface Registry {
  version: string;
  description?: string;
  decisions: Decision[];
}

function loadJson<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

function validateSchema(registry: Registry): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!registry.version) errors.push('registry.version 필수');
  if (!Array.isArray(registry.decisions)) errors.push('registry.decisions 배열 필수');
  (registry.decisions || []).forEach((d, i) => {
    if (!d.id) errors.push(`decisions[${i}].id 필수`);
    if (!d.title) errors.push(`decisions[${i}].title 필수`);
    if (!d.singleSource) errors.push(`decisions[${i}].singleSource 필수`);
  });
  return { ok: errors.length === 0, errors };
}

function main(): void {
  const skipScripts = process.argv.includes('--skip-scripts');
  const outputJson = process.argv.includes('--json');
  const REGISTRY_PATH = getRegistryPath();

  console.log('🔍 Decision Registry 강제화 검사...\n');

  if (!fs.existsSync(REGISTRY_PATH)) {
    console.error('❌ decision-registry.json 없음:', REGISTRY_PATH);
    process.exit(1);
  }

  let registry: Registry;
  try {
    registry = loadJson<Registry>(REGISTRY_PATH);
  } catch (e) {
    console.error('❌ decision-registry.json 파싱 실패:', (e as Error).message);
    process.exit(1);
  }

  const { ok, errors } = validateSchema(registry);
  if (!ok) {
    console.error('❌ 스키마 검증 실패:');
    errors.forEach((e) => console.error('  -', e));
    process.exit(1);
  }
  console.log('  ✅ 스키마 검증 통과');

  const scripts = new Set<string>();
  registry.decisions.forEach((d) => {
    if (d.verificationScript && typeof d.verificationScript === 'string') scripts.add(d.verificationScript);
    const list = (d as Decision & { verificationScripts?: string[] }).verificationScripts;
    if (Array.isArray(list)) list.forEach((s) => s && scripts.add(s));
  });

  if (skipScripts) {
    console.log('  ⏭ verificationScript 실행 생략 (--skip-scripts)\n');
    if (outputJson) {
      console.log(JSON.stringify({ status: 'pass', schema: 'ok', scriptsSkipped: true }, null, 2));
    }
    process.exit(0);
  }

  const scriptList = [...scripts].sort();
  if (scriptList.length === 0) {
    console.log('  ⏭ 등록된 verificationScript 없음\n');
    if (outputJson) {
      console.log(JSON.stringify({ status: 'pass', schema: 'ok', scriptsRun: 0 }, null, 2));
    }
    process.exit(0);
  }

  let failed: string | null = null;
  for (const script of scriptList) {
    const pnpmScript = script.replace(/^pnpm run\s+/, '');
    try {
      execSync(`pnpm run ${pnpmScript}`, { cwd: ROOT, stdio: 'inherit' });
      console.log(`  ✅ ${pnpmScript}`);
    } catch {
      failed = pnpmScript;
      break;
    }
  }

  if (failed) {
    console.error(`\n❌ 레지스트리 지정 검증 실패: ${failed}`);
    if (outputJson) {
      console.log(JSON.stringify({ status: 'fail', failedScript: failed }, null, 2));
    }
    process.exit(1);
  }

  console.log('\n✅ Decision Registry 강제화 통과 (선언된 검증 모두 실행됨)');
  if (outputJson) {
    console.log(JSON.stringify({ status: 'pass', schema: 'ok', scriptsRun: scriptList }, null, 2));
  }
  process.exit(0);
}

main();
