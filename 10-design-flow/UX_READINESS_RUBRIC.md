# UX Readiness Rubric

**목적**: 프로젝트의 UX 완성도를 5점 척도로 자가 평가한다.
         이 점수는 CI 게이트가 아니라 팀의 자가 진단 도구다.

---

## 채점표

| 점수 | 기준 |
|------|------|
| 0 | 화면은 있으나 사용자 여정이 없다. UX 문서 없음 |
| 1 | 주요 화면은 있으나 상태 처리(loading/error/empty)가 없다 |
| 2 | 기본 flow, primary CTA, error 상태가 있다 |
| 3 | UX Constitution §1 7개 규칙을 모두 만족한다 |
| 4 | **여정 인덱스**가 존재하고 (02 Journey Maps에 주요 역할별 여정 N개 이상), **복구 여정** 최소 2건이 문서화되어 있으며, **추적 표**(08 Traceability 또는 상당 문서)가 화면↔spec을 연결한다. **프로파일 M+**에서는 [PAGE-AUDIT-MATRIX](../19-product-ui-architecture/PAGE_AUDIT_MATRIX.template.md)로 주요 화면 6차원·감사 판정이 기록되어 있다. 접근성 기준 통과. |
| 5 | 실제 사용자 피드백 또는 프로토타입 검증까지 반영되어 있다 (프로젝트별) |

**Synaxion 최소 요구 기준**: 3점
**출시 권장 기준**: 4점
**5점은 프로젝트별 UX Research Guide 영역** — Synaxion 강제 범위 외

> **4점 구조 기준 상세** (Ch.19 Product UI Architecture 연동):  
> - 여정 인덱스: `02-JOURNEY-MAPS.md`에 역할별 여정이 나열되고, 각 여정이 화면 경로와 연결됨  
> - 복구 여정: `02-RECOVERY-JOURNEYS.md`에 최소 2건 (R-인증 계열 1건 + R-도메인 계열 1건 이상)  
> - 추적 표: `08-TRACEABILITY.md` 또는 상당 문서에서 "화면 → journey spec → 구현 파일" 경로가 추적 가능  
> - 6차원 감사: [PAGE_DERIVATION_AND_AUDIT.md](../19-product-ui-architecture/PAGE_DERIVATION_AND_AUDIT.md) · `PAGE-AUDIT-MATRIX` (프로파일 M+)

---

## 사용 방법

1. 릴리스 전 또는 주요 기능 추가 시 팀이 자가 평가한다
2. 3점 미만이면 UX Constitution §1 규칙 중 누락 항목을 확인한다
3. 점수를 V1_COMPLETION_CONTRACT 또는 프로젝트별 completion document에 기록한다

**최종 업데이트**: 2026-06-16 — 4점 기준에 6차원 감사 매트릭스 연동
