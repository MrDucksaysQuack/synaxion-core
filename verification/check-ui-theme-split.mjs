#!/usr/bin/env node
/**
 * check:ui-theme-split — dark: palette override 탐지
 */

import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { getProjectRoot } from "./lib/paths.mjs";

const ROOT = getProjectRoot();
const SCAN_DIRS = ["src/components", "src/app"];
const PALETTE =
  /dark:(?:bg|text|border|ring|from|to|via)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)/;

function walkDir(relDir, files = []) {
  const full = join(ROOT, relDir);
  if (!existsSync(full)) return files;
  if (!statSync(full).isDirectory()) {
    files.push(full);
    return files;
  }
  for (const entry of readdirSync(full)) {
    const p = join(full, entry);
    if (statSync(p).isDirectory()) walkDir(join(relDir, entry), files);
    else if (/\.(tsx|ts)$/.test(entry)) files.push(p);
  }
  return files;
}

const violations = [];

for (const dir of SCAN_DIRS) {
  for (const file of walkDir(dir)) {
    const lines = readFileSync(file, "utf-8").split("\n");
    lines.forEach((line, idx) => {
      if (PALETTE.test(line)) {
        violations.push({ file: relative(ROOT, file), line: idx + 1 });
      }
    });
  }
}

if (violations.length === 0) {
  console.log("✅ check:ui-theme-split — dark: palette override 없음");
  process.exit(0);
}

console.error(`❌ check:ui-theme-split — ${violations.length}건`);
violations.slice(0, 10).forEach((v) => console.error(`  ${v.file}:${v.line}`));
process.exit(1);
