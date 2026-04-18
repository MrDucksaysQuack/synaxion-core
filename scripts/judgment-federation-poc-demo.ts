#!/usr/bin/env tsx
/**
 * Federation PoC: 외부 주장 2건 → merge(신뢰 정규화) → evaluate → outcome + trace.trustAdjustments
 * @see docs/constitution/12-judgment-constitution/JUDGMENT_FEDERATION.md
 */

import { evaluateJudgment } from '../../../packages/lib/core/judgment/evaluate';
import { mergeExternalAssertionsForJudgment } from '../../../packages/lib/core/judgment/cross-domain-federation-stub';
import type { DecisionRulesFile, JudgmentContext } from '../../../packages/lib/core/judgment/types';

const filled = (trust: 'high' | 'medium' | 'low') => ({ filled: true as const, trust });

/** PoC 전용 최소 규칙 2줄 — 저장소 decision-rules 와 독립 */
const FEDERATION_POC_RULES: DecisionRulesFile = {
  version: '1.0',
  description: 'Federation PoC — context/impact 중 하나라도 low trust → DEGRADED',
  rules: [
    {
      id: 'federation-degraded-low-trust-ci',
      title: 'Context·Impact 중 low trust 가 있으면(연합 정규화 포함) 품질 저하',
      when: 'PoC',
      requiredDimensions: ['context', 'impact'],
      outcome: 'DEGRADED_CONFIDENCE',
      match: { ericAnyLowTrust: ['context', 'impact'] },
      rationaleDoc: '12-judgment-constitution/JUDGMENT_FEDERATION.md',
    },
    {
      id: 'federation-allow-eric-full',
      title: 'ERIC entity·context·impact 채움 + 위 위배 없으면 허용',
      when: 'PoC',
      requiredDimensions: ['entity', 'context', 'impact'],
      outcome: 'ALLOW',
      match: { ericAllFilled: ['entity', 'context', 'impact'] },
      rationaleDoc: '12-judgment-constitution/JUDGMENT_FEDERATION.md',
    },
  ],
};

const PREC = ['federation-degraded-low-trust-ci', 'federation-allow-eric-full'] as const;

function baseItemwikiCtx(): JudgmentContext {
  return {
    ingestionId: 'federation-poc:demo',
    policyVersion: '1.0',
    evidenceIds: ['ev:product:barcode:123'],
    eric: {
      entity: filled('high'),
      relation: filled('high'),
      context: filled('high'),
      impact: filled('high'),
    },
  };
}

function main(): void {
  console.log('Synaxion Federation PoC — assertion ×2 → merge → evaluate\n');

  const assertions = [
    {
      sourceSystemId: 'agrinovation.v1',
      subjectId: 'parcel-P1',
      assertionType: 'CROP_ON_PARCEL',
      payload: { crop: 'C', period: '2025-Q1' },
      observedAt: '2026-03-21T00:00:00.000Z',
      trustTier: 1,
      trustScore: 0.55,
      trustMeta: {
        sourceType: 'external_unknown' as const,
        reliability: 0.5,
        evidenceStrength: 'single' as const,
      },
      provenanceNote: 'unverified field sensor',
    },
    {
      sourceSystemId: 'itemwiki.internal',
      subjectId: 'product-123',
      assertionType: 'LABEL_METADATA_OK',
      payload: { verified: true },
      observedAt: '2026-03-21T00:00:00.000Z',
      trustTier: 4,
      trustScore: 0.95,
      trustMeta: {
        sourceType: 'internal_verified' as const,
        evidenceStrength: 'multi' as const,
      },
    },
  ];

  const merged = mergeExternalAssertionsForJudgment(baseItemwikiCtx(), assertions);
  const { result, trace } = evaluateJudgment(FEDERATION_POC_RULES, merged, { precedence: [...PREC] });

  console.log('--- merged context (eric.context / impact) ---');
  console.log('context:', merged.eric.context);
  console.log('impact:', merged.eric.impact);
  console.log('evidenceIds:', merged.evidenceIds);
  console.log('');
  console.log('--- outcome ---');
  console.log('outcome:', result.outcome, '| confidence:', result.confidence);
  console.log('evidenceIds (result):', result.evidenceIds);
  console.log('');
  console.log('--- trace.trustAdjustments ---');
  console.log(JSON.stringify(trace.trustAdjustments, null, 2));
  console.log('');
  console.log('winningRuleId:', trace.winningRuleId);
}

main();
