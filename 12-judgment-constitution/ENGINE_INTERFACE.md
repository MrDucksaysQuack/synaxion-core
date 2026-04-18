# Engine Interface (판단 엔진 계약)

> 입·출력은 [JUDGMENT_OUTPUT_TYPE.md](./JUDGMENT_OUTPUT_TYPE.md) 및 [judgment-output.schema.json](../judgment-output.schema.json)이 **단일 소스**다.  
> 이 문서는 엔진 경계 요약이다.

---

## 1. 입력 (Input)

| 필드 | 필수 | 설명 |
|------|------|------|
| `ingestionId` | 권장 | 원시 수집 건 식별(멱등·재처리) |
| `raw` | 선택 | 원문(payload, 이벤트 body) |
| `eric` | 조건부 | 이미 정규화된 ERIC; 없으면 엔진 내부에서 정규화 |
| `policyVersion` | 권장 | 적용할 규칙 세트 버전 |
| `trust` | 권장 | 출처별 신뢰 레이블(연합 시 필수에 가깝다) |

**규칙**: 신뢰 경계 밖 `raw`만으로 **권한·안전**을 최종 확정하지 않는다. [TRUST_BOUNDARY_PRINCIPLE.md](../01-foundations/TRUST_BOUNDARY_PRINCIPLE.md).

---

## 2. 출력 (Output) — JudgmentResult

엔진은 **JudgmentResult** 객체를 반환한다. 필수·선택 필드는 스키마와 동일하다.

| 필드 | 비고 |
|------|------|
| `judgmentVersion` | 필수. 현재 **1.0** |
| `outcome` | [JUDGMENT_OUTPUT_TYPE.md §1](./JUDGMENT_OUTPUT_TYPE.md) enum |
| `confidence` | 권장. `high` \| `medium` \| `low` |
| `confidenceScore` | 선택. 0~1 |
| `evidenceIds` | 원칙적 필수; 예외 시 `evidenceWaivedReason` |
| `appliedRuleIds` | 권장 |
| `nextAction` | 권장. `NONE`, `RETRY_LATER`, `FETCH_MORE`, `OPEN_HUMAN_QUEUE` 등 팀 합의 토큰 |
| `policyVersion`, `rulesetFingerprint` | 재현성 |
| `alternatives` | 선택. 후보+랭킹 제품만 |

전체 JSON Schema: [judgment-output.schema.json](../judgment-output.schema.json).

---

## 3. 버전 정책

- **Judgment 스펙**: `judgmentVersion`(OUTPUT_TYPE + judgment-output.schema).  
- **규칙 파일**: `decision-rules.json` 의 `version` ([decision-rules.schema.json](../decision-rules.schema.json)).  
- **정책 번들**: 팀이 부여하는 `policyVersion` / `rulesetFingerprint`.  
동일 입력 재현을 위해 감사 로그에 **셋 모두** 남기는 것을 권장한다.

---

## 4. 비목표

- 구체 스토리지 스키마(SQL/JSON-LD)
- ML 모델 인터페이스
- 실시간 vs 배치 스케줄링

**관련**: [JUDGMENT_DATA_FLOW.md](./JUDGMENT_DATA_FLOW.md), [DECISION_RULES.md](./DECISION_RULES.md), [ENGINE_EVALUATION.md](./ENGINE_EVALUATION.md), [EVIDENCE_AND_TRACE.md](./EVIDENCE_AND_TRACE.md)

**최종 업데이트**: 2026-03-20
