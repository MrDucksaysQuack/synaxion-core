#!/usr/bin/env node
import { execSync } from "child_process";
import { existsSync } from "fs";
import { relative } from "path";
import { constitutionDoc, getProjectRoot } from "./lib/paths.mjs";

const ROOT = getProjectRoot();

const CONTRACT_FILES = [
  "DB_CONTRACT.md",
  "ENV_CONTRACT.md",
  "SLO.md",
  "ROLLBACK_RUNBOOK.md",
  "INCIDENT_RUNBOOK.md",
  "CONTRACT_CHANGE_POLICY.md",
]
  .map((name) => constitutionDoc(name))
  .filter((p) => existsSync(p))
  .map((p) => relative(ROOT, p));

function getDiffFiles() {
  try {
    execSync("git rev-parse --git-dir", { stdio: "ignore", cwd: ROOT });
  } catch {
    return null;
  }
  const base = process.env.GITHUB_BASE_REF
    ? `origin/${process.env.GITHUB_BASE_REF}`
    : process.env.CONTRACT_ADR_BASE || "origin/main";
  try {
    const out = execSync(`git diff --name-only ${base}...HEAD 2>/dev/null || git diff --name-only HEAD~1 HEAD`, {
      encoding: "utf-8",
      cwd: ROOT,
    });
    return out.split("\n").map((s) => s.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

const changed = getDiffFiles();
if (changed === null) {
  console.log("⏭️  check:contract-adr — git 없음, skip");
  process.exit(0);
}
if (changed.length === 0) {
  console.log("✅ check:contract-adr — 변경 없음");
  process.exit(0);
}

const contractChanged = changed.filter(
  (f) => CONTRACT_FILES.includes(f) || f.startsWith("supabase/migrations/")
);

const adrChanged = changed.some(
  (f) => f.startsWith("docs/adr/") && f.endsWith(".md") && !f.endsWith("README.md")
);

if (contractChanged.length === 0) {
  console.log("✅ check:contract-adr — contract 변경 없음");
  process.exit(0);
}
if (adrChanged) {
  console.log("✅ check:contract-adr — ADR 갱신 확인");
  process.exit(0);
}

console.error("❌ check:contract-adr — contract 변경 without ADR");
contractChanged.forEach((f) => console.error(`  ${f}`));
process.exit(1);
