# 디자인·플로우 (Design & Flow)

> **범용 원칙**: 인지과학 기반 페이지·플로우 설계 원칙을 정의합니다.  
> 프로젝트별 상세(폴더 명명, 라우트 예시, 컴포넌트 이름)는 인스턴스(예: `docs/<project>-constitution/` 내 design-flow)에서 정의합니다.

---

## 📋 이 섹션에서 다루는 것

| 문서 | 역할 |
|------|------|
| [DESIGN_FLOW_PRINCIPLES.md](./DESIGN_FLOW_PRINCIPLES.md) | 한 페이지 한 목적, 3-Depth, 입구/출구, 출발점→행동→결과, 목적 기반 네비게이션, Atomic-Composite-Page, 질문에 답하는 페이지 |
| [EXPECTATION_MODEL_RULES.md](./EXPECTATION_MODEL_RULES.md) | 사용자 기대 모델, 결정/상태에 대한 근거 표시, 버튼 상태 피드백 |
| [PAGE_LAYOUT_AND_FLOW_CHECKLIST.md](./PAGE_LAYOUT_AND_FLOW_CHECKLIST.md) | **짧은 체크리스트**: 한 목적·입구/출구·주 행동·IA (구현 이름 없음) |
| *(인스턴스)* [Itemwiki 신규 페이지 설계 체크리스트](../../itemwiki-constitution/itemwiki-specific/design-flow/NEW_PAGE_DESIGN_CHECKLIST.md) | 6하·세 질문·Entry/Exit 체크리스트 (신규 페이지 설계 시) |
| *(인스턴스)* [Itemwiki 기존 페이지 Design-Flow 점검](../../itemwiki-constitution/itemwiki-specific/design-flow/EXISTING_PAGES_DESIGN_FLOW_AUDIT.md) | 기존 페이지 전수 5단계·Entry/Exit·6하·세 질문 점검 |

---

## 🧩 코어 vs 인스턴스

| 구분 | 위치 | 내용 |
|------|------|------|
| **코어 (Constitution)** | 이 폴더 `10-design-flow/` | 페이지 목적·깊이·플로우·네비게이션·입출구·컴포넌트 계층·기대 모델 **범용 원칙** |
| **인스턴스 (프로젝트별)** | `docs/<project>-constitution/` 내 design-flow, ui-ux | 구체적 라우트 경로, 폴더 명명, 페이지 유형 예시, 팀별 체크리스트 |

---

## 🔗 관련 Constitution 문서

- [FRONTEND_LAYER_PRINCIPLES.md](../07-frontend-ui/FRONTEND_LAYER_PRINCIPLES.md) — 프론트엔드 계층·데이터 흐름·상태 (구현 관점)
- [IA_NAVIGATION_PRINCIPLES.md](../07-frontend-ui/IA_NAVIGATION_PRINCIPLES.md) — 3-Depth, Hick's Law (네비게이션)
- [UX_SAFETY_RULES.md](../04-safety-standards/UX_SAFETY_RULES.md) — 네트워크·로딩 안전

---

**최종 업데이트**: 2026-04-14 — 코어 짧은 체크리스트 추가
