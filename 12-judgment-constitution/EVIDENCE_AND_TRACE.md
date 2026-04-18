# Evidence & Trace (증거 · 추적성)

> **질문**: “이 판단은 왜 나왔는가를 시스템이 설명할 수 있는가?”  
> **v0 답**: `evidenceIds` + **평가 트레이스** + **증거 그래프**로 설명 경로를 남긴다.

---

## 1. Evidence ID (`evidenceIds`)

- [JUDGMENT_OUTPUT_TYPE.md](./JUDGMENT_OUTPUT_TYPE.md): 원칙적 필수, 예외는 `evidenceWaivedReason`.  
- ID는 **스토리지·로그·외부 시스템과 합의한 문자열**이면 된다(URI, UUID, 테이블 PK 등).

---

## 2. Traceability: input → rule → outcome

`evaluateJudgment` 반환값:

| 필드 | 의미 |
|------|------|
| `trace.ruleOrder` | 이번 평가에 사용된 규칙 순서(선행 순서 적용 후) |
| `trace.steps` | 각 규칙에 대해 `matched: true/false` |
| `trace.winningRuleId` | 첫 매칭 규칙(없으면 `null`) |
| `trace.inputSnapshot` | 입력 컨텍스트(감사·재현용) |
| `result` | [judgment-output.schema.json](../judgment-output.schema.json) 정렬 |

**설명 예**: “`trust-boundary-violation-deny`가 참이 되어 즉시 **DENY**; 이전 규칙 N개는 불참.”

---

## 3. Evidence graph (v0)

[evidence-graph.ts](../../../packages/lib/core/judgment/evidence-graph.ts)가 만든 **유향 그래프**:

- **노드**: `input`, `evidence`*, `rule`*, `outcome`  
- **엣지**: `contains`(입력이 증거를 포함), `evaluated_by`(이전 단계에서 다음 규칙으로 평가 진행), `produces`(마지막 규칙에서 outcome 생성)

v1+에서 **evidence 간 상호 인용**(그래프 엣지 확장), **rule 버전 노드**를 추가할 수 있다.

---

## 4. 로그 · UI 포맷 (v0)

런타임에서 바로 쓰기: [format-judgment-log.ts](../../../packages/lib/core/judgment/format-judgment-log.ts)

- `judgmentToStructuredLog` — JSON 로그·관측 백엔드
- `judgmentToPlainText` — 콘솔·텍스트 알림
- `judgmentToMarkdown` — 어드민·리포트 붙여넣기

---

## 5. 다음 단계 (헌법 밖 구현)

- **Evidence graph DB** — 노드/엣지 영속화 및 UI 탐색  
- **Open-lineage / W3C PROV** 정렬 — 외부 감사 요구 시  
- **자동 요약** — trace + graph를 자연어로( LLM은 마지막에 두고, 구조화 로그가 선행)

**관련**: [ENGINE_EVALUATION.md](./ENGINE_EVALUATION.md)

**최종 업데이트**: 2026-03-20
