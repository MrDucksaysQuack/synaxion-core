#!/usr/bin/env node
/**
 * verify:core / verify:reference orchestrator
 * Usage: node verification/run.mjs [--instance|--full]
 */

import { spawnSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const mode = args.includes("--full") || args.includes("--instance") ? "instance" : "core";

const CORE_CHECKS = [
  "check-core-completeness.mjs",
  "check-ui-scripts-registry.mjs",
  "check-deployment-constitution.mjs",
  "check-ops-constitution.mjs",
];

const INSTANCE_CHECKS = [
  "check-constitution-completeness.mjs",
  "check-ops-slo.mjs",
  "check-ui-raw-values.mjs",
  "check-ui-theme-split.mjs",
  "check-ui-motion.mjs",
];

function run(script) {
  console.log(`\n━━━ ${script} ━━━`);
  const r = spawnSync(process.execPath, [join(__dirname, script)], {
    stdio: "inherit",
    env: process.env,
  });
  return r.status === 0;
}

/** CI 또는 CONTRACT_ADR_STRICT=1 일 때만 실패 처리. 로컬은 항상 실행·경고. */
function runContractAdr() {
  console.log("\n━━━ check-contract-adr.mjs ━━━");
  const r = spawnSync(process.execPath, [join(__dirname, "check-contract-adr.mjs")], {
    stdio: "inherit",
    env: process.env,
  });
  if (r.status === 0) return true;
  const strict = process.env.CI === "true" || process.env.CONTRACT_ADR_STRICT === "1";
  if (!strict) {
    console.warn(
      "\n⚠️  check:contract-adr — 로컬 warning (exit 0). CI 또는 CONTRACT_ADR_STRICT=1 에서 실패 처리."
    );
    return true;
  }
  return false;
}

console.log(`Synaxion verify (mode=${mode})`);
if (process.env.SYNAXION_PROJECT_ROOT) {
  console.log(`  SYNAXION_PROJECT_ROOT=${process.env.SYNAXION_PROJECT_ROOT}`);
} else if (mode === "core") {
  console.log("  SYNAXION_PROJECT_ROOT=(default) reference/nextjs-minimal");
}

let failed = 0;
for (const s of CORE_CHECKS) {
  if (!run(s)) failed++;
}

if (!runContractAdr()) failed++;

if (mode === "instance") {
  for (const s of INSTANCE_CHECKS) {
    if (!run(s)) failed++;
  }
}

if (failed === 0) {
  console.log(`\n✅ verify:${mode === "instance" ? "reference" : "core"} — 전체 통과`);
  process.exit(0);
}
console.error(`\n❌ verify — ${failed}개 check 실패`);
process.exit(1);
