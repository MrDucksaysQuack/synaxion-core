#!/usr/bin/env node
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { getProjectRoot } from "./lib/paths.mjs";
import { isExpressApiProfile } from "./lib/profile.mjs";

const ROOT = getProjectRoot();

const nextPaths = [
  "src/app/api/health/route.ts",
  "src/app/api/health/route.js",
  "src/pages/api/health.ts",
];

function findExpressHealth() {
  const candidates = ["src/index.js", "src/index.mjs", "src/server.js", "src/routes/health.js"];
  for (const rel of candidates) {
    const full = join(ROOT, rel);
    if (!existsSync(full)) continue;
    const content = readFileSync(full, "utf-8");
    if (/\/health|'\/health'|"\/health"/.test(content)) return rel;
  }
  return null;
}

if (isExpressApiProfile()) {
  const found = findExpressHealth();
  if (found) {
    console.log(`✅ check:deployment-smoke — ${found} (/health)`);
    process.exit(0);
  }
  console.error("❌ check:deployment-smoke — Express /health 라우트 없음");
  process.exit(1);
}

const found = nextPaths.find((p) => existsSync(join(ROOT, p)));
if (found) {
  console.log(`✅ check:deployment-smoke — ${found}`);
  process.exit(0);
}
console.error("❌ check:deployment-smoke — /api/health 없음");
process.exit(1);
