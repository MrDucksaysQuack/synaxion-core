#!/usr/bin/env node
/**
 * check:ui-motion — transition duration이 토큰 외 임의 ms 값인지 탐지 (경고 수준)
 */

import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { getProjectRoot } from "./lib/paths.mjs";

const ROOT = getProjectRoot();
const SCAN_DIRS = ["src/components", "src/app"];
const ARBITRARY_DURATION = /duration-(?!240|120|80|0)\d{2,3}\b/;

function walkDir(relDir, files = []) {
  const full = join(ROOT, relDir);
  if (!existsSync(full)) return files;
  if (!statSync(full).isDirectory()) return files;
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
    readFileSync(file, "utf-8")
      .split("\n")
      .forEach((line, idx) => {
        if (ARBITRARY_DURATION.test(line)) {
          violations.push({ file: relative(ROOT, file), line: idx + 1 });
        }
      });
  }
}

if (violations.length === 0) {
  console.log("✅ check:ui-motion — 비표준 duration 없음");
  process.exit(0);
}

console.warn(`⚠️  check:ui-motion — ${violations.length}건 (warn)`);
violations.slice(0, 5).forEach((v) => console.warn(`  ${v.file}:${v.line}`));
process.exit(0);
