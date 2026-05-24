#!/usr/bin/env node
import { existsSync } from "fs";
import { constitutionDoc } from "./lib/paths.mjs";

const incident = constitutionDoc("INCIDENT_RUNBOOK.md");
const slo = constitutionDoc("SLO.md");
const found = [incident, slo].filter((p) => existsSync(p));

if (found.length >= 1) {
  found.forEach((f) => console.log(`  ✓ ${f}`));
  console.log("✅ check:ops-runbooks");
  process.exit(0);
}
console.error("❌ check:ops-runbooks — INCIDENT_RUNBOOK 또는 SLO 없음");
process.exit(1);
