#!/usr/bin/env node
import { spawnSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const checks = ["check-ops-sentry.mjs", "check-ops-runbooks.mjs"];

let failed = 0;
for (const script of checks) {
  console.log(`\n▶ ${script}`);
  const r = spawnSync(process.execPath, [join(__dirname, script)], {
    stdio: "inherit",
    env: process.env,
  });
  if (r.status !== 0) failed++;
}

if (failed === 0) {
  console.log("\n✅ check:ops-constitution — hard rules 통과");
  process.exit(0);
}
console.error(`\n❌ check:ops-constitution — ${failed}개 실패`);
process.exit(1);
