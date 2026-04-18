# Judgment Output Type (판단 출력 타입) — 단일 소스

> **판단 헌법에서 가장 먼저 고정할 것.**  
> 입력(ERIC)보다 **출력(판단 결과의 형태)** 이 먼저 있어야 Decision Rule·Data Flow·Federation이 같은 축으로 정렬된다.

**규범 버전**: `judgmentVersion` **1.0** (런타임 출력 JSON의 [judgment-output.schema.json](../judgment-output.schema.json)과 함께 갱신)

---

## 1. 판단 결과 `outcome` (필수)

모든 자동·반자동 판단은 아래 **정확히 하나**를 낸다. (실패 처리가 아니라 **정식 판단 값**이다.)

| outcome | 의미 |
|---------|------|
| **ALLOW** | 조건 충족, 행동·노출·진행 허용 |
| **DENY** | 조건 불충족 또는 정책상 금지, 요청 거부 |
| **HOLD** | **시간·비동기 의존** 등으로 즉시 확정 불가 — 같은 입력에 대해 나중에 재평가(큐·웹훅·배치) |
| **INSUFFICIENT_DATA** | **정보 부족**으로 확정 불가 — 추가 수집·질문·다른 소스 필요 |
| **CONFLICTING_SOURCES** | 출처 간 배타적 주장 — 신뢰 규칙만으로 단일 값 확정 불가 |
| **DEGRADED_CONFIDENCE** | 판단은 내리되 **신뢰도 낮음** — UI·다운스트림에 반드시 표시 |
| **ESCALATE_TO_HUMAN** | 자동 규칙 범위 밖 — **1급 시민** 판단: 사람·상위 프로세스에 넘김(예외가 아님) |

**구분 요약**

- **HOLD** ≠ **INSUFFICIENT_DATA**: HOLD는 “기다리면 풀림”, INSUFFICIENT_DATA는 “더 가져와야 풀림”.  
- **CONFLICTING_SOURCES** ≠ **ESCALATE_TO_HUMAN**: 전자는 **상태 진단**, 후자는 **다음 액션**(사람에게 넘김). 한 판단에 둘 다 기술하려면 `outcome` 하나만 쓰고 `nextAction`으로 다른 층을 표현한다(§3).

### 1.1 운영 선택 기준 (HOLD · INSUFFICIENT_DATA · ESCALATE_TO_HUMAN)

| 질문 | HOLD | INSUFFICIENT_DATA | ESCALATE_TO_HUMAN |
|------|------|-------------------|-------------------|
| **이미 알고 있는 입력만으로**, 정책이 허/불을 정할 수 있는가? | (해당 없음) | No → 후보 | No + 자동 분기 없음 → 후보 |
| **시간이 지나거나 비동기 콜백**이 오면 같은 입력으로 재평가 가능한가? | Yes → **HOLD** | — | — |
| **추가 수집·질문·다른 소스**가 있으면 자동으로 확정 가능한가? | — | Yes → **INSUFFICIENT_DATA** | — |
| **정책·감사상 사람·상위 프로세스 결재**가 필요한가? | — | — | Yes → **ESCALATE_TO_HUMAN** |

**짧은 예시**

- **HOLD**: 결제 확정 웹훅 대기, 외부 재고 동기화 배치 완료 전, OCR 작업 큐 처리 중. `nextAction`: `RETRY_LATER` 등.  
- **INSUFFICIENT_DATA**: 라벨 필수 필드 미입력, 관계(relation) 슬롯 비어 확정 불가. `nextAction`: `FETCH_MORE` 등.  
- **ESCALATE_TO_HUMAN**: 출처 충돌 + 신뢰 순위로도 자동 합의 불가, 또는 규제 예외·새 유형 사례. `nextAction`: `OPEN_HUMAN_QUEUE` 등.

`decision-rules.json`에서 동일 구분을 쓰고, 규칙별로 의존 ERIC 축은 `requiredDimensions`로 명시한다([DECISION_RULES.md](./DECISION_RULES.md)).

---

## 2. `confidence` (권장)

**1차 표준은 단계(enum)** 로 통일한다. 시스템마다 숫자 스케일이 달라지는 것을 막는다.

| 값 | 사용 시점 |
|----|-----------|
| **high** | 다중 독립 근거, 정책 명문, 재현 가능한 파이프라인 |
| **medium** | 단일 강한 출처 또는 규칙 기본값 |
| **low** | 추정, 단일 비검증 출처, `DEGRADED_CONFIDENCE` 와 자주 동반 |

**수치(0~1)** 는 인스턴스에서 **선택**으로 `confidenceScore`에 둘 수 있다([judgment-output.schema.json](../judgment-output.schema.json)). enum과 동시에 쓰면 **불일치 시 enum 우선**(감사 시 둘 다 로그).

### 2.1 버전과 confidence 해석 (단일 소스)

런타임·리플레이·감사에서 “같은 `high`가 같은 의미인가?”를 맞추기 위해 아래를 함께 기록한다.

