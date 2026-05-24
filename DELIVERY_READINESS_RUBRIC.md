# Delivery Readiness Rubric

**목적**: ②③⑧⑨ 4개 영역의 완성도를 하나의 평가표로 통합한다.
         이 점수는 CI 게이트가 아니라 출시 판단을 위한 자가 진단 도구다.

---

## 개요

```
Product Delivery Completeness =
  UX Readiness (25%)
+ Visual Readiness (20%)
+ Deployment Readiness (30%)
+ Operations Readiness (25%)
```

각 영역은 0–5점. 가중치를 곱한 합산으로 최종 등급을 산정한다.

---

## 영역별 루브릭 참조

| 영역 | 루브릭 문서 | Synaxion 최소 기준 | 가중치 |
|------|-----------|-------------------|--------|
| ② UX Design | [10-design-flow/UX_READINESS_RUBRIC.md](./10-design-flow/UX_READINESS_RUBRIC.md) | 3점 | 25% |
| ③ Visual Design | [13-ui-design/VISUAL_READINESS_RUBRIC.md](./13-ui-design/VISUAL_READINESS_RUBRIC.md) | 4점 | 20% |
| ⑧ Deployment | [15-deployment/DEPLOYMENT_READINESS_RUBRIC.md](./15-deployment/DEPLOYMENT_READINESS_RUBRIC.md) | 4점 | 30% |
| ⑨ Operations | [16-operations/OPERATIONS_READINESS_RUBRIC.md](./16-operations/OPERATIONS_READINESS_RUBRIC.md) | 4점 | 25% |

---

## 합산 등급

| 가중 평균 | 등급 |
|----------|------|
| 0.0 – 1.9 | Concept |
| 2.0 – 2.9 | Prototype |
| 3.0 – 3.4 | Internal Beta |
| 3.5 – 4.2 | Release Candidate |
| 4.3 – 5.0 | Production Grade |

**Production 출시 최소 기준**: 가중 평균 ≥ 3.5 AND 각 영역이 최소 기준 이상

---

## 사용 방법

1. 릴리스 전 각 영역 루브릭을 참조하여 점수를 매긴다
2. 아래 계산식으로 합산한다:
   ```
   score = UX×0.25 + Visual×0.20 + Deployment×0.30 + Operations×0.25
   ```
3. 점수와 날짜를 프로젝트의 completion document(예: V1_COMPLETION_CONTRACT.md)에 기록한다
4. 최소 기준 미달 영역은 출시 전 보완한다

---

## 예시: Truefarm Website v1.0 자가 평가 (2026-05-24 기준)

| 영역 | 점수 | 비고 |
|------|------|------|
| UX Design | 2 | UX Constitution 없었음 → 신설로 3점 목표 |
| Visual Design | 3 | 토큰 시스템 있음, raw value check 미완 |
| Deployment | 2 | CI 있으나 smoke test, rollback 미완 |
| Operations | 2 | Sentry 있으나 SLO, runbook 없음 |
| **가중 합산** | **2.3** | **Internal Beta 수준** |

**최종 업데이트**: 2026-05-24
