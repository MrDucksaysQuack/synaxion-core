#!/usr/bin/env tsx
/**
 * 시스템 명세(DSL) → 검증·생성 연동 (③ AI 플랫폼 엔진 연결)
 *
 * system-spec.json(DSL 인스턴스)을 읽어 스키마 검증 후, 프로파일 골격 생성까지 한 번에 실행.
 * AI가 DSL을 출력하면 이 스크립트로 "생성·검증 가능한 구조"까지 이어준다.
 *
 * 사용:
 *   tsx docs/constitution/scripts/generate-from-spec.ts -- --spec=./system-spec.json --target=./my-service
 *   tsx docs/constitution/scripts/generate-from-spec.ts -- --spec=./spec.json --emit-registry-fragment  # 명세의 decisionIds로 레지스트리 조각 출력
 *   tsx docs/constitution/scripts/generate-from-spec.ts -- --spec=./spec.json --emit-registry-fragment --output-fragment=./fragment.json
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const CONSTITUTION_DIR = path.resolve(__dirname, '..');
const ROOT = path.resolve(__dirname, '..', '..', '..');
const SCHEMA_PATH = path.join(CONSTITUTION_DIR, 'profiles', 'system-spec.schema.json');

function getRegistryPath(): string {
  const arg = process.argv.find((a) => a.startsWith('--registry='));
  if (arg) return path.resolve(ROOT, arg.slice('--registry='.length).trim());
  const env = process.env.CONSTITUTION_REGISTRY_PATH;
  if (env) return path.resolve(ROOT, env);
  const itemwiki = path.join(ROOT, 'docs', 'itemwiki-constitution', 'decision-registry.json');
  if (fs.existsSync(itemwiki)) return itemwiki;
  return path.join(CONSTITUTION_DIR, 'decision-registry.json');
}

interface Decision {
  id: string;
  title: string;
  singleSource: string;
  verificationScript?: string | null;
  verificationScripts?: string[];
  layers?: string[];
}

interface Registry {
  version: string;
  description?: string;
  decisions: Decision[];
}

interface SystemSpec {
  name: string;
  profile: string;
  constitutionVersion?: string;
  decisionIds?: string[];
  layers?: string[];
  paths?: { packages?: string; app?: string; constitution?: string };
}

function loadSpec(specPath: string): SystemSpec {
  const raw = fs.readFileSync(specPath, 'utf-8');
  const spec = JSON.parse(raw) as SystemSpec;
  if (!spec.name || !spec.profile) {
    throw new Error('system-spec에 name, profile 필수');
  }
  return spec;
}

function main(): void {
  const specArg = process.argv.find((a) => a.startsWith('--spec='));
  const targetArg = process.argv.find((a) => a.startsWith('--target='));
  const dryRun = process.argv.includes('--dry-run');
  const emitFragment = process.argv.includes('--emit-registry-fragment');
  const outputFragmentArg = process.argv.find((a) => a.startsWith('--output-fragment='));

  if (!specArg) {
    console.error('❌ --spec=<path> 필수. system-spec.json(DSL 인스턴스) 경로.');
    process.exit(1);
  }

  const specPath = path.resolve(process.cwd(), specArg.slice('--spec='.length).trim());
  const targetRoot = targetArg
    ? path.resolve(process.cwd(), targetArg.slice('--target='.length).trim())
    : path.join(process.cwd(), path.basename(specPath, path.extname(specPath)));

  if (!fs.existsSync(specPath)) {
    console.error('❌ 명세 파일 없음:', specPath);
    process.exit(1);
  }

  let spec: SystemSpec;
  try {
    spec = loadSpec(specPath);
  } catch (e) {
    console.error('❌ 명세 파싱 실패:', (e as Error).message);
    process.exit(1);
  }

  console.log('🔍 시스템 명세(DSL) 검증...');
  console.log(`   name: ${spec.name}, profile: ${spec.profile}`);

  const manifestPath = path.join(CONSTITUTION_DIR, 'profiles', 'templates', 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as { profiles: string[] };
    if (!manifest.profiles.includes(spec.profile)) {
      console.error(`❌ 알 수 없는 프로파일: ${spec.profile}. 사용 가능: ${manifest.profiles.join(', ')}`);
      process.exit(1);
    }
  }

  console.log('   ✅ 명세 검증 통과');

  if (emitFragment) {
    const registryPath = getRegistryPath();
    if (!fs.existsSync(registryPath)) {
      console.error('❌ 레지스트리 없음:', registryPath, '(--registry= 또는 CONSTITUTION_REGISTRY_PATH 지정)');
      process.exit(1);
    }
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8')) as Registry;
    const ids = spec.decisionIds?.length ? spec.decisionIds : registry.decisions.map((d) => d.id);
    const fragment = registry.decisions.filter((d) => ids.includes(d.id));
    const json = JSON.stringify(fragment, null, 2);
    if (outputFragmentArg) {
      const outPath = path.resolve(process.cwd(), outputFragmentArg.slice('--output-fragment='.length).trim());
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, json, 'utf-8');
      console.log(`   ✅ 레지스트리 조각 출력: ${outPath} (${fragment.length}개 결정)`);
    } else {
      console.log(`   ✅ 레지스트리 조각 (${fragment.length}개 결정):`);
      console.log(json);
    }
    process.exit(0);
  }

  if (dryRun) {
    console.log('   (--dry-run: scaffold 생략)');
    process.exit(0);
  }

  console.log('\n📁 프로파일 골격 생성...');
  const scriptPath = path.join(CONSTITUTION_DIR, 'scripts', 'scaffold-system.ts');
  const cmd = `tsx "${scriptPath}" -- --profile=${spec.profile} --target=${targetRoot} --name=${spec.name}`;
  execSync(cmd, { cwd: ROOT, stdio: 'inherit' });

  console.log('\n✅ DSL → 생성 완료. 다음: Constitution 이식 후 check:constitution-version, check:decision-registry');
  process.exit(0);
}

main();
