# Handoff Catalog — 7필드 스키마

> **Synaxion Constitution 19장 · HANDOFF_CATALOG_SCHEMA**  
> 역할 간 책임 이전(Handoff)을 기술하는 카탈로그의 표준 필드 정의.  
> **출처**: Agrinovation `10-HANDOFF-CATALOG.md` H-01~H-20b (21건 구현 검증)

---

## 핵심 원칙

> **핸드오프는 양면이다 — 송신자의 완료 확인과 수신자의 큐 진입은 동시에 설계되어야 한다.**

단방향 설계("A가 완료했다")는 핸드오프가 아니다.  
수신자가 무엇을 보게 되는지, 실패 시 양쪽이 무엇을 하는지가 함께 정의될 때 설계가 완결된다.

---

## 7필드 스키마

| 필드 | 타입 | 설명 |
|------|------|------|
| `trigger_event` | `EventType` | 핸드오프를 발생시키는 도메인 Event 이름 (PascalCase) |
| `from_role` | `Role` | 액션을 완료한 역할 |
| `from_ui_after` | `string` | 송신자가 완료 후 보게 되는 화면 상태 (경로 + 상태 배지) |
| `to_role` | `Role` | 다음 책임자 역할 |
| `to_ui_after` | `string` | 수신자가 액션을 받은 후 보게 되는 화면 상태 (경로 + 큐/알림) |
| `failure_both` | `string` | 핸드오프 실패 시 양측 UI 처리 (에러 상태·복구 CTA) |
| `route` | `string` | 핸드오프와 연결된 주요 URL 경로 |

---

## 카탈로그 항목 형식

인스턴스는 각 핸드오프를 아래 테이블로 기술한다.

```markdown
### H-NN: [핸드오프 이름]

| 필드 | 내용 |
|------|------|
| **trigger_event** | `EventType명` |
| **from_role** | `역할명` |
| **from_ui_after** | `#/경로` — [상태 설명] |
| **to_role** | `역할명` |
| **to_ui_after** | `#/경로` — [큐 항목 설명] |
| **failure_both** | [실패 처리 설명] |
| **route** | `#/경로` |
```

---

## Backlog 연동 규칙

핸드오프 항목을 카탈로그에 추가하면 반드시 Backlog에도 행을 추가한다.

```
카탈로그 H-NN 추가 → Backlog L2-H-NN 행 동시 추가
```

Backlog 행 최소 필드:

| ID | 핸드오프 | 트리거 Event | 우선순위 | 코드 터치 | 완료 시 갱신 | 상태 |
|---|---|---|---|---|---|---|
| L2-H-NN | [이름] | `EventType` | 🔴/🟡/🟢 | [파일명] | [갱신 대상] | ⬜ |

---

## 우선순위 기준

| 기호 | 기준 |
|------|------|
| 🔴 | 핵심 경로 — 이 핸드오프 없으면 P0 기능이 동작하지 않음 |
| 🟡 | 중요 경로 — 없으면 역할 경험 저하 |
| 🟢 | 보조 경로 — 있으면 좋으나 MVP 필수 아님 |

---

## Reference (검증 인스턴스)

Agrinovation `10-HANDOFF-CATALOG.md` H-01~H-20b (21건)

검증된 대표 패턴:

```
H-01: QuestCompleted → Truefarm 검증 큐
  trigger_event : QuestCompleted
  from_role     : Farmer (또는 Labor)
  from_ui_after : #/quests/:id — "검증 요청됨" 배지
  to_role       : Truefarm
  to_ui_after   : #/truefarm — 검증 대기 큐 카운트 +1
  failure_both  : 네트워크 실패 → 양측 재시도 토스트
  route         : #/quests/:id, #/truefarm
```
