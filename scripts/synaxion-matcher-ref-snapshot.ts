#!/usr/bin/env tsx
/**
 * decision-rules.json에서 matcherRef 사용률 스냅샷 (G6 — 분기별 추세용).
 * 스프레드시트에 붙여넣기: --csv
 *
 * 실행: pnpm run judgment:metrics:matcher-ref
 *       pnpm run judgment:metrics:matcher-ref -- --rules=docs/itemwiki-constitution/decision-rules.json
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..', '..', '..');

function getRulesPath(): string {
  const arg = process.argv.find((a) => a.startsWith('--rules='));
  if (arg) return path.resolve(ROOT, arg.slice('--rules='.length).trim());
  return path.join(ROOT, 'docs', 'itemwiki-constitution', 'decision-rules.json');
}

function main(): void {
  const csv = process.argv.includes('--csv');
  const rulesPath = getRulesPath();
  const raw = JSON.parse(fs.readFileSync(rulesPath, 'utf-8')) as { version?: string; rules?: unknown[] };
  const rules = Array.isArray(raw.rules) ? raw.rules : [];
  let withRef = 0;
  const byRef: Record<string, number> = {};
  for (const r of rules) {
    if (typeof r !== 'object' || r === null) continue;
    const o = r as Record<string, unknown>;
    const id = typeof o.id === 'string' ? o.id : '(no-id)';
    const ref = o.matcherRef;
    if (typeof ref === 'string' && ref.length > 0) {
      withRef += 1;
      byRef[ref] = (byRef[ref] ?? 0) + 1;
    }
  }
  const total = rules.length;
  const declarative = total - withRef;
  const pct = total > 0 ? ((withRef / total) * 100).toFixed(1) : '0';
  const iso = new Date().toISOString().slice(0, 10);

  if (csv) {
    console.log('date,rules_path,rules_version,total_rules,matcher_ref_count,declarative_count,matcher_ref_pct');
    console.log(
      `${iso},${rulesPath},${raw.version ?? ''},${total},${withRef},${declarative},${pct}`,
    );
    return;
  }

  console.log('Synaxion matcherRef snapshot (G6)');
  console.log('파일:', rulesPath);
  console.log('rules.version:', raw.version ?? '(none)');
  console.log('');
  console.log(`총 규칙: ${total}`);
  console.log(`matcherRef 사용: ${withRef} (${pct}%)`);
  console.log(`선언적(JSON match 등): ${declarative}`);
  console.log('');
  console.log('matcherRef별 규칙 수 (상위):');
  const sorted = Object.entries(byRef).sort((a, b) => b[1] - a[1]);
  for (const [ref, n] of sorted) {
    console.log(`  ${n}× ${ref}`);
  }
  console.log('');
  console.log('분기 목표: matcherRef 비율 감소는 SYNAXION_MATURITY_PARALLEL_PLAN G6.2 참고.');
}

main();
