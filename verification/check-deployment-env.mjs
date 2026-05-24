#!/usr/bin/env node
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { getProjectRoot } from "./lib/paths.mjs";

const ROOT = getProjectRoot();
const issues = [];
const passed = [];

const envExample = join(ROOT, ".env.example");
if (!existsSync(envExample)) {
  issues.push(".env.example 없음");
} else {
  const n = (readFileSync(envExample, "utf-8").match(/^[A-Z_]+=.*/gm) || []).length;
  if (n === 0) issues.push(".env.example 변수 없음");
  else passed.push(`.env.example — ${n}개`);
}

const validationPaths = [
  "src/lib/env.ts",
  "src/lib/env.mjs",
  "src/config/env.ts",
  "src/lib/env.js",
];
const hasVal = validationPaths.some((p) => existsSync(join(ROOT, p)));
if (hasVal) passed.push("env validation 파일 존재");
else issues.push("src/lib/env.ts 등 env validation 없음");

passed.forEach((p) => console.log(`  ✓ ${p}`));
if (issues.length === 0) {
  console.log("✅ check:deployment-env");
  process.exit(0);
}
issues.forEach((i) => console.error(`  ✗ ${i}`));
process.exit(1);
