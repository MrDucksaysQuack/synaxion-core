#!/usr/bin/env node
/**
 * scaffold-profile-smoke — profiles/templates/<id>.json 골격 생성 smoke (CI)
 * Usage: node verification/scaffold-profile-smoke.mjs --profile=express-api
 */

import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from "fs";
import { tmpdir } from "os";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { getCoreRoot } from "./lib/paths.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CORE = getCoreRoot();

const profileArg = process.argv.find((a) => a.startsWith("--profile="));
if (!profileArg) {
  console.error("❌ --profile=<id> 필수 (예: express-api)");
  process.exit(1);
}
const profileId = profileArg.slice("--profile=".length).trim();
const templatePath = join(CORE, "profiles/templates", `${profileId}.json`);
if (!existsSync(templatePath)) {
  console.error(`❌ 템플릿 없음: ${templatePath}`);
  process.exit(1);
}

const version = readFileSync(join(CORE, "VERSION"), "utf-8").trim();
const template = JSON.parse(readFileSync(templatePath, "utf-8"));
const projectName = "scaffold-smoke-test";
const replace = (s) =>
  s.replace(/\{\{name\}\}/g, projectName).replace(/\{\{constitutionVersion\}\}/g, version);

const tmpRoot = mkdtempSync(join(tmpdir(), `synaxion-scaffold-${profileId}-`));

try {
  console.log(`📁 scaffold smoke: ${profileId} → ${tmpRoot}`);

  for (const dir of template.dirs ?? []) {
    mkdirSync(join(tmpRoot, dir), { recursive: true });
  }
  for (const { path: filePath, content } of template.files ?? []) {
    const full = join(tmpRoot, filePath);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, replace(content), "utf-8");
  }

  const pkgPath = join(tmpRoot, "package.json");
  if (!existsSync(pkgPath)) {
    console.error("❌ package.json 미생성");
    process.exit(1);
  }
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  if (pkg.constitutionVersion !== version) {
    console.error(`❌ constitutionVersion 불일치: ${pkg.constitutionVersion} !== ${version}`);
    process.exit(1);
  }
  console.log(`  ✓ package.json constitutionVersion=${version}`);

  if (profileId === "express-api") {
    const indexPath = join(tmpRoot, "src/index.js");
    const index = readFileSync(indexPath, "utf-8");
    if (!index.includes("/health")) {
      console.error("❌ src/index.js에 /health 없음");
      process.exit(1);
    }
    console.log("  ✓ src/index.js /health");
  }

  console.log(`✅ scaffold-profile-smoke — ${profileId}`);
} finally {
  rmSync(tmpRoot, { recursive: true, force: true });
}
