# Synaxion Core Verification

프로젝트 인스턴스(Truefarm 등)가 복사·확장하는 **reference `check:*` 구현**의 SSOT.

## 명령

| 스크립트 | 범위 |
|----------|------|
| `pnpm run verify:core` | 코어 문서·verification 패키지 자체 |
| `pnpm run verify:reference` | 코어 + `reference/nextjs-minimal` 인스턴스 검사 |

## 환경 변수

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `SYNAXION_PROJECT_ROOT` | `reference/nextjs-minimal` | 인스턴스 프로젝트 루트 (상대 또는 절대) |
| `SYNAXION_CONSTITUTION_DIR` | (자동 탐지) | `docs/*-constitution` |

## 인스턴스에 복사

```bash
cp synaxion-core/verification/check-deployment-*.mjs scripts/
cp synaxion-core/verification/lib/paths.mjs scripts/lib/  # optional
```

또는 `package.json`에서 `node synaxion-core/verification/check-….mjs`를 직접 호출하고 `SYNAXION_PROJECT_ROOT=.` 설정.

## 스크립트 ↔ 헌법

| 스크립트 | 헌법 |
|----------|------|
| `check:core-completeness` | 코어 필수 문서 |
| `check:ui-scripts-registry` | UI_DESIGN_CONSTITUTION `check:ui-*` |
| `check:deployment-constitution` | 15-deployment §1 hard rules |
| `check:ops-constitution` | 16-operations §1 hard rules |
| `check:contract-adr` | CONTRACT_CHANGE_POLICY |

**최종 업데이트**: 2026-05-24
