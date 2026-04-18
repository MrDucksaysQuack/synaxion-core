#!/usr/bin/env tsx
/**
 * 프로파일 기반 시스템 골격 생성 (② 여러 시스템 생성용 OS)
 *
 * 프로파일(nextjs-monorepo, express-api, cli 등)에 따라 새 프로젝트 뼈대를 생성한다.
 * 템플릿: docs/constitution/profiles/templates/<profile>.json
 *
 * 사용:
 *   tsx docs/constitution/scripts/scaffold-system.ts -- --profile=express-api --target=./my-api --name=my-api
 *   tsx docs/constitution/scripts/scaffold-system.ts -- --profile=cli --target=./my-cli --run-check
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const CONSTITUTION_DIR = path.resolve(__dirname, '..');
const ROOT = path.resolve(__dirname, '..', '..', '..');
const TEMPLATES_DIR = path.join(CONSTITUTION_DIR, 'profiles', 'templates');

interface Template {
  id: string;
  description?: string;
  dirs: string[];
  files: { path: string; content: string }[];
}

function loadTemplate(profileId: string): Template {
  const p = path.join(TEMPLATES_DIR, `${profileId}.json`);
  if (!fs.existsSync(p)) {
    throw new Error(`프로파일 템플릿 없음: ${profileId}. 사용 가능: nextjs-monorepo, express-api, cli`);
  }
  return JSON.parse(fs.readFileSync(p, 'utf-8')) as Template;
}

function getConstitutionVersion(): string {
  const v = path.join(CONSTITUTION_DIR, 'VERSION');
  if (fs.existsSync(v)) return fs.readFileSync(v, 'utf-8').trim();
  return '2.2.0';
}

function main(): void {
  const profileArg = process.argv.find((a) => a.startsWith('--profile='));
  const targetArg = process.argv.find((a) => a.startsWith('--target='));
  const nameArg = process.argv.find((a) => a.startsWith('--name='));
  const runCheck = process.argv.includes('--run-check');

  if (!profileArg) {
    console.error('❌ --profile=<id> 필수. 예: --profile=nextjs-monorepo, --profile=express-api');
    process.exit(1);
  }

  const profileId = profileArg.slice('--profile='.length).trim();
  const targetRoot = targetArg
    ? path.resolve(process.cwd(), targetArg.slice('--target='.length).trim())
    : path.join(process.cwd(), profileId);
  const projectName = nameArg
    ? nameArg.slice('--name='.length).trim()
    : path.basename(path.resolve(targetRoot));

  if (fs.existsSync(targetRoot) && fs.readdirSync(targetRoot).length > 0) {
    console.error(`❌ 대상이 비어 있지 않습니다: ${targetRoot}`);
    process.exit(1);
  }

  const template = loadTemplate(profileId);
  const constitutionVersion = getConstitutionVersion();

  const replace = (s: string): string =>
    s.replace(/\{\{name\}\}/g, projectName).replace(/\{\{constitutionVersion\}\}/g, constitutionVersion);

  console.log(`📁 시스템 골격 생성: ${path.relative(ROOT, targetRoot)} (프로파일: ${profileId})`);

  for (const dir of template.dirs) {
    const full = path.join(targetRoot, dir);
    if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
  }

  for (const { path: filePath, content } of template.files) {
    const full = path.join(targetRoot, filePath);
    const dir = path.dirname(full);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(full, replace(content), 'utf-8');
  }

  if (runCheck) {
    const constitutionVersion = getConstitutionVersion();
    const versionDir = path.join(targetRoot, 'docs', 'constitution');
    if (!fs.existsSync(versionDir)) fs.mkdirSync(versionDir, { recursive: true });
    fs.writeFileSync(path.join(versionDir, 'VERSION'), constitutionVersion + '\n', 'utf-8');
    console.log('\n🔍 생성 직후 검증 (--run-check)...');
    try {
      execSync(
        `tsx docs/constitution/scripts/check-constitution-version.ts -- --project-root=${path.resolve(targetRoot)}`,
        { cwd: ROOT, stdio: 'inherit' }
      );
      console.log('   ✅ check:constitution-version 통과');
    } catch {
      process.exit(1);
    }
  }

  console.log('\n✅ 완료. 다음 단계:');
  console.log(`   cd ${targetRoot}`);
  console.log('   Constitution 이식: 프로젝트 루트에서 pnpm run scaffold:constitution -- --target=. (또는 docs/constitution 복사)');
  if (!runCheck) console.log('   검증: pnpm run check:constitution-version');
  process.exit(0);
}

main();
