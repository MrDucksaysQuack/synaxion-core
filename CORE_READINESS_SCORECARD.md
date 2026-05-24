# Synaxion Core Readiness Scorecard

**목적**: `synaxion-core` 저장소만으로 달성 가능한 완성도를 10축 × 5점으로 자가 평가한다.  
**HTML 50점 모델**과 정렬하되, ⑥⑦⑧의 **5점**은 reference instance 또는 운영 환경이 필요함을 명시한다.

**검증 명령**: `pnpm run verify:core` (코어) · `pnpm run verify:reference` (코어 + reference/nextjs-minimal)

---

## 축별 만점 조건 (코어 repo)

| 축 | 코어 단독 5점 | 검증 |
|----|--------------|------|
| 01 Scope | `SCOPE_BOUNDARY.md` + META 링크 | `check:core-completeness` |
| 02 Constitution | 15·16·17 + UX/UI/Experience 장 | `check:core-completeness` |
| 03 Layer | `FEATURE_PLACEMENT_GUIDE.md` | `check:core-completeness` |
| 04 Contract | `CONTRACT_CHANGE_POLICY` + 템플릿 + `check:contract-adr` reference | `verify:reference` |
| 05 Verification | `verification/` SSOT + `verify:core` | CI `verify-core.yml` |
| 06 UX/UI | `check:ui-*` reference 스크립트 존재 | `check:ui-scripts-registry` |
| 07 Deployment | 15장 + reference에서 DEPLOY-01~08 | `verify:reference` |
| 08 Operations | 16장 + reference에서 OPS-01~09 문서 | `verify:reference` |
| 09 Documentation | README 목차·VERIFICATION_SCRIPTS Tier1 | `check:core-completeness` |
| 10 Reusability | profiles + `PROJECT_DEPLOYMENT_EXAMPLE` + reference | `verify:reference` |

**코어 문서만 상한**: 축 ⑥ Visual 5점(Brand Experience)은 인스턴스 Guide 필요 — [VISUAL_READINESS_RUBRIC](./13-ui-design/VISUAL_READINESS_RUBRIC.md).

---

## 현재 점수 (2026-05-24)

| 축 | 점수 | 비고 |
|----|------|------|
| 01 | 5 | SCOPE_BOUNDARY |
| 02 | 5 | 15–17장 |
| 03 | 5 | FEATURE_PLACEMENT |
| 04 | 5 | CONTRACT_CHANGE_POLICY + verification |
| 05 | 5 | verify:core CI |
| 06 | 4 | ui reference scripts; brand 5 = instance |
| 07 | 4 | reference DEPLOY; rollout 5 = infra |
| 08 | 4 | reference OPS docs; drill 5 = ops |
| 09 | 5 | README + Tier1 inventory |
| 10 | 4 | reference 1건; 2nd profile CI TBD |
| **합계** | **46/50** | Core Product Complete |

`pnpm run verify:core && pnpm run verify:reference` 통과 시 위 점수 유지.

---

## 갱신

릴리스 전 이 표의 날짜·점수를 갱신한다.

**최종 업데이트**: 2026-05-24
