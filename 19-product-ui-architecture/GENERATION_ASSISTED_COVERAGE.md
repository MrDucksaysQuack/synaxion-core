# Generation-Assisted Coverage System (Ch.19)

> **Synaxion Constitution 19장**  
> **Tier**: 2 (권장) — CI `check:*`는 인스턴스가 채택 시 Tier 1로 승격 가능  
> **버전**: 2.17.0

**목적**: Ch.19를 **"complete generation formula"(완전한 페이지 생성 공식)** 가 아니라 **"generation-assisted coverage system"(생성 보조·커버리지 시스템)** 으로 정의한다.  
페이지 설계·구현에서 **인간 판단이 남아야 할 경계**를 명시하고, 그 주변을 **결정적(deterministic) 자동화**로 채운다.

---

## 1. Reframe — 무엇이 목표인가

| 비목표 (명시적) | 목표 |
|-----------------|------|
| Role×Goal×Data×Stage 카르테시안 곱에서 **모든 URL 자동 생성** | **큐레이션된 Goal**으로 게이트된 열거·공백 탐지·scaffold·drift-CI |
| Split/Tab/Modal을 **닫힌 함수**로 도출 | 6차원 **판정(judgment)** + archetype은 **scaffold 제안**까지만 |
| "공식 완성 = 모든 페이지 존재" 환상 | **map–territory drift**를 CI로 지속 탐지 |
| 인간 배제 **완전 폐루프** | **assisted, not closed** — LLM 제안 + 인간/CI 게이트 허용 |

> **핵심**: drift(mock vs live, SSOT 상속, provision 없이 라우트만 존재, 권한 미배선)의 해독제는 **생성기**가 아니라 **정합·diff 루프**다.

---

## 2. 인간이 머무는 두 자리 (의도적 경계)

| 자리 | 담당 | 이유 |
|------|------|------|
| **① Goal 큐레이션** | Product·도메인 — Role별 "해야 하는 일" 목록 | Role×Goal×Data×Stage 대부분의 셀은 **실제 페이지가 아님**. 카르테시안 폭발을 거르는 필터는 사람(또는 검증된 여정 문서)이 큐레이션한 Goal 매트릭스다. |
| **② Archetype·UX 판단** | Design·UX — Split vs Tab vs Modal, 정보 밀도 | Goal→list/detail/queue **기본형**은 제안 가능하나, **형식화 저항 영역**. 규칙을 닫으면 조합 폭발 또는 UX 평범함. |

이 경계는 **결함이 아니라 올바른 설계**다. Synaxion 6차원의 Needs Split/Tabs 판정이 judgment인 이유다.

---

## 3. 기계화하는 네 가지 (우선 ROI)

| # | 능력 | 결정성 | 설명 |
|---|------|--------|------|
| **A** | **Role×Goal SSOT (기계 판독)** | ✅ | JSON/YAML — [ROLE_GOAL_MATRIX_SCHEMA](./ROLE_GOAL_MATRIX_SCHEMA.md). Critical path·Journey에서 파생. |
| **B** | **Missing-Journey diff** | ✅ | `Curated Role×Goal − Screen Inventory` → Missing / Broken Workflow **후보** |
| **C** | **3-way drift CI** | ✅ | Role×Goal matrix ↔ Router 코드 ↔ 04 Inventory ↔ (선택) PAGE-AUDIT |
| **D** | **Scaffold 제안** | 부분 | route + guard + empty shell. 내용·Split/Tab은 PR·6차원·Ch.10 게이트 |

**Workflow Stage → Queue 페이지**: **탐지·후보 등록**까지만 자동. URL **자동 생성은 비목표**.

**Archetype 규칙**: 닫힌 도출이 아니라 **scaffold 힌트** (`suggestedArchetype: list | detail | queue | approval`).

---

## 4. 6차원과의 관계 (변경 없음, 역할 명확화)

[PAGE_DERIVATION_AND_AUDIT.md](./PAGE_DERIVATION_AND_AUDIT.md)의 6차원은 **유도·감사 렌즈**로 유지한다.

```
큐레이션된 Role×Goal (① 인간)
    → 페이지 후보 열거 (기계: A)
    → 6차원 검증·Split/Tab 판정 (② 인간 + judgment)
    → Inventory·Router 반영
    → 3-way CI (기계: C)
    → scaffold (기계: D, 선택)
    → Ch.10·Ch.18·구현
```

6차원은 **"완전 생성 공식"의 출력**이 아니라 **품질·구조 감사의 입력 축**이다.

---

## 5. MDA·model-driven UI 역사와 교훈

| 성공한 부분 | 실망한 부분 |
|------------|------------|
| scaffold, admin, CRUD 보일러플레이트 | "닫힌 모델 → 전체 UI" round-trip |
| Rails/Django admin, OpenAPI codegen | 형식화 저항 UX 결정의 붕괴 |

**LLM 시대 변수**: archetype·Split/Tab **제안**은 현실적. 단 **"결정적 공식"이 아니라 assisted loop**로 수렴한다.

다수 인스턴스·초고 churn이 아니면 **전체 폐루프 생성기**보다 **검증+scaffold+drift-CI 부분집합**이 본전이 빠르다.

---

## 6. 인스턴스 채택 체크리스트

프로파일 **M+** 권장:

1. [x] `role-goal-matrix.json` (또는 YAML) — [ROLE_GOAL_MATRIX_SCHEMA](./ROLE_GOAL_MATRIX_SCHEMA.md)
2. [x] `check:role-goal-coverage` (Missing-Journey diff + Inventory/Router 정합) — Inflomatrix ✅
3. [x] Critical path·Journey 문서가 matrix `sources`에 링크 — Inflomatrix ✅
4. [ ] 신규 P0 Goal 추가 시 matrix + `04` + `08` 동일 PR (규칙 3·7)
5. [ ] Scaffold 사용 시 Split/Tab은 6차원 표 + Ch.10 체크리스트 필수
6. [x] (v2) `workflow-queue-candidates.json` + `check:workflow-queue-coverage` — Inflomatrix ✅
7. [x] (v2) `check:page-audit-drift` — PAGE-AUDIT ↔ Router ↔ Inventory — Inflomatrix ✅
8. [x] (v2) `scaffold:gac-page` — proposal-only CLI — Inflomatrix ✅

Inflomatrix 레퍼런스: `role-goal-matrix.json` · `workflow-queue-candidates.json` · `pnpm run check:gac`

---

## 7. false-completeness 방지

| 함정 | 완화 |
|------|------|
| "matrix 100% = done" | Tier·Lane·E2E live/mock 구분 유지 (별도 SSOT) |
| "Inventory 있음 = UX 완성" | Plan Complete ≠ Implementation Ready (GOVERNANCE 규칙 4) |
| "Audit OK = 운영 공백 없음" | Missing-Journey diff는 **큐레이션된 Goal**에만 유효 — Goal 갱신은 지속 작업 |

---

## 🔗 관련 문서

- [ROLE_GOAL_MATRIX_SCHEMA.md](./ROLE_GOAL_MATRIX_SCHEMA.md) — 기계 판독 SSOT 스키마  
- [PAGE_DERIVATION_AND_AUDIT.md](./PAGE_DERIVATION_AND_AUDIT.md) — 6차원 감사  
- [GOVERNANCE.md](./GOVERNANCE.md) — 규칙 6·7·비목표  
- [README.md](./README.md) — Ch.19 개요  

---

**최종 업데이트**: 2026-06-18 — 2.17.0 GAC reframe (Inflomatrix drift 실증)
