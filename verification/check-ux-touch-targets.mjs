#!/usr/bin/env node
/**
 * check:ux-touch-targets — UX_CONSTITUTION UX-07
 * Interactive elements with suspiciously small Tailwind size classes (warning only, exit 0).
 */

import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { getProjectRoot } from "./lib/paths.mjs";

const ROOT = getProjectRoot();
const SCAN_DIR = join(ROOT, "src/components");

const SMALL_SIZE = /\b(?:min-h|min-w|h|w)-(?:[1-9]|1[0-9]|2[0-9]|3[0-9])\b/;
const INTERACTIVE = /<(?:button|a\b|input|select|textarea)|role=["'](?:button|link)["']/;

function walkDir(dir, files = []) {
  if (!existsSync(dir)) return files;
  if (!statSync(dir).isDirectory()) {
    if (/\.tsx$/.test(dir)) files.push(dir);
    return files;
  }
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkDir(full, files);
    else if (/\.tsx$/.test(entry)) files.push(full);
  }
  return files;
}

if (!existsSync(SCAN_DIR)) {
  console.log(`⏭️  check:ux-touch-targets — ${relative(ROOT, SCAN_DIR)} 없음, skip`);
  process.exit(0);
}

const warnings = [];

for (const file of walkDir(SCAN_DIR)) {
  const lines = readFileSync(file, "utf-8").split("\n");
  lines.forEach((line, idx) => {
    if (!INTERACTIVE.test(line)) return;
    if (!SMALL_SIZE.test(line)) return;
    if (line.includes("sr-only") || line.includes("hidden")) return;
    warnings.push({
      file: relative(ROOT, file),
      line: idx + 1,
      text: line.trim().slice(0, 120),
    });
  });
}

if (warnings.length === 0) {
  console.log("✅ check:ux-touch-targets — 의심 패턴 없음");
} else {
  console.warn(`⚠️  check:ux-touch-targets — ${warnings.length}건 (경고, exit 0)\n`);
  warnings.slice(0, 15).forEach((w) => console.warn(`  ${w.file}:${w.line}`));
  if (warnings.length > 15) console.warn(`  ... +${warnings.length - 15} more`);
}

process.exit(0);
