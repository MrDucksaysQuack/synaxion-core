# N-way Consistency Gate
# N중 정합 게이트

> **데이터 SSOT가 N개 있을 때, 양방향 정합을 *strict CI 게이트*로 강제한다.**  
> 단일 SSOT가 불가능한 영역에서, *복수 SSOT의 정합성*을 단일 SSOT의 기능적 대체물로 만든다.

**Tier**: 3 (도입 단계 · 2.15.0 신규)  
**상태**: Inflomatrix 인스턴스에서 `matrix-table-manifest` 5중 정합(manifest ↔ domains ↔ actions ↔ relations ↔ traceability)으로 실증.  
**연계**: [SINGLE_SOURCE_MAP](../../docs/inflomatrix-constitution/SINGLE_SOURCE_MAP.md) (인스턴스 예) · [VERIFICATION_FRAMEWORK.md](../06-automation/VERIFICATION_FRAMEWORK.md) · [META_GATE_TELEMETRY.md](../06-automation/META_GATE_TELEMETRY.md)

**최종 업데이트**: 2026-05-29

---

## 1. 문제

전통적인 SSOT(Single Source of Truth) 원칙은 *하나의* 진실 원본을 가정한다. 그러나 실제 시스템에서 SSOT는 *복수*가 필연적으로 존재한다.

- 데이터 모델은 **DB 스키마**·**TypeScript 타입**·**OpenAPI 스펙**·**문서**에 *동시에* 살 수밖에 없다.
- 권한은 **role table**·**미들웨어**·**프론트 가드**·**ADR**에 *동시에* 표현된다.
- 매트릭스는 **엔티티 목록**·**관계 목록**·**액션 매핑**·**합성 manifest**가 *각자의 책임을* 가진다.

"모두 합쳐 하나의 SSOT로 만든다"는 흔히 *추상화의 손실*과 *변경 코스트의 증가*를 가져온다. 반대로 "각자 그대로 두고 사람이 동기화한다"는 *드리프트*를 낳는다.

---

## 2. 전환: 정합성을 SSOT의 *대체물*로 만든다

**N개의 SSOT가 존재한다면, N개 중 어느 쌍을 골라도 *정합한다*는 사실을 *기계적으로* 보장한다.**

- 단일 SSOT가 불가능한 곳에서, *정합성 자체*가 단일 SSOT의 기능적 대체물이 된다.
- 정합 검증은 *문서 리뷰*나 *팀 합의*가 아닌 *strict CI 게이트*로 강제한다.
- 드리프트는 머지 전에 차단되며, 사람이 알아채기 전에 시스템이 잡는다.

---

## 3. 운영 원리 (Principles)

### Principle 1 — Pair-Wise Verification (쌍별 검증)

N개의 SSOT가 있다면 `N(N-1)/2` 쌍 중 *결정적으로 의존하는* 쌍을 식별하고, 그 쌍 각각에 대해 양방향 정합 검사를 작성한다.

### Principle 2 — Bidirectional Coverage (양방향 커버리지)

`A → B` 정합과 `B → A` 정합은 *다른 검사*다. 한쪽만 검증하면 *외부에 노출된 누락*과 *내부에 잠겨 있는 누락*을 한 번에 잡지 못한다.

### Principle 3 — Strict by Default, Warn for Onboarding (기본 strict, 도입 시 warn)

새 정합 쌍은 처음에는 `--warn` 모드로 도입해 베이스라인을 측정하고, 베이스라인이 0이 된 시점에 strict로 승격한다. 베이스라인 측정 자체가 첫 회귀 방지선이다.

### Principle 4 — Pair Cardinality is Documented (쌍의 카디널리티 명시)

각 정합 쌍은 "1:N", "N:M", "subset", "equality" 등의 *기대 카디널리티*를 명시한다. 카디널리티가 모호한 쌍은 게이트가 *무엇을 잡고 무엇을 흘릴지* 정의되지 않는다.

---

## 4. Inflomatrix 실증 — matrix-table-manifest 5중 정합

| # | 정합 쌍 (방향) | 카디널리티 | 검증 |
|---|----------------|------------|------|
| 1 | manifest.subdomain → matrix-domains.domains | subset | `check:matrix-table-manifest` |
| 2 | manifest.rowActions → matrix-actions.actionGroups | subset | `check:matrix-table-manifest` |
| 3 | manifest.relationHints → matrix-relations.relations | subset (source 고정) | `check:matrix-table-manifest` |
| 4 | manifest.workflows → workflows/registry.ts WORKFLOW_COMPONENTS | subset | `check:matrix-table-manifest` |
| 5 | manifest.defaultVisible → schema fields ∪ CoreFields ∪ traceability.md | subset | `check:matrix-table-manifest` |

