# Judgment Federation (연합 판단)

> 서로 다른 시스템의 데이터를 **하나의 판단**으로 묶을 때 필요한 **최소 약속**.  
> **전제**: 합성 단위는 [JUDGMENT_OUTPUT_TYPE.md](./JUDGMENT_OUTPUT_TYPE.md)의 `outcome`·`evidenceIds`·`confidence`가 먼저 고정되어 있어야 한다.

---

## 1. 판단 단위 (Judgment Unit)

연합 시 각 참여 시스템은 다음을 노출할 수 있다고 가정한다.

- **subject**: 무엇에 대한 판단인가(ERIC의 Entity·Relation 중심 식별자).
- **assertion**: 주장(속성·상태·수치).
- **provenance**: 출처 시스템 id, 수집 시각, 신뢰 레이블.

내부 구현(JSON API, 이벤트 스트림)은 인스턴스가 정한다.

---

## 2. 신뢰·충돌 (META와 동형)

규칙이 충돌할 때 **우선순위**는 [META_CONSTITUTION.md §5](../META_CONSTITUTION.md)와 **동형**을 권장한다.

1. Trust / Security / Safety  
2. Structure & Architecture  
3. Code Quality & Maintainability  
4. User Experience  
5. Performance  

**연합 맥락 해석**: “시스템 A의 비즈니스 편의” vs “시스템 B의 비즈니스 편의”가 충돌하면, 위 순서의 **Trust·Safety** 축으로 먼저 해소한다. 해소 불가 → **CONFLICTING_SOURCES** 진단 후 **ESCALATE_TO_HUMAN** 또는 정책에 따른 **DENY**.

### 2.1 Assertion Trust Normalization (필수 최소층)

서로 다른 시스템의 `confidence`·티어 숫자는 **같은 스케일이 아니다**. 연합의 실질 정의는 “**서로 다른 판단 체계를 하나의 신뢰 기준으로 비교 가능하게 만드는 것**”이므로, 주장 단위에 대해 **규칙 기반** 정규화를 먼저 적용한다 (ML·Bayesian·동적 가중 비목표).

- **입력**: `trustMeta.sourceType`(`internal_verified` / `internal_inferred` / `external_verified` / `external_unknown` 등), `trustTier`·`trustScore`, 선택 `reliability`, `evidenceStrength`(`single`|`multi`).
- **출력**: `[0,1]` 스케일의 정규 점수 → `JudgmentConfidence`로 투영, 감사용 **`before` / `after` / `reason`** (`trace.trustAdjustments`).
- **ERIC 반영**: 정규화된 신뢰는 **Context·Impact** 슬롯에 보수적으로 병합(여러 주장 시 **더 낮은** 신뢰가 남도록 `worse` 합성).
- **구현**: `packages/lib/core/judgment/assertion-trust-normalize.ts`, 병합 `mergeExternalAssertionsForJudgment` (`cross-domain-federation-stub.ts`).

---

## 3. 가상 시나리오 (문서용)

**설정**: 시스템 **A**(예: 농업 실증 데이터)가 “필지 P에 작물 C 재배 중”을 주장하고, 시스템 **B**(예: ItemWiki)가 “제품 메타에 원산지 미기재” 상태다.

| 단계 | 내용 |
|------|------|
| 수집 | A·B에서 각각 provenance 포함 레코드 수집 |
| 정규화 | Entity(필지 P, 제품), Relation(제품–원산지), Context(규제 버전), Impact(라벨 표시 요구) |
| 규칙 | “원산지 필수 + A가 높은 신뢰로 P–C 연결 제시” → 라벨에 원산지 **DEGRADED_CONFIDENCE** 또는 추가 증빙까지 **INSUFFICIENT_DATA** |
| 충돌 | A가 “미재배”, B가 “재배”처럼 **배타**이면 **CONFLICTING_SOURCES**; 신뢰 순위로도 불가 시 **ESCALATE_TO_HUMAN** |

이 시나리오는 구현 명세가 아니라 **⑥ 연결 가능성** 검증용 예시다.

---

## 4. PoC 범위 고정 (G6.4)

**단일 시나리오 (이 문서 §3과 동일 축)**  

- **입력**: 시스템 A가 “필지 P · 작물 C 재배”를 `ExternalAssertion` 형태로 제시하고, 시스템 B(ItemWiki)가 동일 제품에 대해 “원산지 메타 미기재” `JudgmentContext`를 제공한다.  
- **처리**: 두 출처를 하나의 ERIC 정규화 공간에 올린 뒤, 기존 규칙 세트로 **한 번** `evaluateJudgment`에 넣거나, 연합 전용 규칙 1줄로 `INSUFFICIENT_DATA` / `DEGRADED_CONFIDENCE` / `CONFLICTING_SOURCES` 중 하나를 산출한다.  
- **출력**: [JUDGMENT_OUTPUT_TYPE.md](./JUDGMENT_OUTPUT_TYPE.md) 준수 + `evidenceIds`에 A·B 출처 식별자 포함.

**PoC 완료 기준 (재현 가능)**  

1. 위 입력을 **고정 JSON fixture** 2개로 재현할 수 있다.  
2. 로컬에서 **`pnpm run judgment:poc:federation`** 한 줄로 “외부 주장 2건 → merge(신뢰 정규화) → `evaluateJudgment` → outcome + `trace.trustAdjustments`”를 볼 수 있다. (`judgment:demo`·`judgment:demo:itemwiki`는 기존 코어·인스턴스 데모.)  
3. [SYNAXION_G6_METRICS_AND_RUNBOOK.md](../../analysis/SYNAXION_G6_METRICS_AND_RUNBOOK.md) Exit 체크에 PoC 달성 여부를 기록한다.

**코드**: `mergeExternalAssertionsForJudgment` + `assertion-trust-normalize.ts` — 이벤트·API 어댑터는 여기로 수집된 `ExternalAssertion[]`만 넘기면 된다.

---

## 5. 크로스 도메인 스파이크 (G6.5)

Agrinovation × ItemWiki **이벤트·trust 합의**만 문서화: [CROSS_DOMAIN_FEDERATION_SPIKE.md](../../analysis/CROSS_DOMAIN_FEDERATION_SPIKE.md).

---

## 6. 비목표

- 법적 합의·계약서 템플릿
- 블록체인·ZK 등 특정 기술 스택

**관련**: [ENGINE_INTERFACE.md](./ENGINE_INTERFACE.md), [INCOMPLETE_AND_CONFLICT.md](./INCOMPLETE_AND_CONFLICT.md), [SYNAXION_G6_METRICS_AND_RUNBOOK.md](../../analysis/SYNAXION_G6_METRICS_AND_RUNBOOK.md)

**최종 업데이트**: 2026-03-21 — §2.1 신뢰 정규화, §4 PoC 명령 `judgment:poc:federation`
