# Judgment Constitution (판단 헌법)

> **Synaxion 층 B** — **출력 타입을 먼저** 고정하고, ERIC·규칙·플로·연합을 그에 맞춘다.  
> **층 A**는 `00~11`, 레이어, API, 테스트, `decision-registry`이다.

**Tier**: 기본 **Tier 3**. 성숙 시 Tier 2·PR 게이트 확대는 팀 정책. **문서 vs 스키마·JSON·CI 강제** 구분은 [META_CONSTITUTION.md](../META_CONSTITUTION.md) §1.1.

---

## 권장 적용 순서 (문서·제품 공통)

실행 에너지를 **출력 타입 → 입력 구조 → 규칙 → 플로 → 연합 → 검증** 순으로 쓴다.

1. **헌법 두 층 선언** — [README.md](../README.md), [META_CONSTITUTION.md](../META_CONSTITUTION.md) §0  
2. **Judgment Output Type 고정** — [JUDGMENT_OUTPUT_TYPE.md](./JUDGMENT_OUTPUT_TYPE.md) + [judgment-output.schema.json](../judgment-output.schema.json)  
3. **ERIC_SPEC** — [ERIC_SPEC.md](./ERIC_SPEC.md)  
4. **Decision Rule 예시** — [decision-rules.example.json](../decision-rules.example.json), 인스턴스(예: [itemwiki](../../itemwiki-constitution/decision-rules.json))  
5. **Data Flow** — [JUDGMENT_DATA_FLOW.md](./JUDGMENT_DATA_FLOW.md) (자동 허용·거부·보류·인간 검토 네 갈래; 스냅샷 정책 §표)  
6. **Replay·감사** — [REPLAY_POLICY.md](./REPLAY_POLICY.md) (리플레이 저장·원본 judgment 불변) · [REPLAY_DIFF_CONSUMER.md](./REPLAY_DIFF_CONSUMER.md) · [BATCH_REPLAY_OPS.md](./BATCH_REPLAY_OPS.md)  
7. **Federation** — [JUDGMENT_FEDERATION.md](./JUDGMENT_FEDERATION.md) · G6 메트릭/런북 [SYNAXION_G6_METRICS_AND_RUNBOOK.md](../../analysis/SYNAXION_G6_METRICS_AND_RUNBOOK.md)  
8. **`check:*` 연동** — `check:decision-rules` 등. 코어 예시 검증은 가볍게 유지 가능; 인스턴스 규칙 검증은 별도 스크립트로 단계적 도입.  
9. **엔진 참조 구현** — [ENGINE_EVALUATION.md](./ENGINE_EVALUATION.md), [EVIDENCE_AND_TRACE.md](./EVIDENCE_AND_TRACE.md), [MULTI_MATCH_EXPERIMENT.md](./MULTI_MATCH_EXPERIMENT.md), 코드 `packages/lib/core/judgment/`, 데모 `pnpm run judgment:demo`.

---

## 문서 목록 (읽기 순서 권장)

| 순서 | 문서 | 역할 |
|------|------|------|
| 0 | [CONSUMER_DECISION_CONTRACT.md](./CONSUMER_DECISION_CONTRACT.md) | **ItemWiki 소비자 경로**: 판단은 `Decision[]`만 — CI `check:consumer-facing-judgment-decision-only` |
| 1 | [JUDGMENT_OUTPUT_TYPE.md](./JUDGMENT_OUTPUT_TYPE.md) | outcome·confidence·evidence·nextAction·version·설계 질문 5개 |
| 2 | [ERIC_SPEC.md](./ERIC_SPEC.md) | E/R/C/I 정의·중복 시 우선 규칙 |
| 3 | [DECISION_RULES.md](./DECISION_RULES.md) | 규칙 JSON·Registry 관계·마이그레이션 |
| 4 | [JUDGMENT_ENTRYPOINT_POLICY.md](./JUDGMENT_ENTRYPOINT_POLICY.md) | 제품 도메인 진입점·금지 패턴·CI (`check:judgment-contracts`) |
| 5 | [JUDGMENT_DATA_FLOW.md](./JUDGMENT_DATA_FLOW.md) | 수집→정규화→규칙→판단→감사 |
| 6 | [REPLAY_POLICY.md](./REPLAY_POLICY.md) | 리플레이·감사 테이블·원본 불변 |
| 6b | [REPLAY_DIFF_CONSUMER.md](./REPLAY_DIFF_CONSUMER.md) | baseline/replayed/diff·귀속 필드 읽기 |
| 6c | [BATCH_REPLAY_OPS.md](./BATCH_REPLAY_OPS.md) | 배치 API·`persist_skipped_reason`·재시도 |
| 7 | [ENGINE_INTERFACE.md](./ENGINE_INTERFACE.md) | JudgmentResult 요약 |
| 8 | [INCOMPLETE_AND_CONFLICT.md](./INCOMPLETE_AND_CONFLICT.md) | Engineering 문서 ↔ outcome 매핑 |
| 9 | [JUDGMENT_FEDERATION.md](./JUDGMENT_FEDERATION.md) | 연합·신뢰·시나리오 |
| 10 | [ENGINE_EVALUATION.md](./ENGINE_EVALUATION.md) | 평가 순서 · 충돌 · confidence v0 |
| 11 | [EVIDENCE_AND_TRACE.md](./EVIDENCE_AND_TRACE.md) | evidenceIds · trace · 그래프 v0 |
| 12 | [MULTI_MATCH_EXPERIMENT.md](./MULTI_MATCH_EXPERIMENT.md) | veto-first · weighted-max |

