#!/usr/bin/env tsx
/**
 * Itemwiki decision-rules.json + 실전형 시나리오 + 로그 포맷 + multi-match 실험
 */

import * as fs from 'fs';
import * as path from 'path';
import { evaluateJudgment } from '../../../packages/lib/core/judgment/evaluate';
import {
  judgmentToMarkdown,
  judgmentToPlainText,
  judgmentToStructuredLog,
} from '../../../packages/lib/core/judgment/format-judgment-log';
import { ITEMWIKI_RULE_PRECEDENCE } from '../../../packages/lib/core/judgment/itemwiki-precedence';
import { ITEMWIKI_JUDGMENT_SCENARIOS } from '../../../packages/lib/core/judgment/itemwiki-scenarios';
import { WEIGHTED_DEMO_PRECEDENCE } from '../../../packages/lib/core/judgment/precedence';
import type { DecisionRulesFile, JudgmentContext } from '../../../packages/lib/core/judgment/types';

const ROOT = path.resolve(__dirname, '..', '..', '..');
const ITEMWIKI_RULES = path.join(ROOT, 'docs', 'itemwiki-constitution', 'decision-rules.json');
const CORE_RULES = path.join(ROOT, 'docs', 'constitution', 'decision-rules.example.json');
const WEIGHTED_FIXTURE = path.join(ROOT, 'docs', 'constitution', 'fixtures', 'judgment-weighted-demo.json');

function load(p: string): DecisionRulesFile {
  return JSON.parse(fs.readFileSync(p, 'utf-8')) as DecisionRulesFile;
}

function section(title: string): void {
  console.log('\n' + '═'.repeat(60));
  console.log(title);
  console.log('═'.repeat(60));
}

function runItemwikiScenarios(): void {
  section('A. Itemwiki 실전 시나리오 (first-match + plainText / structuredLog)');
  const file = load(ITEMWIKI_RULES);
  for (const sc of ITEMWIKI_JUDGMENT_SCENARIOS) {
    const ev = evaluateJudgment(file, sc.context, { precedence: ITEMWIKI_RULE_PRECEDENCE });
    console.log('\n──', sc.title, '──');
    console.log(sc.pipelineNote);
    console.log(judgmentToPlainText(ev));
    const log = judgmentToStructuredLog(ev);
    console.log('structuredLog.synaxion:', JSON.stringify(log.synaxion));
  }
}

function runVetoExperiment(): void {
  section('B. veto-first (코어 규칙): 신뢰 경계가 eric-all 보다 우선');
  const file = load(CORE_RULES);
  const ctx: JudgmentContext = {
    ingestionId: 'exp:veto-vs-allow',
    evidenceIds: ['ev:unsafe:raw-partner-payload'],
    eric: {
      entity: { filled: true, trust: 'high' },
      relation: { filled: true, trust: 'high' },
      context: { filled: true, trust: 'high' },
      impact: { filled: true, trust: 'high' },
    },
    flags: { trustBoundaryViolation: true },
  };
  const first = evaluateJudgment(file, ctx, {});
  const veto = evaluateJudgment(file, ctx, {
    mode: { kind: 'veto-first', vetoRuleIds: ['trust-boundary-violation-deny'] },
  });
  console.log('first-match outcome:', first.result.outcome, '(동일 기대 DENY)');
  console.log(judgmentToPlainText(veto));
}

function runWeightedExperiment(): void {
  section('C. weighted-max: 두 규칙 동시 매칭 → 가중치 높은 규칙');
  const file = load(WEIGHTED_FIXTURE);
  const ctx: JudgmentContext = {
    ingestionId: 'exp:weighted',
    evidenceIds: ['ev:demo:multi-match'],
    eric: {
      entity: { filled: true, trust: 'high' },
      relation: { filled: true, trust: 'high' },
      context: { filled: true, trust: 'high' },
      impact: { filled: true, trust: 'high' },
    },
    experiment: { weightedDemo: true },
  };
  const ev = evaluateJudgment(file, ctx, {
    precedence: WEIGHTED_DEMO_PRECEDENCE,
    mode: {
      kind: 'weighted-max',
      weights: { 'weighted-demo-low': 1, 'weighted-demo-high': 10 },
      tieBreak: 'precedence',
    },
  });
  console.log(judgmentToPlainText(ev));
  console.log('\n--- Markdown (UI 붙여넣기용) ---\n');
  console.log(judgmentToMarkdown(ev));
}

function main(): void {
  console.log('Synaxion judgment-itemwiki-demo');
  runItemwikiScenarios();
  runVetoExperiment();
  runWeightedExperiment();
  console.log('\n✅ 완료 (pnpm run judgment:demo:itemwiki)\n');
}

main();
