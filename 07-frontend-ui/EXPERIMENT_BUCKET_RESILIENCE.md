# A/B·실험 버킷 내성 (Experiment bucket resilience)

**목적**: 클라이언트 실험·variant 분기가 **SSR·storage 장애**에서도 안전하게 동작하고, 할당 로직과 렌더 결정이 섞이지 않게 한다.

**Tier**: **Tier 3** (참고 — A/B·질문 엔진 variant가 있는 제품)

---

## 1. 안전 기본 버킷 (Fail-soft assignment)

> **Storage·SSR 접근이 불가하면 기본 버킷(예: `"a"`)으로 폴백한다.**

- `typeof window === "undefined"` (SSR) → 기본 버킷.
- `sessionStorage`/`localStorage` **quota·private mode·예외** → 기본 버킷, **예외를 삼키지 않고** 필요 시 개발 로그만.
- 기본 버킷은 **통제군·기존 UX**에 해당해야 하며, 실험군만의 breaking UI를 기본에 두지 않는다.

---

## 2. 할당과 렌더 분리

| 책임 | 함수·모듈 (예시 이름) | 역할 |
|------|----------------------|------|
| **할당** | `getClientExperimentBucket()` | 사용자·세션에 버킷 `"a"` \| `"b"` 부여·복원 |
| **렌더 결정** | `groupMatchesVariant(groupVariant, bucket)` | 질문 그룹·섹션의 `variant` 메타와 버킷 매칭 |

**규칙**

- 버킷 키는 **major 버전 접미사**(`_v1`)를 키에 포함해 실험 정의 변경 시 재할당 정책을 분리한다.
- `groupVariant`가 없거나 `"default"`이면 **모든 버킷에 표시**한다.
- 서버 측 실험 할당이 도입되면, 클라이언트 임시 버킷과 **충돌 규칙**(서버 우선 등)을 인스턴스 문서에 명시한다.

---

## 3. 관측

- 분석 이벤트·이탈 추적 파라미터에 `experiment_bucket`을 포함해 **variant별 퍼널**을 비교한다 — [LOGGING_OBSERVABILITY_PRINCIPLES.md](../09-observability/LOGGING_OBSERVABILITY_PRINCIPLES.md) §6.

---

## 인스턴스 참고

- truefarm `experiment.ts`: `BUCKET_KEY`, `getClientExperimentBucket`, `groupMatchesVariant`.

---

## 🔗 관련 문서

- [UX_FEEDBACK_AND_ACCESSIBILITY.md](./UX_FEEDBACK_AND_ACCESSIBILITY.md) — 폼·위저드 이탈 관측  
- [STATE_MANAGEMENT_PRINCIPLES.md](./STATE_MANAGEMENT_PRINCIPLES.md) — 클라이언트 상태  

---

**최종 업데이트**: 2026-05-23
