# Check Tier Manifest
# 검증 레인 매니페스트

> **quick · pr · release 검증 묶음을 SSOT로 선언한다. 개발자가 "무엇을 언제 돌릴지" 기억하지 않게 한다.**

**Tier**: 2 (권장 · 2.18.0)  
**연계**: [VERIFICATION_FRAMEWORK.md](./VERIFICATION_FRAMEWORK.md) · [VERIFICATION_SCRIPTS.md](./VERIFICATION_SCRIPTS.md)

**최종 업데이트**: 2026-06-23

---

## 1. 표준 레인

| 레인 | 목적 |典型 구성 | 소요 목표 |
|------|------|-----------|-----------|
| **quick** | 로컬 반복 — 구조·타입 | layer-boundaries, constitution-version, type-check | < 2 min |
| **pr** | 머지 게이트 — `check:constitution-pr` 동등 | Tier 1 safety + decision-registry | < 15 min |
| **release** | 배포 전 — `check:all` + E2E smoke | full matrix alignment + staging | 팀 정책 |

인스턴스는 `package.json`에 `check:quick`, `check:pr`, `check:all`을 정의하고, **manifest 스크립트**로 표를 출력한다.

---

## 2. Manifest 출력 (인스턴스 패턴)

```
check:tiers  →  scripts/print-check-tier-manifest.ts
```

출력 예:

```
Lane quick:  check:constitution-version, check:layer-boundaries, …
Lane pr:     check:constitution-pr
Lane release: check:all, test:e2e:staging
```

---

## 3. 규칙

1. **pr ⊂ release** — PR 레인 스크립트는 release 레인에 포함되어야 한다.
2. **신규 Tier-1 gate**는 pr 레인에 편입 전 warn ratchet을 거친다.
3. 레인 변경은 README 또는 `VERIFICATION_ALIGNMENT`에 기록한다.

---

**실증**: Inflomatrix `print-check-tier-manifest.ts`, harness `check:quick` (2026-06)
