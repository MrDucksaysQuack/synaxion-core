#!/usr/bin/env node
import { existsSync } from "fs";
import { constitutionDoc } from "./lib/paths.mjs";

const rollback = constitutionDoc("ROLLBACK_RUNBOOK.md");
if (existsSync(rollback)) {
  console.log(`✅ check:deployment-rollback — ${rollback}`);
  process.exit(0);
}
console.error("❌ check:deployment-rollback — ROLLBACK_RUNBOOK.md 없음");
process.exit(1);
