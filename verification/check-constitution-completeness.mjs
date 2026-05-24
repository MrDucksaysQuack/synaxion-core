#!/usr/bin/env node
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { constitutionDoc, getProjectRoot } from "./lib/paths.mjs";
import { isExpressApiProfile } from "./lib/profile.mjs";

const ROOT = getProjectRoot();
const express = isExpressApiProfile();

function expressHealthOk() {
  const index = join(ROOT, "src/index.js");
  if (!existsSync(index)) return false;
  return /\/health|'\/health'|"\/health"/.test(readFileSync(index, "utf-8"));
}

const SHARED = [
  { path: () => constitutionDoc("ROLLBACK_RUNBOOK.md"), name: "Rollback Runbook", ref: "DEPLOY-07" },
  { path: () => constitutionDoc("SLO.md"), name: "SLO", ref: "OPS-06" },
  { path: () => constitutionDoc("INCIDENT_RUNBOOK.md"), name: "Incident Runbook", ref: "OPS-08" },
  { path: () => join(ROOT, ".env.example"), name: ".env.example", ref: "DEPLOY-02" },
  { path: () => constitutionDoc("ENV_CONTRACT.md"), name: "ENV Contract", ref: "DEPLOY-02" },
  { path: () => constitutionDoc("CONTRACT_CHANGE_POLICY.md"), name: "Contract Change Policy", ref: "04" },
  { path: () => join(ROOT, "docs/adr/README.md"), name: "ADR index", ref: "04-adr" },
];

const NEXTJS_ONLY = [
  {
    path: () => join(ROOT, "src/app/api/health/route.ts"),
    name: "Health endpoint",
    ref: "DEPLOY-06",
  },
  {
    path: () => constitutionDoc("EXPERIENCE_DIRECTION.md"),
    name: "Experience Direction",
    ref: "14",
  },
  { path: () => constitutionDoc("DB_CONTRACT.md"), name: "DB Contract", ref: "17" },
];

const EXPRESS_ONLY = [
  {
    path: () => (expressHealthOk() ? join(ROOT, "src/index.js") : ""),
    name: "Health route (/health)",
    ref: "DEPLOY-06",
  },
];

const REQUIRED = express ? [...SHARED, ...EXPRESS_ONLY] : [...SHARED, ...NEXTJS_ONLY];

const missing = [];
for (const doc of REQUIRED) {
  const p = doc.path();
  if (p && existsSync(p)) console.log(`  ✓ ${doc.name} (${doc.ref})`);
  else missing.push({ ...doc, path: p || "(missing)" });
}

if (missing.length === 0) {
  console.log(`✅ check:constitution-completeness (${express ? "express-api" : "nextjs"})`);
  process.exit(0);
}
console.error(`\n❌ check:constitution-completeness — ${missing.length}개 누락\n`);
missing.forEach((d) => console.error(`  ✗ ${d.name}\n    ${d.path}`));
process.exit(1);