---

## 스키마·검증

| 파일 | 역할 |
|------|------|
| [judgment-output.schema.json](../judgment-output.schema.json) | 런타임 판단 객체 |
| [decision-rules.schema.json](../decision-rules.schema.json) | 규칙 파일 |
| [decision-rules.example.json](../decision-rules.example.json) | 코어 예시 |

```bash
pnpm run check:decision-rules
pnpm run check:decision-rules:itemwiki
pnpm run check:judgment-contracts
pnpm run check:judgment-runtime-rules
pnpm run judgment:demo
pnpm run judgment:demo:itemwiki
pnpm run judgment:poc:federation
```

- Multi-match: [MULTI_MATCH_EXPERIMENT.md](./MULTI_MATCH_EXPERIMENT.md)
- 포맷터: `judgmentToStructuredLog` / `judgmentToPlainText` / `judgmentToMarkdown` ([format-judgment-log.ts](../../../packages/lib/core/judgment/format-judgment-log.ts))

---

## 휴먼 루프 (운영 → 규칙 개선)

`approve` / `reject` / `override` 이후 **이슈·PR로 추적**하려면 [docs/flow/SYNAXION_HUMAN_LOOP_WORKFLOW.md](../../flow/SYNAXION_HUMAN_LOOP_WORKFLOW.md) (G5).  
제안 페이로드 스키마: [rule-change-proposal.schema.json](../../itemwiki-constitution/rule-change-proposal.schema.json).  
Decision Registry id: `synaxion-operator-followup`.

---

## Itemwiki rollout documentation map

**역할**: Itemwiki가 Synaxion(판단·감사·리플레이)과 **소비자 게이트**를 **여러 축**(API, 어드민, 파이프라인, 운영)에 붙인 **전략·로드맵·런북**을 한눈에 찾기 위한 **문서 인덱스**다.  
**원칙**: 여기서는 **계약·스키마를 새로 정의하지 않는다**. 형식·정책은 위 §권장 적용 순서·`JUDGMENT_*`·`REPLAY_*` 문서와 [EVOLUTION_STRATEGY.md](../EVOLUTION_STRATEGY.md) §7의 **코어 vs 인스턴스** 표를 따른다. 본 절 내용은 이식 시 **필수가 아님**(다른 프로젝트는 표를 비우거나 자체 링크로 교체).

| 목적 | 문서 |
|------|------|
| Consumer 파이프라인 ↔ Synaxion **수렴·페이즈** | [CONSUMER_PIPELINE_SYNAXION_CONVERGENCE_PLAN.md](../../analysis/CONSUMER_PIPELINE_SYNAXION_CONVERGENCE_PLAN.md) |
| 소비자 경로 Gate vs Rank 개요 | [CONSUMER_GATE_AND_RANK.md](../../architecture/CONSUMER_GATE_AND_RANK.md) |
| Judgment 경로 vs 소비자 게이트 **분기·인벤토리** | [JUDGMENT_VS_CONSUMER_GATE_PATHS.md](../../architecture/JUDGMENT_VS_CONSUMER_GATE_PATHS.md) |
| 데이터 플로우 **두 감사 트랙** 요약(본 헌법 부록) | [JUDGMENT_DATA_FLOW.md](./JUDGMENT_DATA_FLOW.md) §6 |
| G6 — 판단 헌법·런타임·관리 UI **정합 체크리스트** | [GROUP-06-judgment-synaxion.md](../../itemwiki-constitution/parallel-assessment/GROUP-06-judgment-synaxion.md) |
| 자동 판단·규칙 엔진 **신뢰 한계** | [TRUST_BOUNDARY_DECLARATION.md](../../itemwiki-constitution/itemwiki-specific/architecture/TRUST_BOUNDARY_DECLARATION.md) §4 |
| 운영 환경·DB 마이그레이션·SLO | [SYNAXION_OPERATIONS_ENV_SETUP.md](../../deployment/SYNAXION_OPERATIONS_ENV_SETUP.md), [SYNAXION_DB_MIGRATIONS.md](../../deployment/SYNAXION_DB_MIGRATIONS.md), [SYNAXION_JUDGMENTS_SLO_RUNBOOK.md](../../deployment/SYNAXION_JUDGMENTS_SLO_RUNBOOK.md) |
| G6 메트릭·런북(분석) | [SYNAXION_G6_METRICS_AND_RUNBOOK.md](../../analysis/SYNAXION_G6_METRICS_AND_RUNBOOK.md) |
| 휴먼 루프(운영자 → 이슈·규칙 변경) | [SYNAXION_HUMAN_LOOP_WORKFLOW.md](../../flow/SYNAXION_HUMAN_LOOP_WORKFLOW.md) |

---

## 상위 문서

- [README.md](../README.md) — Synaxion 두 층  
- [META_CONSTITUTION.md](../META_CONSTITUTION.md)  
- [EVOLUTION_STRATEGY.md](../EVOLUTION_STRATEGY.md) §7  

**최종 업데이트**: 2026-03-21 — Itemwiki rollout documentation map § 추가
