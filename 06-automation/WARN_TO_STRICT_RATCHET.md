# Warn-to-Strict Ratchet
# 경고→엄격 승격 래칫

> **새 CI 게이트는 warn으로 베이스라인을 측정한 뒤, 0 위반 시 strict로 승격한다.**

**Tier**: 2 (권장 · 2.18.0)  
**연계**: [N_WAY_CONSISTENCY_GATE.md](../01-foundations/N_WAY_CONSISTENCY_GATE.md) Principle 3 · [META_GATE_TELEMETRY.md](./META_GATE_TELEMETRY.md)

**최종 업데이트**: 2026-06-23

---

## 1. 절차

| 단계 | 행동 | CI |
|------|------|-----|
| 1. Introduce | 스크립트 추가, `--warn` 또는 `check:*:warn` | exit 0, 위반 로그 |
| 2. Baseline | 위반 건수·파일 목록을 PR/이슈에 기록 | — |
| 3. Burn-down | 터치-it로 위반 제거 | warn 유지 |
| 4. Ratchet | 위반 0 확인 후 `check:all` / `check:constitution-pr`에 strict 편입 | exit 1 on violation |
| 5. Telemetry | `📊 scanned: N` 발행 ([META_GATE_TELEMETRY](./META_GATE_TELEMETRY.md)) | `check:gate-coverage` |

---

## 2. 승격 PR 체크리스트

- [ ] warn 모드에서 **0 violations** 스크린샷 또는 CI 로그
- [ ] `package.json` script alias (`:warn` → default strict) 갱신
- [ ] [VERIFICATION_SCRIPTS.md](./VERIFICATION_SCRIPTS.md) 인벤토리 갱신
- [ ] 인스턴스 decision-registry `verificationScript` 갱신 (해당 시)

---

## 3. 역승격 금지

strict 편입 후 baseline을 `--warn`으로 되돌리지 않는다. 새 위반은 **수정** 또는 **명시적 exempt** (ADR)만 허용.

---

**실증**: Inflomatrix `page-execution-contracts`, `perf-p0-registry`, matrix alignment gates (2026-05~06)
