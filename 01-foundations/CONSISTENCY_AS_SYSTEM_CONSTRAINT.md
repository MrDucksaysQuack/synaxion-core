# Consistency as a System Constraint
# 일관성은 시스템 제약이다

> **일관성은 기능이 아니라 시스템 속성이다.**  
> Synaxion(이 저장소의 `docs/constitution/`)에서 말하는 **운영 원리**로 둔다.  
> 아래 원리는 **프로젝트 성과 요약**이 아니라, **모순을 구조적으로 허용하지 않는** 설계 스탠스의 선언이다.

**Tier**: 2 (권장·아키텍처 원리) — 전부를 `check:*`로 자동화할 수는 없으나, 인스턴스(예: Itemwiki)에서는 동일 철학이 CI·계약·Critical 범위로 **구체화**된다.  
**연계**: [META_CONSTITUTION.md](../META_CONSTITUTION.md) §0.2 · [PHILOSOPHY.md](../00-overview/PHILOSOPHY.md) (구조 우선) · [STRUCTURE_FIRST_PRINCIPLE.md](./STRUCTURE_FIRST_PRINCIPLE.md)

**최종 업데이트**: 2026-03-28

---

## 1. 기존 문제

많은 시스템은 이렇게 서술된다.

- UI·API·DB·UX가 **서로 맞기를 기대**한다.
- 팀은 **문서와 리뷰**로 일관성을 쫓는다.

그러나 **기대**는 깨지기 쉽다. 스키마가 드리프트하고, 경계가 흐려지고, “한 번만 예외”가 쌓이면 **모순이 런타임에 남는다**.

---

## 2. 전환: 일관성을 강제한다

**일관성은 설계 의도로 남기지 않는다. 머지·실행 단계에서 위반할 수 없게 만든다.**

- **틀린 구조**가 저장소에 들어오지 못하게 하고(빌드·정적 게이트),
- **틀린 상태**가 핵심 흐름에서 장기간 존재하지 못하게 한다(런타임 계약·선택적 절대성).

이 문서는 그 전환을 **Synaxion 수준의 원리**로 고정한다.

---

## 3. 운영 원리 (Principles)

### Principle 1 — Consistency Enforcement (일관성 강제)

시스템의 일관성은 **보장되는 것**이 아니라 **강제되어야** 한다.

올바른 상태를 **기대**하는 것이 아니라, 잘못된 상태가 **존재할 수 없도록** 만들어야 한다.

---

### Principle 2 — Build vs Runtime Truth (빌드 진실과 런타임 진실)

**Build** 단계에서는 틀린 **구조**가 들어올 수 없어야 하고,  
**Runtime** 단계에서는 틀린 **상태**가 (합의된 핵심 범위 안에서) 존재할 수 없어야 한다.

이 두 축이 동시에 만족될 때, 시스템은 **자기 정합성**을 가진다.

---

### Principle 3 — Selective Absoluteness (선택적 절대성)

모든 영역을 완벽하게 만드는 것은 비현실적이다.

대신, **사용자의 신뢰가 걸린 핵심 흐름**만을 선택하여, 그 영역에서는 **절대적으로 틀릴 수 없도록** 만든다.

→ 이것이 “전 수 증명”이 아니라 **Critical 경로·부록·게이트**로 범위를 고정하는 이유다. (무한한 완벽 주장을 하지 않고, **선택한 곳에서는 타협하지 않는다**.)

---

### Principle 4 — System > Developer (시스템이 개발자보다 앞선다)

버그를 **고치는 것**은 사람의 역할이다.  
버그가 **존재할 수 없게 만드는 것**은 시스템의 역할이다.

리뷰와 훈련은 필요하지만, **최종 방어선은 자동 검증과 계약**이어야 한다.

---

## 4. 같은 철학, 다른 초점 (생태계 정렬)

이 원리는 **한 제품의 홍보 문구**가 아니라, 구조를 신뢰의 대상으로 옮기는 공통 방향이다.

| 초점 | 한 줄 |
|------|--------|
| **Agrinovation** | 사람을 믿지 않는다 → **구조**를 믿는다 |
| **Synaptree** | 기억을 신뢰하지 않는다 → **구조화된 기록**을 신뢰한다 |
| **Itemwiki** | 데이터를 맹신하지 않는다 → **계약·게이트·합의된 Critical 범위**를 신뢰한다 |

**Synaxion**은 여기서 **철학과 운영 규칙의 층**(문서·Tier·Judgment·Engineering)을 맡고, **Itemwiki**는 동일 원리가 **코드·CI·E2E**로 내려온 **인스턴스 증명** 역할을 한다.

---

## 5. 구현 지도 — Itemwiki 인스턴스 (증명이 아니라 고정점)

이 저장소의 Itemwiki 쪽에서는 위 원리가 대략 다음 **메커니즘**으로 드러난다. (전수 목록이 아니라 **방향**을 보여 주는 샘플이다.)

| 원리 | Itemwiki에서의 대응(예) |
|------|-------------------------|
| 강제 | Zod·`parse*FromUnknown`·슬라이스 계약, `form-to-patch` 경계, `check:*` 스크립트 |
| Build 진실 | 레이어 경계, alignment·골든·레지스트리, constitution-pr |
| Runtime (선택적 절대성) | [FINAL_3_REMAINING_GUARANTEES.md](../../itemwiki-constitution/itemwiki-specific/input-persistence/FINAL_3_REMAINING_GUARANTEES.md) — ① Runtime parse **부록 C**, ② Multi UX **부록 A**, ③ Critical E2E **부록 B**; “모든 읽기 100%”는 **비목표** |
| 시스템 > 개발자 | 동일 문서의 `check:final3-*`·고위험 MULTI 계약 검사·authority E2E 등 |

합의된 **OS급 서사와의 간격**은 [OS_GRADE_GAP_ANALYSIS.md](../../itemwiki-constitution/itemwiki-specific/input-persistence/OS_GRADE_GAP_ANALYSIS.md)에서 정직하게 구분한다 — “다 했다”가 아니라 **무엇을 게이트로 닫았는지**를 말한다.

---

## 6. 결론

- **추가하는 것**(문서·게이트·부록)은 맞다. 다만 **성과 나열**에 머무르면 약해진다.
- **의미 있는 추가**는 “우리가 잘했다”가 아니라, **일관성을 시스템 제약으로 승격**했는지 여부다.

**한 줄**: 이 접근은 기능 추가가 아니라, **Synaxion의 핵심 원리를 현실에서 증명한 인스턴스**로 읽을 때 힘을 갖는다.

---

## 7. 읽을 순서 제안

1. 본 문서(운영 원리)  
2. [META_CONSTITUTION.md](../META_CONSTITUTION.md) — Tier·층 A/B·변경 절차  
3. (Itemwiki) [FINAL_3_REMAINING_GUARANTEES.md](../../itemwiki-constitution/itemwiki-specific/input-persistence/FINAL_3_REMAINING_GUARANTEES.md) — 3축·부록 A/B/C
