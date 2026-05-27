# State Matrix — 열 정의 스키마

> **Synaxion Constitution 19장 · STATE_MATRIX_SCHEMA**  
> 화면 상태 매트릭스(05 State Matrix)의 표준 열 정의.  
> **출처**: Agrinovation `05-STATE-MATRIX.md` (partial/optimistic/stale/time_zone/availability_gate 검증)

---

## 핵심 원칙

> **Happy path만으로 화면 상태를 설계하지 않는다.**

화면은 항상 다음 세 가지 "보이지 않는 상태"를 고려해야 한다:
- 데이터가 일부만 도착했을 때 (partial)
- 서버 확인 전 낙관적으로 반영했을 때 (optimistic)
- 캐시가 낡았을 때 (stale)

---

## 기본 열 세트

모든 화면에 적용하는 필수 열.

| 열 | 타입 | 설명 |
|----|------|------|
| `화면명` | `string` | 화면 식별자 (04 Screen Inventory와 1:1 대응) |
| `경로` | `string` | URL 경로 |
| `주요 상태` | `enum` | loading / empty / error / populated / forbidden |
| `주요 액션` | `string` | 이 화면의 핵심 사용자 액션 |

---

## 확장 열 세트 (프로파일 M+ 권장)

Event 기반·다역할 제품에서 추가하는 열.

| 열 | 타입 | 설명 | N/A 조건 |
|----|------|------|----------|
| `time_zone` | `Zone A/B/C 또는 TZ-xx ID` | UI 시간 구간 — 실시간(A)·비동기(B)·배치(C). Time Zones 문서와 연계. | 시간 구간 없는 단순 제품 |
| `availability_gate` | `이유 코드 (string)` | Quest·작업 시작/완료를 차단하는 도메인 객체 상태 코드. Object-Capability 문서와 연계. | Quest/작업 가용성 없는 제품 |
| `partial` | `boolean + 설명` | 일부 섹션만 데이터·일부 API 실패 시 화면이 어떻게 보이는가 | 단일 API 응답만 사용하는 화면 |
| `optimistic` | `boolean + 설명` | 제출 직후 서버 확인 전 UI 선반영 여부 | 즉시 응답만 허용하는 화면 |
| `stale` | `boolean + 설명` | 캐시·동기화 지연으로 낡은 데이터가 보일 수 있는 여부 | 캐시 없는 실시간 폴링만 사용 |

---

## 상태 매트릭스 테이블 형식

```markdown
| 화면명 | 경로 | 주요 상태 | 주요 액션 | time_zone | availability_gate | partial | optimistic | stale |
|--------|------|----------|----------|-----------|-------------------|---------|------------|-------|
| 퀘스트 상세 | #/quests/:id | loading / populated / forbidden | 완료 제출 | TZ-01 (Zone A) | QUEST_NOT_ASSIGNED | ✅ (일부 섹션 지연) | ✅ (완료 즉시 배지) | ❌ |
```

---

## 시간 구간 (Zone) 정의

time_zone 열에서 참조하는 3구간.

| Zone | 정의 | 예시 |
|------|------|------|
| **Zone A** (실시간) | 사용자 액션 후 즉시(< 2초) 반영 기대 | 버튼 클릭 → 상태 변경 |
| **Zone B** (비동기) | 수분~수시간 후 반영 | Event 발행 → 상대방 큐 업데이트 |
| **Zone C** (배치) | 수시간~24시간 이후 반영 | 정산·집계·보고서 |

TZ-xx는 인스턴스가 정의하는 시나리오별 식별자 (예: `TZ-01 = 퀘스트 완료 → 검증 대기`).

---

## Reference (검증 인스턴스)

Agrinovation `05-STATE-MATRIX.md`

검증된 대표 열 조합:

```
화면: 퀘스트 상세 (#/quests/:id)
  time_zone          : TZ-01 (Zone A·B 혼재 — 제출은 A, 검증 알림은 B)
  availability_gate  : QUEST_NOT_ASSIGNED | INFRA_UNAVAILABLE
  partial            : true (자재 섹션·정산 섹션 독립 로딩)
  optimistic         : true (완료 버튼 클릭 즉시 "검증 요청됨" 배지)
  stale              : false (실시간 폴링)
```
