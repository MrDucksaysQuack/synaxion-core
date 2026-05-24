#!/usr/bin/env node
/**
 * check:core-completeness — synaxion-core 필수 문서·verification 스크립트 존재
 */

import { existsSync } from "fs";
import { join } from "path";
import { getCoreRoot } from "./lib/paths.mjs";

const CORE = getCoreRoot();

const REQUIRED = [
  "SCOPE_BOUNDARY.md",
  "CONTRACT_CHANGE_POLICY.md",
  "CORE_READINESS_SCORECARD.md",
  "DELIVERY_READINESS_RUBRIC.md",
  "FEATURE_CONTRACT_TEMPLATE.md",
  "01-foundations/FEATURE_PLACEMENT_GUIDE.md",
  "15-deployment/DEPLOYMENT_CONSTITUTION.md",
  "15-deployment/DEPLOYMENT_READINESS_RUBRIC.md",
  "16-operations/OPERATIONS_CONSTITUTION.md",
  "16-operations/OPERATIONS_READINESS_RUBRIC.md",
  "17-data-db/DATA_CONSTITUTION.md",
  "17-data-db/DB_CONTRACT_TEMPLATE.md",
  "10-design-flow/UX_CONSTITUTION.md",
  "13-ui-design/UI_DESIGN_CONSTITUTION.md",
  "verification/run.mjs",
  "verification/check-deployment-constitution.mjs",
  "verification/check-ops-constitution.mjs",
  "verification/check-ui-scripts-registry.mjs",
];

const missing = REQUIRED.filter((p) => !existsSync(join(CORE, p)));

for (const p of REQUIRED.filter((x) => !missing.includes(x))) {
  console.log(`  ✓ ${p}`);
}

if (missing.length === 0) {
  console.log("✅ check:core-completeness — 코어 필수 산출물 전부 존재");
  process.exit(0);
}

console.error(`\n❌ check:core-completeness — ${missing.length}개 누락\n`);
missing.forEach((p) => console.error(`  ✗ ${p}`));
process.exit(1);