| 필드 | 역할 | confidence와의 관계 |
|------|------|----------------------|
| **judgmentVersion** | 이 문서·`judgment-output.schema.json` 스펙 세대 (현재 **1.0**) | 스펙이 바뀌면 enum 의미가 바뀔 수 있음 → **리플레이 diff 시 judgmentVersion 불일치면 confidence 직접 비교 금지** |
| **policyVersion** (또는 규칙 번들 태그) | 적용한 `decision-rules`·정책 세트 | **같은 입력이라도 policyVersion이 다르면** outcome·confidence가 달라질 수 있음(정상) |
| **rulesetFingerprint** (권장) | 규칙 JSON 해시·태그 | 재현성·“규칙 변경 vs 입력 변경” 분리([REPLAY_POLICY.md](./REPLAY_POLICY.md)) |

**참조 구현**: `aggregateConfidence`는 ERIC 차원 `trust`의 최솟값으로 기본 단계를 잡고, `outcome`이 `INSUFFICIENT_DATA`·`HOLD`·`CONFLICTING_SOURCES`·`ESCALATE_TO_HUMAN`이면 한 단계 낮추는 등 보정한다([confidence.ts](../../../packages/lib/core/judgment/confidence.ts)). 알고리즘을 바꿀 때는 **코멘트 + 이 표**를 같이 갱신한다.

---

## 3. `evidenceIds` · `nextAction` · `version`

| 필드 | 필수 | 설명 |
|------|------|------|
| **evidenceIds** | **원칙적 필수** | 판단을 설명할 수 있는 근거 레코드 id 목록. 없으면 [설계 질문 §5-1](#5-보강-질문-5개)에 따라 팀이 정한 완화만 허용. |
| **nextAction** | 권장 | 구현체가 이해하는 짧은 토큰: `NONE`, `RETRY_LATER`, `FETCH_MORE`, `SHOW_DEGRADED`, `OPEN_HUMAN_QUEUE` 등. **인간 검토**는 `ESCALATE_TO_HUMAN` 과 조합해 1급 경로로 문서화한다. |
| **policyVersion** | 권장 | 적용한 정책·규칙 번들 버전. |
| **judgmentVersion** | 필수 | 이 스펙 버전. 현재 **1.0**. |
| **rulesetFingerprint** | 권장 | 사용한 `decision-rules` 등의 해시·태그(재현성). |

런타임 객체 전체 스키마: [judgment-output.schema.json](../judgment-output.schema.json).

---

## 4. 단일 최종값 vs 후보군 (랭킹)

기본은 **최종 `outcome` 하나**.  
Examhub·Synaptree류에서 **후보 + 랭킹**이 필요하면 `alternatives` 배열(점수·근거 id)을 **선택 필드**로 추가한다. 스키마에 정의됨. 단일 outcome은 여전히 “대표 결론”(예: 상위 1개와 정렬)을 낸다.

---

## 5. 시간에 따른 판단 변경 (버전)

**Context**가 시간 민감하면:

- 판단 레코드에 **유효 시각·정책 버전**을 저장한다.
- 동일 `ingestionId`에 재판이 나오면 **덮어쓰기가 아니라** 새 판단 행(또는 버전 필드)으로 남긴다.  
구체 저장소는 인스턴스; 헌법은 **“재현 가능한 (시간, policyVersion)”** 을 요구한다.

---

## 6. `decision-rules.json` 의 `outcome` 과의 관계

규칙 파일의 `outcome` 필드는 **이 표의 enum과 동일한 문자열**을 쓴다([decision-rules.schema.json](../decision-rules.schema.json)).  
런타임 `JudgmentResult.outcome` 과 1:1로 맞춘다.

---

## 7. 보강 질문 5개 (팀이 답하면 인스턴스가 단단해짐)

1. **모든 판단은 반드시 Evidence ID를 가져야 하는가?**  
   없으면 설명 불가능·감사 불가에 가깝다. 예외를 둘 경우 `evidenceWaivedReason`(스키마 선택 필드)으로만 허용할지 정한다.

2. **Confidence는 숫자인가, 단계(enum)인가?**  
   → 이 헌법: **enum 1차**, 수치는 선택.

3. **판단은 항상 최종값 하나만 내는가, 후보군+랭킹을 내는가?**  
   → 기본 단일 + 필요 시 `alternatives`.

4. **시간에 따라 판단이 바뀌면 versioning을 어떻게 다룰 것인가?**  
   → §5: 시각·정책 버전·감사 행 분리.

5. **인간 개입은 예외인가, 1급 시민인가?**  
   → `ESCALATE_TO_HUMAN` 은 **정식 outcome**. 실패가 아니다.

---

**관련**: [DECISION_RULES.md](./DECISION_RULES.md), [JUDGMENT_DATA_FLOW.md](./JUDGMENT_DATA_FLOW.md), [ENGINE_INTERFACE.md](./ENGINE_INTERFACE.md), [ENGINE_EVALUATION.md](./ENGINE_EVALUATION.md)(참조 구현), [EVIDENCE_AND_TRACE.md](./EVIDENCE_AND_TRACE.md), [INCOMPLETE_AND_CONFLICT.md](./INCOMPLETE_AND_CONFLICT.md)

**최종 업데이트**: 2026-03-21 (G2: outcome 선택 가이드·confidence 버전 표)
