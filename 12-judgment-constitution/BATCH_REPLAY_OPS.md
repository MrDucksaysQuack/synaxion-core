# 배치 리플레이 운영 런북 (1페이지)

> **범위**: `POST /api/v1/admin/synaxion-judgments/replay-batch` — 최대 50건, 선택 시 `synaxion_judgment_replays`에 **단일 RPC 트랜잭션**으로 append.

**정책 상위 문서**: [REPLAY_POLICY.md](./REPLAY_POLICY.md)

### TL;DR (배치가 persist를 못 썼을 때)

1. 응답 `persist_skipped_reason`이 **`COMPUTE_ERRORS`**면 → `results[]`에서 `ok: false`만 골라 원인(NOT_FOUND, 스냅샷 파싱 등)을 본다.  
2. **감사 행은 한 건도 생기지 않았다** (원본 judgment도 불변).  
3. 실패 id만 고치거나 목록에서 빼고 **줄인 `judgment_ids`로 재호출**. RPC/네트워크 일시 오류는 **지수 백오프** 후 동일 페이로드 재시도 가능.

---

## 1. 요청 요약

| 본문 필드 | 설명 |
|-----------|------|
| `judgment_ids` | UUID 배열, 1–50 |
| `persist` | `true`면 감사 테이블 insert (권한: `manage_synaxion_judgments`) |
| `persist_full_snapshot` | 각 행에 `replayed_evaluation` JSON 저장 (대용량) |
| `rules` / `precedence` / `match_stored_resolution_mode` | 단건 리플레이와 동일 |

---

## 2. 응답 플래그

| 필드 | 의미 |
|------|------|
| `persist_requested` | 요청에 `persist: true`였는지 |
| `persist_applied` | 실제로 RPC가 성공해 감사 행이 생겼는지 |
| `persist_skipped_reason` | 감사가 **건너뛰어진** 이유 코드 (아래 표) |
| `batch_id` | 성공 시 생성된 UUID, 동일 배치에 속한 감사 행이 공유 |
| `results[]` | 항목별 `ok` / 오류 메시지; 성공 항목에는 단건 API와 동일한 **귀속 필드**(`input_snapshot_sha256`, `rules_bundle_changed_since_judgment` 등) 포함 |

### `persist_skipped_reason`

| 값 | 의미 | 운영 액션 |
|----|------|-----------|
| **`COMPUTE_ERRORS`** | `results` 중 하나라도 `ok: false` (NOT_FOUND, 스냅샷 파싱 실패 등) | 실패한 `judgment_id`를 로그/응답에서 확인 → 스냅샷·존재 여부 수정 후 **실패한 id만** 다시 호출하거나, 전체를 고쳐서 재시도 |
| **`null`** | persist 미요청이거나, 전 항목 계산 성공 후 insert 완료 | — |

**중요**: `COMPUTE_ERRORS`일 때는 **어떤 감사 행도 쓰이지 않는다** (원본 judgment도 불변). 부분 성공 persist는 없다.

---

## 3. 재시도

1. 응답 `results`에서 `ok: false`만 추출한다.  
2. 원인별로 judgment를 수정하거나 id를 제거한다.  
3. 동일 `judgment_ids`를 줄여 배치를 다시 호출한다.  

RPC/DB 일시 오류는 클라이언트에서 **지수 백오프** 후 같은 페이로드 재시도 가능 (멱등: 동일 입력이면 새 `batch_id`로 **추가** 감사 행만 생김).

---

## 4. 메트릭

최근 창 감사 건수·배치/단건 분해·**diff outcome 변경 건수·비율**은 `GET /api/v1/admin/synaxion-judgments/replay-stats?days=7` 로 조회한다. (관리자 대시보드 Synaxion 배너에서 동일 API를 사용한다.) **비율**은 감사 테이블에 기록된 `diff.outcome.changed === true` 비중이며, HTTP 배치 “실패율”과는 별개다.

---

**최종 수정**: 2026-03-21
