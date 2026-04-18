#!/usr/bin/env tsx
/**
 * 프로파일 기반 Constitution 골격 생성 (이식용)
 *
 * Constitution(경전) 디렉터리를 대상 경로에 복사한다. Constitution 본문에는 프로젝트 특화 디렉터리가 없으므로, 복사 결과는 항상 경전만 포함.
 *
 * 사용:
 *   tsx docs/constitution/scripts/scaffold-from-profile.ts -- --target=../other-project
 *   tsx docs/constitution/scripts/scaffold-from-profile.ts -- --target=./my-app --core-only
 *
 * --target=<path>  프로젝트 루트로 볼 디렉터리 (기본: .)
 * --core-only      (미사용) 예전 호환용. Constitution에 프로젝트 특화 디렉터리가 있으면 제외
 */

import * as fs from 'fs';
import * as path from 'path';

const CONSTITUTION_DIR = path.resolve(__dirname, '..');
const ROOT = path.resolve(__dirname, '..', '..', '..');

function main(): void {
  const targetArg = process.argv.find((a) => a.startsWith('--target='));
  const coreOnly = process.argv.includes('--core-only');
  const targetRoot = targetArg
    ? path.resolve(process.cwd(), targetArg.slice('--target='.length).trim())
    : process.cwd();

  const dest = path.join(targetRoot, 'docs', 'constitution');

  if (fs.existsSync(dest)) {
    console.error(`❌ 대상이 이미 존재합니다: ${dest}`);
    process.exit(1);
  }

  console.log(`📁 Constitution 골격 생성: ${path.relative(ROOT, dest)}`);
  if (coreOnly) console.log('   (코어만 복사)');

  copyRecursive(CONSTITUTION_DIR, dest, coreOnly);

  console.log('✅ 완료. 다음 단계:');
  console.log(`   cd ${targetRoot}`);
  console.log('   package.json에 스크립트 등록 후 tsx docs/constitution/scripts/check-constitution-version.ts 등 실행');
  process.exit(0);
}

function copyRecursive(src: string, dest: string, coreOnly: boolean): void {
  const name = path.basename(src);
  if (coreOnly && name === 'itemwiki-specific') return;

  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry), coreOnly);
    }
    return;
  }

  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(src, dest);
}

main();
