# Engine Evaluation (규칙 실행 · 충돌 · 신뢰도)

> **목적**: `decision-rules.json`의 자연어 `when`이 아니라, **구현 가능한** 평가 모델을 고정한다.  
> **참조 구현**: `packages/lib/core/judgment/` (`evaluateJudgment`, `ruleMatches`, …)

---

## 1. 평가 순서 (Rule evaluation order)

- 규칙 배열 **JSON 순서는 사용하지 않는다.**  
- [precedence.ts](../../../packages/lib/core/judgment/precedence.ts)의 **`DEFAULT_RULE_PRECEDENCE`** 순으로 정렬한 뒤, **위에서부터 한 줄씩** 평가한다.
- **첫 매칭 우선(first match wins)** — 방화벽 규칙과 동형. 한 규칙이 `true`이면 즉시 `outcome` 확정, 이후 규칙은 평가하지 않는다(트레이스에는 “시도만” 기록할지 여부는 구현 선택; 참조 구현은 매칭될 때까지 전 단계를 `steps`에 남긴다).

**선행 순서가 중요한 이유 예**: `trust-boundary-violation-deny`가 `eric-all-dimensions-present`보다 먼저 와야, “차원은 다 찼지만 경계 위반”이 **DENY**로 끝난다.

---

## 2. 충돌 해소 (Conflict resolution)

- **여러 규칙이 동시에 참**인 경우는, 본 모델에서는 **발생하지 않게** 한다 — 첫 참만 채택.  
- **CONFLICTING_SOURCES vs ESCALATE_TO_HUMAN**: 입력 플래그로 분리한다.  
  - `conflictingSources && !unresolvedConflict` → 상태 **CONFLICTING_SOURCES**  
  - `conflictingSources && unresolvedConflict` → 행동 **ESCALATE_TO_HUMAN**  
  전자가 먼저 오면 안 되므로 **precedence**에서 `conflict-unresolved-escalate-human`이 `conflicting-sources-detected` **앞**에 있다.

---

## 3. 술어(Predicate)와 자연어 `when`

- JSON의 `when`은 **사람·감사용**이다.  
- 런타임 매칭은 **규칙 `id`별 TypeScript 술어**([rule-matchers.ts](../../../packages/lib/core/judgment/rule-matchers.ts))로 수행한다.  
- 새 규칙을 추가하면: **같은 id의 분기**를 `ruleMatches`에 추가하거나, 향후 소규모 DSL/codegen으로 대체한다.

---

## 4. Confidence aggregation (v0)

- 참조 구현: [confidence.ts](../../../packages/lib/core/judgment/confidence.ts)  
- **v0**: ERIC에 채워진 차원의 `trust` 점수 최소값을 기준으로 `high|medium|low`를 잡고, `DEGRADED_CONFIDENCE`·`INSUFFICIENT_DATA` 등 outcome에 따라 **상한을 한 단계 낮춘다**.  
- **v1+**: 가중 평균, 출처별 가중치, Bayesian 등은 인스턴스·ADR에서 확장.

---

## 5. 매칭 실패 시

- 어떤 규칙도 참이 아니면 **`INSUFFICIENT_DATA`**, `appliedRuleIds: []`, `nextAction: FETCH_MORE` (참조 구현).

---

## 6. 실행 방법

```bash
pnpm run judgment:demo
pnpm run judgment:demo:itemwiki
```

## 7. Multi-match (실험)

[veto-first · weighted-max](./MULTI_MATCH_EXPERIMENT.md) — `evaluateJudgment` 의 `mode` 옵션.

## 8. 운영 가독성 (로그 · UI)

[format-judgment-log.ts](../../../packages/lib/core/judgment/format-judgment-log.ts) — `judgmentToStructuredLog` / `judgmentToPlainText` / `judgmentToMarkdown`.

**관련**: [EVIDENCE_AND_TRACE.md](./EVIDENCE_AND_TRACE.md), [ENGINE_INTERFACE.md](./ENGINE_INTERFACE.md)

**최종 업데이트**: 2026-03-20
