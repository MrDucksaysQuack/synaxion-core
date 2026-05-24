# Synaxion Core Readiness Scorecard

**목적**: `synaxion-core` 저장소만으로 달성 가능한 완성도를 11축 × 5점으로 자가 평가한다.  
**HTML 50점 모델**과 정렬하되, ⑥⑦⑧의 **5점**은 reference instance 또는 운영 환경이 필요함을 명시한다.

**검증 명령**: `pnpm run verify:core` (코어) · `pnpm run verify:reference` (코어 + reference/nextjs-minimal)

---

## 축별 만점 조건 (코어 repo)

| 축 | 코어 단독 5점 | 검증 |
|----|--------------|------|
| 00 Planning | `00-planning/` Forward Protocol + directory standard + harness/forward-planning | `check:core-completeness` |
| 01 Scope | `SCOPE_BOUNDARY.md` + META 링크 | `check:core-completeness` |
| 02 Constitution | 15·16·17 + UX/UI/Experience 장 | `check:core-completeness` |
| 03 Layer | `FEATURE_PLACEMENT_GUIDE.md` | `check:core-completeness` |
| 04 Contract | `CONTRACT_CHANGE_POLICY` + `check:contract-adr` (로컬 warning, CI strict) | `verify:core` |
| 05 Verification | `verify:core`에 deployment·ops functional check 포함 | `verify:core` |
| 06 UX/UI | `check:ui-*` + `check:ux-touch-targets` registry | `check:ui-scripts-registry` |
| 07 Deployment | 15장 + `check:deployment-constitution` in `verify:core`; **5점=rollout 인프라** | `verify:core` (4=상한) |
| 08 Operations | 16장 + `docs/ops/` drill·alert thresholds | `verify:core` + reference ops |
| 09 Documentation | README·VERSION = package.json `version` | `check:core-completeness` |
| 10 Reusability | 2× reference + express scaffold smoke | `verify:reference` + `verify:scaffold:express-api` |

**코어 문서만 상한**: 축 ⑥ Visual 5점(Brand Experience)은 인스턴스 Guide 필요 — [VISUAL_READINESS_RUBRIC](./13-ui-design/VISUAL_READINESS_RUBRIC.md).

---

## 현재 점수 (2026-05-24)

| 축 | 점수 | 비고 |
|----|------|------|
| 00 | 5 | 00-planning Forward + PLANNING_DIRECTORY_STANDARD |
| 01 | 5 | SCOPE_BOUNDARY |
| 02 | 5 | 15–17장 |
| 03 | 5 | FEATURE_PLACEMENT |
| 04 | 5 | contract-adr in verify:core |
| 05 | 5 | deployment·ops in verify:core |
| 06 | 5 | ux-touch-targets + ui registry |
| 07 | 4 | DEPLOY §2b — 코어 상한 4 (rollout 5=인프라) |
| 08 | 5 | ops drill-001 + ALERT_THRESHOLDS |
| 09 | 5 | VERSION ↔ package.json 2.11.0 |
| 10 | 5 | nextjs + express-api reference; scaffold smoke CI |
| **합계** | **54/55** | Core Product Complete |

`pnpm run verify:core && pnpm run verify:reference` 통과 시 위 점수 유지.

---

## 갱신

릴리스 전 이 표의 날짜·점수를 갱신한다.

**최종 업데이트**: 2026-05-24
