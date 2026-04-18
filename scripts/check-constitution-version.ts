#!/usr/bin/env tsx
/**
 * Constitution 버전 락 검사
 *
 * - docs/constitution/VERSION 이 단일 소스
 * - docs/constitution/README.md의 **버전**: x.y.z 와 일치 (있을 때만)
 * - (선택) 루트 README.md에 `**Constitution 락**: x.y.z`가 있으면 VERSION과 일치해야 함 (Itemwiki 권장)
 * - (선택) package.json constitutionVersion 과 일치 시 CI 검증 가능
 *
 * --project-root=<path> 로 다른 프로젝트 루트 지정 가능 (scaffold-system --run-check 에서 사용).
 */

import * as fs from 'fs';
import * as path from 'path';

function getRoot(): string {
  const arg = process.argv.find((a) => a.startsWith('--project-root='));
  if (arg) return path.resolve(process.cwd(), arg.slice('--project-root='.length).trim());
  return path.resolve(__dirname, '..', '..', '..');
}

function main(): void {
  const ROOT = getRoot();
  const CONSTITUTION_DIR = path.join(ROOT, 'docs', 'constitution');
  const VERSION_FILE = path.join(CONSTITUTION_DIR, 'VERSION');
  const README_PATH = path.join(CONSTITUTION_DIR, 'README.md');

  if (!fs.existsSync(VERSION_FILE)) {
    console.error('❌ docs/constitution/VERSION 파일 없음. 생성 후 버전을 기록하세요.');
    process.exit(1);
  }

  const locked = fs.readFileSync(VERSION_FILE, 'utf-8').trim();
  if (!locked) {
    console.error('❌ VERSION 파일이 비어 있음.');
    process.exit(1);
  }

  if (fs.existsSync(README_PATH)) {
    const readme = fs.readFileSync(README_PATH, 'utf-8');
    const m = readme.match(/\*\*버전\*\*:\s*(\S+)/);
    const readmeVersion = m?.[1]?.trim() ?? '';
    if (readmeVersion !== locked) {
      console.error(`❌ Constitution 버전 불일치:`);
      console.error(`   VERSION (락): ${locked}`);
      console.error(`   README.md:    ${readmeVersion || '(없음)'}`);
      console.error('   README.md의 **버전**: 값을 VERSION과 동일하게 맞추세요.');
      process.exit(1);
    }
  }

  let pkgVersion: string | null = null;
  const pkgPath = path.join(ROOT, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    pkgVersion = pkg.constitutionVersion ?? pkg.constitution?.version ?? null;
  }
  if (pkgVersion != null && pkgVersion !== locked) {
    console.error(`❌ Constitution 버전 불일치:`);
    console.error(`   VERSION (락): ${locked}`);
    console.error(`   package.json (constitutionVersion): ${pkgVersion}`);
    process.exit(1);
  }

  const rootReadmePath = path.join(ROOT, 'README.md');
  if (fs.existsSync(rootReadmePath)) {
    const rootReadme = fs.readFileSync(rootReadmePath, 'utf-8');
    const lockM = rootReadme.match(/\*\*Constitution 락\*\*:\s*(\d+\.\d+\.\d+)/);
    if (lockM) {
      const rootLock = lockM[1]?.trim() ?? '';
      if (rootLock !== locked) {
        console.error(`❌ Constitution 버전 불일치:`);
        console.error(`   VERSION (락): ${locked}`);
        console.error(`   루트 README.md (**Constitution 락**): ${rootLock}`);
        console.error('   루트 README의 **Constitution 락**: 값을 VERSION과 동일하게 맞추세요.');
        process.exit(1);
      }
    }
  }

  console.log(`✅ Constitution 버전 락: ${locked}`);
  process.exit(0);
}

main();
