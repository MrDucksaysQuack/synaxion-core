# Event → UI Map — 열 정의 스키마

> **Synaxion Constitution 19장 · EVENT_UI_MAP_SCHEMA**  
> EventType이 화면·알림·배지에 어떻게 반영되는지 기술하는 카탈로그의 표준 열 정의.  
> **출처**: Agrinovation `11-EVENT-UI-MAP.md` (72 EventType 행 검증)

---

## 핵심 원칙

> **모든 Event는 UI에서 최소 하나의 얼굴을 가져야 한다 — trigger / timeline / notification 중 하나 이상, 또는 N/A 사유가 명시되어야 한다.**

EventType만 `packages/core`에 등록하고 UI 반응이 없으면, 역할은 "무슨 일이 일어났는지" 알 수 없다.

---

## 표준 열

| 열 | 타입 | 설명 |
|----|------|------|
| `EventType` | `EventType` | 도메인 Event 이름 (PascalCase). SSOT는 인스턴스 `event-types.ts` |
| `trigger_ui` | `string` | Event를 발생시키는 UI 액션 route. 없으면 `—` 또는 시스템 자동 명시 |
| `timeline` | `string` | 타임라인·피드·로그에 기록되는 route |
| `notification` | `string` | 푸시·인앱 알림을 받는 역할 |
| `badge` | `string` | 배지·카운트 증가 대상 (없으면 `—`) |
| `impl_status` | `✅ \| ⚠️ \| ❌` | 구현 상태 (인스턴스 Backlog ID로 추적) |
| `na_reason` | `string` | UI 변화 없을 때 사유 (다른 열이 모두 `—`일 때 필수) |

---

## 카탈로그 테이블 형식

인스턴스는 도메인별 섹션으로 나누어 기술한다.

```markdown
## [도메인 그룹명]

| EventType | trigger_ui | timeline | notification | badge | impl_status |
|-----------|------------|----------|--------------|-------|-------------|
| `QuestCompleted` | `#/quests/:id` 완료 버튼 | `#/truefarm` 검증 큐 | Truefarm | 검증 대기 +1 | ⚠️ |
```

---

## N/A 허용 조건

| 사유 예시 | `na_reason` 예시 |
|-----------|------------------|
| 순수 백엔드·배치 Event | "배치 정산 — UI는 `SettlementExecuted`로만 반영" |
| 중복 표현 Event | "부모 Event `QuestSettled` 타임라인에 흡수" |
| 미래 스코프 | "Pilot 범위 외 — Backlog L4-xxx" |

---

## 거버넌스 연동

- 새 Event 행 추가 시: **11 + 10(핸드오프) + 08(추적)** 동시 갱신 ([GOVERNANCE.md 규칙 3](./GOVERNANCE.md))
- 구현 상태는 카탈로그에 체크박스 대신 `backlog: Lx-xxx` 인용

---

## Reference (검증 인스턴스)

Agrinovation `11-EVENT-UI-MAP.md` — Quest·Correction·Infra·Settlement 등 72 EventType 행

검증된 대표 패턴:

```
QuestCompleted
  trigger_ui   : #/quests/:id "완료"
  timeline     : #/truefarm 검증 대기 큐
  notification : Truefarm
  badge        : 검증 대기 +1
```
