#!/usr/bin/env node
/**
 * check:ui-scripts-registry — UI_DESIGN_CONSTITUTION에 정의된 check:ui-* reference 구현 존재
 */

import { existsSync } from "fs";
import { join } from "path";
import { getCoreRoot } from "./lib/paths.mjs";

const CORE = getCoreRoot();
const VERIFICATION = join(CORE, "verification");

/** UI_DESIGN_CONSTITUTION § 검증 스크립트 이름 → 파일 */
const UI_CHECKS = [
  { name: "check:ui-raw-values", file: "check-ui-raw-values.mjs" },
  { name: "check:ui-motion", file: "check-ui-motion.mjs" },
  { name: "check:ui-theme-split", file: "check-ui-theme-split.mjs" },
  { name: "check:ux-touch-targets", file: "check-ux-touch-targets.mjs" },
];

const missing = UI_CHECKS.filter(({ file }) => !existsSync(join(VERIFICATION, file)));

UI_CHECKS.filter(({ file }) => existsSync(join(VERIFICATION, file))).forEach(({ name, file }) => {
  console.log(`  ✓ ${name} → verification/${file}`);
});

if (missing.length === 0) {
  console.log("✅ check:ui-scripts-registry — UI reference check 스크립트 등록됨");
  process.exit(0);
}

console.error(`\n❌ check:ui-scripts-registry — ${missing.length}개 누락\n`);
missing.forEach(({ name, file }) => console.error(`  ✗ ${name} (${file})`));
process.exit(1);
