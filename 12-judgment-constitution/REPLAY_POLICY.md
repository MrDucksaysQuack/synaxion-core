# Replay Policy (Synaxion 운영 프로토콜)

> **한 문장**: Replay 엔진·API·감사 테이블은 **구현됨**; **언제·어디까지·결과를 어떻게 쓸지**는 본 문서가 고정한다. 자동 실행은 아직 **코드에 없음** — 트리거는 여기 정의를 따른 뒤 단계적으로 붙인다.

**관련 구현**: [JUDGMENT_DATA_FLOW.md §4.2](./JUDGMENT_DATA_FLOW.md)

**운영·소비자 문서**: [REPLAY_DIFF_CONSUMER.md](./REPLAY_DIFF_CONSUMER.md) · [BATCH_REPLAY_OPS.md](./BATCH_REPLAY_OPS.md)

**배치 persist 실패·재시도 (1줄)**: `replay-batch`에서 `persist: true`인데 감사가 안 쌓이면 응답 `persist_skipped_reason`과 `results[]`를 본다. 해석·재시도 절차는 [BATCH_REPLAY_OPS.md](./BATCH_REPLAY_OPS.md) TL;DR·§2–3.

---

## 1. 언제 replay 하는가 (Triggers)

| 구분 | 조건 | 비고 |
|------|------|------|
| **수동 (현재)** | 관리자가 단건/배치 API·UI로 실행 | 디버깅·규칙 변경 전후 스팟 검증 |
| **자동 (정책상 예정)** | 배포된 **decision-rules `version`(또는 ruleset fingerprint)** 가 이전과 달라졌을 때 | 영향 범위 산정 → 배치 replay + 감사 persist 권장 |
| **자동 (정책상 예정)** | 저장된 **`policyVersion`** 과 현재 평가에 쓰는 버전이 **불일치**로 판단될 때 | “재검토 필요” 큐·알림과 연계 가능 |
| **이벤트 연계 (정책상 예정)** | 운영자 **override** 직후 | **원본 judgment 행은 불변**; 참고용 리플레이·diff만 기록할지 여부는 §3 준수 |
| **선별 (정책상 옵션)** | 특정 **outcome** 만 (예: `DENY`, `ESCALATE_TO_HUMAN`) | 리스크·볼륨에 따라 배치 필터로 제한 |

**우선순위 (권장)**: rules/policy 버전 불일치 감지 → 영향 범위 배치 → 그 외는 수동·알림.

---

## 2. 어떤 범위를 replay 하는가 (Scope)

| 범위 | 상태 | 식별자 / 방법 |
|------|------|----------------|
| **단건** | 구현됨 | `synaxion_judgments.id` |
| **배치 (고정 N건)** | 구현됨 | `judgment_ids[]` (최대 50, RPC 트랜잭션) |
| **ingestion 단위** | 미구현 | 동일 `ingestion_id` (또는 `source_event_id` 패턴)로 묶음 — 정책만 선언 |
| **시간 구간** | 미구현 | `created_at` between … — 정책만 선언 |
| **특정 rule 영향** | 미구현 | 스냅샷/메타에 `matched_rule_ids` 등으로 필터 — 정책만 선언 |

배포 자동화 시에는 **먼저 범위를 좁히는 쿼리(예: `policy_version` ≠ 새 버전)** 로 후보 집합을 만든 뒤, 청크 단위로 배치 API를 호출하는 패턴을 권장한다.

---

## 3. 결과를 어떻게 쓰는가 (Outcome handling)

| 방식 | Itemwiki 기본 stance | 현재 구현 |
|------|------------------------|-----------|
| **원본 judgment** | **유지 (overwrite 금지)** | `synaxion_judgments` 행은 리플레이로 갱신하지 않음 |
| **diff·요약** | **감사로 남김** | `synaxion_judgment_replays` append (`diff`, `baseline_summary`, `replayed_summary`, 선택 `replayed_evaluation`) |
| **비교만** | 허용 | API 응답만 보고 `persist: false` |
| **“새 판단이 정답”으로 승격** | **별도 ADR·스키마 없이 하지 않음** | 필요 시 정책 개정 + 마이그레이션 + 운영 플로우 문서화 |

정리: **리플레이는 감사·회귀 검증의 근거**이며, **실사용 노출 judgment를 바꾸는 행위는 이 문서 범위 밖(명시적 설계 필요)**.

---

## 4. 완성 상태에 대한 정의

- **지금**: replay **할 수 있음** (수동, 감사 저장 가능).
- **완성**: 위 **트리거**에 맞춰 **자동 또는 스케줄된 실행**이 붙고, **범위·결과 처리**가 본 문서와 코드가 일치한 상태.

---

## 5. 다음 구현 시 체크

- [ ] rules / `policyVersion` 변경을 감지하는 **단일 이벤트 소스**(배포 훅·CI·마이그레이션 로그 등) 확정  
- [ ] 자동 배치의 **후보 쿼리**와 **청크 크기·실패 시 재시도**  
- [ ] `override` 이후 리플레이를 **의무**로 할지 **선택**으로 할지 운영 합의  

**최종 업데이트**: 2026-03-20
