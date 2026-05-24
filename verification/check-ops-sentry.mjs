#!/usr/bin/env node
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { getProjectRoot } from "./lib/paths.mjs";

const ROOT = getProjectRoot();
const sentryFiles = [
  "sentry.client.config.ts",
  "instrumentation-client.ts",
  "src/instrumentation.ts",
  "src/lib/sentry/config.ts",
];

const found = sentryFiles.find((f) => existsSync(join(ROOT, f)));
if (found) {
  console.log(`✅ check:ops-sentry — ${found}`);
  process.exit(0);
}

const envExample = join(ROOT, ".env.example");
if (existsSync(envExample)) {
  const c = readFileSync(envExample, "utf-8");
  if (c.includes("SENTRY_DSN") || c.includes("NEXT_PUBLIC_SENTRY_DSN")) {
    console.log("✅ check:ops-sentry — .env.example DSN 문서화");
    process.exit(0);
  }
}

console.error("❌ check:ops-sentry — Sentry 설정 없음");
process.exit(1);
