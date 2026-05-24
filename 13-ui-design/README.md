# UI 디자인 헌법 (UI Design Constitution)

> **범용 원칙**: 시각 표현 레이어의 계층 질서를 정의한다.  
> 토큰 값은 프로젝트마다 다를 수 있다. 토큰의 구조와 의존 규칙은 변경 불가다.  
> 이 장은 Synaxion Engineering Constitution(층 A)의 시각 확장이며 독립 운영되지 않는다.

---

## 📋 이 섹션에서 다루는 것

| 문서 | 역할 |
|------|------|
| [UI_DESIGN_CONSTITUTION.md](./UI_DESIGN_CONSTITUTION.md) | 토큰 아키텍처 (3-tier), 색상·테마 원칙, 타이포그래피, 공간 시스템, 형태 언어, 모션, 상태 표현, 이미지·미디어, 금지 규칙, 검증 |

---

## 🧩 코어 vs 인스턴스

| 구분 | 위치 | 내용 |
|------|------|------|
| **코어 (Constitution)** | 이 폴더 `13-ui-design/` | 토큰 tier 구조, 의존 방향, theme 재매핑 원칙, 접근성 상태 규칙 — **보편 원칙** |
| **인스턴스 (프로젝트별)** | `docs/<project>-constitution/` 내 ui-design | 실제 토큰 값, 브랜드 색상, 컴포넌트 스펙, 프로젝트 check:* 설정 |

---

## 🔗 관련 Constitution 문서

- [01-foundations/LAYER_BOUNDARIES.md](../01-foundations/LAYER_BOUNDARIES.md) — UI Token Layer의 계층 내 위치
- [07-frontend-ui/FRONTEND_LAYER_PRINCIPLES.md](../07-frontend-ui/FRONTEND_LAYER_PRINCIPLES.md) — 프론트엔드 레이어 원칙
- [07-frontend-ui/UX_FEEDBACK_AND_ACCESSIBILITY.md](../07-frontend-ui/UX_FEEDBACK_AND_ACCESSIBILITY.md) — 접근성 기본 원칙
- [10-design-flow/DESIGN_FLOW_PRINCIPLES.md](../10-design-flow/DESIGN_FLOW_PRINCIPLES.md) — 페이지·플로 설계 원칙
- [06-automation/VERIFICATION_SCRIPTS.md](../06-automation/VERIFICATION_SCRIPTS.md) — 검증 스크립트 등록 규칙

---

**최종 업데이트**: 2026-05-24 — 초기 제정
