#!/usr/bin/env node
import { existsSync, readFileSync } from "fs";
import { constitutionDoc } from "./lib/paths.mjs";

const slo = constitutionDoc("SLO.md");
if (!existsSync(slo)) {
  console.warn("⚠️  check:ops-slo — SLO.md 없음 (warn)");
  process.exit(0);
}

const content = readFileSync(slo, "utf-8");
const hasBudget = /error budget|Error Budget/i.test(content);
if (hasBudget) console.log("  ✓ error budget 섹션");
else console.warn("  ⚠️  error budget 섹션 권장");

console.log("✅ check:ops-slo");
process.exit(0);
