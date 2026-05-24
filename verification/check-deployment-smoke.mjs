#!/usr/bin/env node
import { existsSync } from "fs";
import { join } from "path";
import { getProjectRoot } from "./lib/paths.mjs";

const ROOT = getProjectRoot();
const paths = [
  "src/app/api/health/route.ts",
  "src/app/api/health/route.js",
  "src/pages/api/health.ts",
];

const found = paths.find((p) => existsSync(join(ROOT, p)));
if (found) {
  console.log(`✅ check:deployment-smoke — ${found}`);
  process.exit(0);
}
console.error("❌ check:deployment-smoke — /api/health 없음");
process.exit(1);
