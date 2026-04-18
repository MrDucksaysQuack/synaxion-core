#!/usr/bin/env tsx
/**
 * 규칙 추가 생산성 스모크: 신규 3규칙이 JSON+선행만으로 끝나는지 vs matcherRef 필요 여부.
 * 성공 기준(수동): 3개 중 2개 이상 JSON(+precedence)만, matcherRef는 복합 규칙만.
 *
 * 실행: pnpm run judgment:experiment:rule-add
 */

import * as fs from 'fs';
import * as path from 'path';
import { evaluateJudgment } from '../../../packages/lib/core/judgment/evaluate';
import { ITEMWIKI_RULE_PRECEDENCE } from '../../../packages/lib/core/judgment/itemwiki-precedence';
import type { DecisionRulesFile, JudgmentContext } from '../../../packages/lib/core/judgment/types';

const ROOT = path.resolve(__dirname, '..', '..', '..');
const RULES_PATH = path.join(ROOT, 'docs', 'itemwiki-constitution', 'decision-rules.json');

const filled = (trust: 'high' | 'medium' | 'low') => ({ filled: true as const, trust });

function loadRules(): DecisionRulesFile {
  return JSON.parse(fs.readFileSync(RULES_PATH, 'utf-8')) as DecisionRulesFile;
}

function assertCase(name: string, ctx: JudgmentContext, expectRuleId: string): void {
  const file = loadRules();
  const ev = evaluateJudgment(file, ctx, { precedence: ITEMWIKI_RULE_PRECEDENCE });
  const win = ev.trace.winningRuleId;
  const ok = win === expectRuleId;
  console.log(`${ok ? '✓' : '✗'} ${name}`);
  console.log(`   기대 승리 규칙: ${expectRuleId} / 실제: ${win ?? '(none)'}`);
  if (!ok) {
    process.exitCode = 1;
  }
}

function main(): void {
  console.log('Synaxion judgment-rule-productivity-experiment');
  console.log('규칙 파일:', RULES_PATH);
  console.log('');
  console.log('신규 실험 규칙 3개 검증:');
  console.log('  A relation-dimension-missing-insufficient — JSON builtin + requiredDimensions + precedence');
  console.log('  B catalog-import-async-hold — JSON flag asyncPending + precedence');
  console.log('  C fulfillment-ready-label-insufficient-hold — matcherRef + registry 1함수');
  console.log('');

  assertCase(
    'A: Relation 비어 있으면 relation-dimension-missing-insufficient',
    {
      ingestionId: 'exp:relation-gap',
      evidenceIds: ['ev:exp:relation-missing'],
      eric: {
        entity: filled('high'),
        context: filled('high'),
        impact: filled('high'),
      },
      policyVersion: 'exp@1',
    },
    'relation-dimension-missing-insufficient',
  );

  assertCase(
    'B: flags.asyncPending 이면 catalog-import-async-hold',
    {
      ingestionId: 'exp:catalog-async',
      evidenceIds: ['ev:catalog:import-queue'],
      eric: {
        entity: filled('high'),
        relation: filled('high'),
        context: filled('high'),
        impact: filled('high'),
      },
      flags: { asyncPending: true },
      policyVersion: 'exp@1',
    },
    'catalog-import-async-hold',
  );

  assertCase(
    'C: 출고 준비 + 라벨 insufficient → fulfillment-ready-label-insufficient-hold',
    {
      ingestionId: 'exp:ship-label-conflict',
      evidenceIds: ['ev:order:ready', 'ev:label:insufficient'],
      eric: {
        entity: filled('high'),
        relation: filled('high'),
        context: filled('high'),
        impact: filled('high'),
      },
      itemwiki: {
        fulfillmentReady: true,
        productIngredientLabelInsufficient: true,
        fulfillmentAsyncPending: false,
      },
      policyVersion: 'exp@1',
    },
    'fulfillment-ready-label-insufficient-hold',
  );

  console.log('');
  console.log('작성 시간은 로컬에서 스톱워치로 측정하면 됨.');
  console.log('기대: A·B는 JSON(+ITEMWIKI_RULE_PRECEDENCE 한 줄)만, C만 matcherRef+레지스트리.');
  if (process.exitCode === 1) {
    console.error('\n❌ 한 건 이상 실패');
    process.exit(1);
  }
  console.log('\n✅ 생산성 실험 시나리오 통과');
}

main();