5개 SSOT 간 양방향 정합이 하나의 strict CI 게이트로 강제된다.

---

## 5. 게이트 작성 체크리스트

새 N중 정합 게이트를 도입할 때 다음을 확인한다.

- [ ] 각 SSOT의 *물리 위치*가 단일 경로로 식별 가능한가? (`docs/data/*.json`, `src/.../registry.ts` 등)
- [ ] 각 정합 쌍의 *카디널리티*가 문서에 명시되었는가? (subset · equality · partial 등)
- [ ] 게이트 스크립트가 `--warn` · `--audit-out=<path>` 옵션을 지원하는가?
- [ ] 게이트 스크립트가 *검사 건수*를 stdout에 발행하는가? ([META_GATE_TELEMETRY.md](../06-automation/META_GATE_TELEMETRY.md) §2 게이트 원격 측정 원칙)
- [ ] 베이스라인이 0인 시점에 *strict 승격 PR*이 자동/수동 트리거되는가?
- [ ] 게이트가 `check:all` 또는 동등한 메인 파이프라인에 등록되는가?

---

## 6. 카디널리티 표기법

게이트 스크립트의 헤더 주석에 다음 형태로 명시한다.

```ts
/**
 * SSOT pairs:
 *   1. manifest.subdomain (subset) → matrix-domains.domains
 *   2. manifest.rowActions (subset) → matrix-actions.actionGroups
 *   ...
 *
 * Direction: subset = LHS ⊆ RHS (manifest 항목은 모두 매트릭스에 존재해야 함)
 *            equality = LHS = RHS
 *            partial = LHS ∩ RHS ≠ ∅ (최소 1개 공통 보장)
 */
```

이 주석 자체가 *재귀적 정합*의 대상이다. 게이트가 동작 방식을 *코드 외부에 거짓말*하면 그것은 [META_GATE_TELEMETRY](../06-automation/META_GATE_TELEMETRY.md)의 *위양성 검출*에 걸려야 한다.

---

## 7. 적용 한계

- **변경 빈도가 매우 높은 페어** — 매 PR마다 N중 정합 위반이 발생하면 *게이트가 노이즈*가 된다. 이 경우 페어를 더 작은 단위로 분해하거나, 그 쌍은 자동 동기화 스크립트(`sync:*`)로 보강한다.
- **외부 시스템과의 정합** — 외부 API · 3rd-party 데이터와의 정합은 본 원칙의 범위 밖. *계약 테스트*(Pact 등)가 더 적합하다.
- **시간 경과에 따른 의미 변화** — 카디널리티가 *시점마다* 다른 페어(예: 점진 마이그레이션 중인 두 스키마)는 strict 게이트가 부적합. `--warn` 유지 + ADR로 이주 종료 시점 명시.

---

## 8. 곱하기 효과

- **[RECURSIVE_LAYERING_PRINCIPLE](./RECURSIVE_LAYERING_PRINCIPLE.md)과 결합**: 한 N중 정합 게이트의 코어 로직(`alignment-core.ts`)을 *다른 추상 수준*의 매트릭스에도 재사용할 수 있다. Inflomatrix는 `matrix-internal-alignment-core.ts` 1개 코어를 Flow·Stream·Schema·Conscious 4개 매트릭스에 재사용한다.
- **[META_GATE_TELEMETRY](../06-automation/META_GATE_TELEMETRY.md)와 결합**: 각 정합 쌍의 *검사 건수*가 메트릭으로 발행되면, *공집합 검사*(거짓 통과)를 자동 감지한다.

---

## 9. 검증

- 각 정합 게이트는 `check:` prefix를 사용하고 `package.json` scripts에 등록.
- `check:all` 또는 `check:constitution-pr` 에 포함되어 PR 게이트에 결합.
- 게이트 실행 시 *최소 1개 페어* 검사가 일어남을 stdout으로 증명 (META_GATE_TELEMETRY 준수).
- 베이스라인 0 → strict 승격 시 ADR 또는 `04-gaps/` 메모로 기록.

---

## 10. 참고

- [VERIFICATION_FRAMEWORK.md](../06-automation/VERIFICATION_FRAMEWORK.md) — 검증 일반 원칙
- [META_GATE_TELEMETRY.md](../06-automation/META_GATE_TELEMETRY.md) — 게이트 신뢰도 검증
- Inflomatrix `scripts/check-matrix-table-manifest.ts` — 5중 정합 구현 예
- Inflomatrix `scripts/matrix-internal-alignment-core.ts` — 재사용 코어

---

**제안자**: Inflomatrix instance (2026-05-29)  
**Tier 3 등재일**: 2026-05-29 (Synaxion 2.15.0)
