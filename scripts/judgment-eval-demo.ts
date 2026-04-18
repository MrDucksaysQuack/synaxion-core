#!/usr/bin/env tsx
/**
 * Synaxion judgment evaluator 데모 — 코어 decision-rules.example.json + 시나리오별 JudgmentContext
 */

import * as fs from 'fs';
import * as path from 'path';
import { evaluateJudgment } from '../../../packages/lib/core/judgment/evaluate';
import { judgmentToPlainText } from '../../../packages/lib/core/judgment/format-judgment-log';
import type { DecisionRulesFile, JudgmentContext } from '../../../packages/lib/core/judgment/types';

const ROOT = path.resolve(__dirname, '..', '..', '..');
const RULES_PATH = path.join(ROOT, 'docs', 'constitution', 'decision-rules.example.json');

function loadRules(): DecisionRulesFile {
  return JSON.parse(fs.readFileSync(RULES_PATH, 'utf-8')) as DecisionRulesFile;
}

const filled = (trust: 'high' | 'medium' | 'low') => ({ filled: true as const, trust });

function runCase(name: string, ctx: JudgmentContext): void {
  const file = loadRules();
  const { result, trace, evidenceGraph } = evaluateJudgment(file, ctx);
  console.log('\n━━━', name, '━━━');
  console.log('outcome:', result.outcome, '| confidence:', result.confidence, '| nextAction:', result.nextAction);
  console.log('appliedRuleIds:', result.appliedRuleIds);
  console.log('evidenceIds:', result.evidenceIds);
  console.log(
    'trace:',
    trace.steps.map((s) => `${s.ruleId}:${s.matched ? '✓' : '·'}`).join(' → '),
  );
  console.log(
    'graph edges:',
    evidenceGraph.edges.map((e) => `${e.from} -${e.rel}-> ${e.to}`).join('; '),
  );
}

function main(): void {
  console.log('Synaxion judgment-eval-demo');
  console.log('rules:', RULES_PATH);

  runCase('① 전 차원 high → ALLOW', {
    ingestionId: 'demo-1',
    evidenceIds: ['ev:product:1', 'ev:policy:2025-03'],
    eric: {
      entity: filled('high'),
      relation: filled('high'),
      context: filled('high'),
      impact: filled('high'),
    },
  });

  runCase('② entity 비움 → INSUFFICIENT_DATA', {
    ingestionId: 'demo-2',
    evidenceIds: ['ev:partial:scan'],
    eric: {
      relation: filled('medium'),
      context: filled('high'),
      impact: filled('medium'),
    },
  });

  runCase('③ 신뢰 경계 위반 → DENY', {
    ingestionId: 'demo-3',
    evidenceIds: [],
    eric: {
      entity: filled('high'),
      relation: filled('high'),
      context: filled('high'),
      impact: filled('high'),
    },
    flags: { trustBoundaryViolation: true },
  });

  runCase('④ 출처 충돌 + 미해소 → ESCALATE_TO_HUMAN', {
    ingestionId: 'demo-4',
    evidenceIds: ['ev:src-A', 'ev:src-B'],
    eric: {
      entity: filled('high'),
      relation: filled('high'),
      context: filled('high'),
      impact: filled('high'),
    },
    flags: { conflictingSources: true, unresolvedConflict: true },
  });

  runCase('⑤ 비동기 대기 → HOLD', {
    ingestionId: 'demo-5',
    evidenceIds: ['ev:payment:pending'],
    eric: {
      entity: filled('high'),
      relation: filled('high'),
      context: filled('high'),
      impact: filled('high'),
    },
    flags: { asyncPending: true },
  });

  runCase('⑥ 전 차원 채웠으나 일부 low trust → DEGRADED_CONFIDENCE', {
    ingestionId: 'demo-6',
    evidenceIds: ['ev:user-assertion-only'],
    eric: {
      entity: filled('low'),
      relation: filled('high'),
      context: filled('high'),
      impact: filled('medium'),
    },
  });

  console.log('\n── 포맷터 샘플 (① 시나리오 동일) ──');
  const file = loadRules();
  const sample = evaluateJudgment(file, {
    ingestionId: 'demo-format',
    evidenceIds: ['ev:product:1'],
    eric: {
      entity: filled('high'),
      relation: filled('high'),
      context: filled('high'),
      impact: filled('high'),
    },
  });
  console.log(judgmentToPlainText(sample));

  console.log('\n✅ 데모 완료\n');
}

main();
