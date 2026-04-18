# Replay diff 소비자 가이드 (UI·알림·API 클라이언트)

> **목적**: `synaxion_judgment_replays` 및 단건/배치 리플레이 API 응답의 **`baseline_summary` · `replayed_summary` · `diff`**(및 귀속 필드)를 동일 의미로 읽는다.

**관련**: [REPLAY_POLICY.md](./REPLAY_POLICY.md) · [BATCH_REPLAY_OPS.md](./BATCH_REPLAY_OPS.md) · [JUDGMENT_DATA_FLOW.md](./JUDGMENT_DATA_FLOW.md) §4.2

---

## 1. 필드 역할

| 필드 | 의미 | 소비 시 주의 |
|------|------|----------------|
| **baseline_summary** | 저장 시점 평가 결과의 **요약** (outcome, confidence, 적용 규칙 id, winning rule, policyVersion 스탬프 등) | 전체 JSON은 `evaluation_snapshot` / `replayed_evaluation`(선택)에 있음 |
| **replayed_summary** | 이번 리플레이에서 **같은 inputSnapshot** + (요청 시) **새 ruleset**으로 다시 돌린 요약 | `replay_rules_source`가 `request_body`이면 규칙은 요청 JSON |
| **diff** | baseline vs replayed **구조적 차이** (outcome·confidence·규칙 집합·winningRule·resolutionMode·policyVersion 필드 쌍) | `diff.policyVersion`은 **결과에 찍힌 문자열** 비교; 규칙 파일 버전은 아래 귀속 필드 참고 |

---

## 2. 규칙 변경 vs 입력(데이터) 고정

리플레이는 **항상 DB에 저장된 `evaluation_snapshot.trace.inputSnapshot`을 입력으로 쓴다**. 따라서 **한 judgment 행에 대한 리플레이**에서 입력 텍스트/구조가 바뀌지는 않는다.

### 2.1 G3 축 이름과 API 필드 (직교)

| G3 문서 축 | 리플레이 API 필드 | 비고 |
|------------|-------------------|------|
| `policy_version` (저장 시 규칙 번들 스탬프) | `judgment_policy_version_at_persist` | `synaxion_judgments.policy_version` |
| 이번 실행 rules 파일 `version` | `ruleset_version_used` **또는 동일 값** `replay_rules_file_version` | 후자는 “규칙 버전” 검색·대시보드용 별칭 |
| `context_fingerprint` (멱등·컨텍스트 지문, evidenceIds 제외) | `judgment_context_fingerprint_at_persist` | [SYNAXION_G3_PERSIST_AND_DETERMINISM.md](../../analysis/SYNAXION_G3_PERSIST_AND_DETERMINISM.md) §3.4 |
| 스냅샷 입력 고정 해시 (`trace.inputSnapshot` 기준) | `input_snapshot_sha256` | `context_fingerprint`과 **다른** 축 — 스냅샷 전체 정규화 해시 |

| 질문 | 무엇을 보면 되는가 |
|------|---------------------|
| **규칙 번들이 judgment 저장 이후 바뀌었나?** | API: `rules_bundle_changed_since_judgment` (`true`/`false`/`null`). `null`은 `synaxion_judgments.policy_version`이 비어 있을 때. |
| **이번 실행이 배포 번들인가, 임의 body.rules인가?** | `replay_rules_source`: `bundled` \| `request_body` |
| **입력 지문(다른 행·재수집과 비교)** | `input_snapshot_sha256` — 동일 스냅샷이면 동일 해시 |
| **이번에 실제로 적용한 rules 파일 버전** | `ruleset_version_used` (= `replay_rules_file_version`, `decision-rules.json`의 `version`) |

**해석 힌트**: `rules_bundle_changed_since_judgment === true` 이고 diff에 변화가 있으면 **규칙 쪽 원인을 먼저 의심**한다. `false`인데 diff가 있으면 **해석 모드·비결정성·엔진 버그** 등 [JUDGMENT_DATA_FLOW.md](./JUDGMENT_DATA_FLOW.md)의 비결정성 목록을 본다.

---

## 3. Admin UI (현재)

- **판단 큐** (`/admin/synaxion-judgments`): 단건 리플레이 JSON에 위 귀속 필드가 포함된다. diff 요약 카드는 `diff` 객체를 사람이 읽기 쉬운 형태로 보여 준다.
- **감사 테이블** 행: `baseline_summary` / `replayed_summary` / `diff`는 DB 컬럼 그대로이며, 목록에서는 `ruleset_version_used`·시각·diff.outcome.changed 정도만 요약 표시된다.

---

## 4. 감사 행 스키마 (참고)

DB 컬럼은 마이그레이션 `189_synaxion_judgment_replays.sql`과 일치한다. API persist 시 `buildSynaxionReplayRpcBatchRows`가 위 요약·diff를 기록한다.

**최종 수정**: 2026-03-21
