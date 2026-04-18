# 판단 진입점 정책 (필수 경로 · 금지 패턴)

**G1·1.2** — 제품 도메인에서 Synaxion 판단을 추가·변경할 때 따를 **최소 규칙**이다. 상위 맥락은 [README.md](./README.md), [ENGINE_INTERFACE.md](./ENGINE_INTERFACE.md), 인벤토리 [synaxion-judgment-path-inventory.md](../../analysis/synaxion-judgment-path-inventory.md).

---

## 필수 (SHOULD → MUST for product surface)

1. **신규 “판단이 있는” 제품 기능**은 다음 중 하나로만 엔진에 연결한다.  
   - `withJudgment(<등록된 SynaxionJudgmentContract>, ctx)`  
   - 또는 그 계약을 감싼 **단일** 퍼사드(예: `persistProductLabelDecisionJudgment`).

2. **계약 등록**은 `packages/lib/core/judgment/contracts/`에 두고, 규칙 묶음은 `itemwiki-decision-rules.json`(또는 합의된 인스턴스 경로)과 **버전·스키마**를 맞춘다.

3. **결정 레지스트리**: 사용자·감사 관점의 “판단 축”이면 `docs/itemwiki-constitution/decision-registry.json`에 ID를 추가하고, 구현 파일에서 `checkDecision('<id>')`로 고정한다.

---

## 금지 패턴 (CI: `check:judgment-contracts`, `pnpm run check:constitution-pr`에 포함)

| 패턴 | 이유 |
|------|------|
| `app/`, `components/`, `workers/`, `tests/` 등에서 `evaluateJudgment` **직접** import·호출 | 계약·검증·선행(precedence)이 우회되어 trace·스키마·레지스트리가 갈라짐 |
| API 라우트에서 규칙 JSON을 **임의로** 파싱해 분기만 하고 `withJudgment` 없이 저장 | persist·trace·replay 단일 소스가 깨짐 |
| 새 계약 없이 기존 contract의 `rules`를 라우트 내부에서 **복제·수정**해 사용 | 배포 번들과 불일치·재현 불가 |

**예외(허용 목록)**: `packages/lib/core/judgment/evaluate.ts`, `with-judgment.ts`, `replay-judgment.ts`, 및 `docs/constitution/scripts/judgment-*.ts` 데모·실험만 `evaluateJudgment` 직접 사용 가능. 목록 변경 시 스크립트 `check-judgment-contracts.ts`의 allowlist를 같이 수정한다.

---

## 리플레이·Admin

- 저장된 judgment **재평가**는 `replay-judgment` 계열만 사용한다.  
- Admin API는 DB·RPC·감사 insert에 한정하고, **새 도메인 규칙**을 인라인으로 넣지 않는다.

---

## 검증

- `pnpm run check:judgment-contracts`  
- `pnpm run check:judgment-runtime-rules`  
- PR 기본: `check:constitution-pr`에 위 스크립트 포함

**최종 수정**: 2026-03-21
