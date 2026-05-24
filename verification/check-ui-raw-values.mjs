#!/usr/bin/env node
/**
 * check:ui-raw-values — JSX/TSX 내 raw hex/rgb 색상 탐지 (components/app)
 */

import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { getProjectRoot } from "./lib/paths.mjs";

const ROOT = getProjectRoot();
const SCAN_DIRS = ["src/components", "src/app"];
const RAW_COLOR = /#[0-9a-fA-F]{3,8}\b|rgb\(|rgba\(/;

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
    else if (/\.(tsx|ts|jsx|js)$/.test(entry)) files.push(p);
  }
  return files;
}

const violations = [];

for (const dir of SCAN_DIRS) {
  for (const file of walkDir(dir)) {
    const lines = readFileSync(file, "utf-8").split("\n");
    lines.forEach((line, idx) => {
      if (RAW_COLOR.test(line) && !line.includes("var(--")) {
        violations.push({ file: relative(ROOT, file), line: idx + 1 });
      }
    });
  }
}

if (violations.length === 0) {
  console.log("✅ check:ui-raw-values — raw color 없음 (components/app)");
  process.exit(0);
}

console.error(`❌ check:ui-raw-values — ${violations.length}건`);
violations.slice(0, 10).forEach((v) => console.error(`  ${v.file}:${v.line}`));
process.exit(1);
