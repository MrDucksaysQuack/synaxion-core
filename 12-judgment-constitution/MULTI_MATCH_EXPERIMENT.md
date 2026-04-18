# Multi-match 실험 (veto · weighted)

> 긴 문서 대신 **모드만** 고정한다. 기본은 여전히 **first-match**.

## 모드

| 모드 | 동작 | 용도 |
|------|------|------|
| **first-match** | 선행 순서대로 첫 참 규칙 | 기본 · 방화벽형 |
| **veto-first** | `vetoRuleIds`를 선행 순서 **앞에** 붙인 뒤 첫 매칭 | 글로벌 DENY/안전 룰 |
| **weighted-max** | **모든** 규칙을 평가해 참인 것만 모음 → `weights[id]` 최대인 규칙 승리. 동점 시 `tieBreak: precedence` | 추천·랭킹·다중 신호 합성 실험 |

## 코드

- `evaluateJudgment(file, ctx, { mode, precedence })` — [evaluate.ts](../../../packages/lib/core/judgment/evaluate.ts)
- `meta.resolutionMode`, `meta.allMatchingRuleIds`, `meta.ruleScores` — [types](../../../packages/lib/core/judgment/types.ts)

## 픽스처

- [judgment-weighted-demo.json](../fixtures/judgment-weighted-demo.json) + `JudgmentContext.experiment.weightedDemo` — 두 규칙 동시 참만 재현(프로덕션 플래그 아님).

## 데모

```bash
pnpm run judgment:demo:itemwiki
```

**최종 업데이트**: 2026-03-20
