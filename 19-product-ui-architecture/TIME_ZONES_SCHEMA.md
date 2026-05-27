# Time Zones — 3구간 스키마

> **Synaxion Constitution 19장 · TIME_ZONES_SCHEMA**  
> 마감·SLA가 있는 엔티티의 UI 시간 구간(safe / warning / overdue) 표준 정의.  
> **출처**: Agrinovation `12-TIME-ZONES.md` TZ-01~08 (8 엔티티 검증)

---

## 핵심 원칙

> **모든 시간 제약 엔티티는 3구간을 가진다 — 여유(safe) / 임박(warning) / 초과(overdue). 각 구간은 반드시 다른 UI 처리를 받아야 한다.**

동일 배지·동일 정렬로 Zone A/B/C를 표현하면 사용자는 긴급도를 구분할 수 없다.

---

## 공통 구간 (Zone A / B / C)

| 구간 | 이름 | 색상 토큰 (권장) | 설명 |
|------|------|------------------|------|
| **Zone A** | Safe | `color-success` / `color-neutral` | 마감까지 충분한 시간 |
| **Zone B** | Warning | `color-warning` | 마감 임박 — 행동 촉구 |
| **Zone C** | Overdue | `color-error` | 마감 초과 — 긴급·에스컬레이션 |

> 임계값은 **엔티티마다** 인스턴스 문서에서 정의한다.

---

## 엔티티 항목 형식 (TZ-NN)

```markdown
### TZ-NN: [엔티티] `[필드명]`

**대상 역할**: Role1, Role2
**표시 위치**: `#/route` 목록 배지 / 상세 헤더

| 구간 | 임계값 | 배지 | 목록 정렬 | 알림 | 에스컬레이션 |
|------|--------|------|-----------|------|-------------|
| Zone A | … | … | 기본 | — | — |
| Zone B | … | … | 상단 고정 | 인앱 1회 | — |
| Zone C | … | … | 최상단 + 강조 | 반복·푸시 | 운영자 알림 |
```

---

## 선택 열 (프로파일 L 권장)

| 열 | 설명 |
|----|------|
| `필터 지원` | 목록 필터 키 (예: "마감 임박", "지연 배송") |
| `빈 상태` | 해당 Zone에 항목 없을 때 안내 문구 |
| `관련 Event` | `11-EVENT-UI-MAP` EventType 링크 |

---

## State Matrix 연동

- `05-STATE-MATRIX`의 `time_zone` 열은 `TZ-NN` ID 또는 `Zone A/B/C`를 참조한다.
- Time Zones 문서가 없는 제품은 `time_zone` 열을 N/A로 둔다 ([STATE_MATRIX_SCHEMA.md](./STATE_MATRIX_SCHEMA.md)).

---

## Reference (검증 인스턴스)

Agrinovation `12-TIME-ZONES.md` — TZ-01 Quest `due_at` ~ TZ-08 Role application SLA (8건)

검증된 대표 패턴:

```
TZ-01: Quest due_at
  Zone B ≤ 24h → 🟡 "오늘 마감", 목록 상단, 인앱 1회
  Zone C < 0   → 🔴 "마감 초과", 최상단, 4h 반복 알림 + Agrinovation 에스컬레이션
```
