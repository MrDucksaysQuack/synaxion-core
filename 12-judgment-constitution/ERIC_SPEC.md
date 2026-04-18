# ERIC — Entity / Relation / Context / Impact

> **목적**: 임의 도메인의 **판단에 쓰이는 정보**를 네 차원으로 나누어 기술할 때, 중복·누락·모순을 줄인다.  
> 이 문서는 **온톨로지 표준**이 아니라 Synaxion **판단 헌법**에서 쓰는 **최소 공통 언어**다.

---

## 1. 네 차원 정의

| 차원 | 담는 것 | 담지 않는 것(원칙) |
|------|---------|-------------------|
| **Entity** | 판단의 대상이 되는 **개체**(사물, 사용자, 문서, SKU, 필지 …)와 그 **식별·유형** | 다른 개체와의 관계 전부(→ Relation) |
| **Relation** | 개체 **사이**의 연결(소유, 소속, 인용, 공급, 부모-자식 …)과 **방향** | 개체 단독 속성만(→ Entity) |
| **Context** | 판단 시점의 **조건**(시간, 역할, 환경, 정책 버전, 거래 단계 …) | 그 조건이 바꾼 **결과의 파급**(→ Impact) |
| **Impact** | 판단 또는 행동이 만드는 **변화**(상태 전이, 허용/거부, 로그, 알림, 대기열 …) | “왜 그런 조건인가” 설명 전부(→ Context) |

---

## 2. 배치 규칙

1. **한 사실, 한 주 차원**  
   동일命제를 Entity와 Relation에 **동일한 정보로 이중 기술**하지 않는다. 한쪽은 참조만 한다.
2. **Context는 재현 가능하게**  
   “당시 어떤 규칙·역할·시간대였는지”를 나중에 재현할 수 있게 최소 식별자를 남긴다.
3. **Impact는 관측 가능한 결과로**  
   추상적 “영향 있음” 대신 **상태·이벤트·출력** 중 무엇이 바뀌었는지 기술한다.
4. **모호하면 억지 정규화 금지**  
   네 칸에 억지로 넣지 말고, 판단은 [JUDGMENT_OUTPUT_TYPE.md](./JUDGMENT_OUTPUT_TYPE.md)의 **INSUFFICIENT_DATA** 또는 **HOLD**로 처리한다.

---

## 3. 중복 표현 시 우선 규칙

같은 사실이 두 차원에 들어갈 뻔할 때:

1. **Relation이 맞으면 Relation 우선** — Entity에는 식별자만, 서술적 관계 문장은 Relation으로만 적는다.  
2. **Impact vs Context** — “무엇이 바뀌었나”는 Impact, “어떤 조건에서였나”는 Context. 이유·근거 문장은 Context 또는 `evidenceIds`로 연결.  
3. **한 레코드·한 주 차원** — 나머지 차원은 참조 링크 또는 id로만 중복을 피한다.  
4. **충돌 시** — 정규화 단계에서 단일 값으로 합치지 말고 **CONFLICTING_SOURCES** 후보를 남기고 Federation·정책으로 합성한다.

---

## 4. 반례(흔한 오류)

- **Entity에 관계만 적음**: “A의 부모는 B” → Relation으로 옮긴다.
- **Impact에 이유만 적음**: “사용자 경험 개선을 위해 거부” → 이유는 Context(정책)·또는 별도 근거 필드; Impact는 “요청 거부됨 + 코드”.
- **Context 없이 규칙만 적용**: 동일 입력이 시간에 따라 달라지면 재현 불가 → Context 누락으로 본다.

---

## 5. 기존 Engineering 문서와의 연결

- API·핸들러의 “무엇을 읽고 무엇을 바꾸는가”는 [7_STAGE_LOGIC_CONSTRUCTION.md](../03-api-standards/7_STAGE_LOGIC_CONSTRUCTION.md)와 맞물린다.  
  ERIC는 그 **판단 재료**를 스펙 밖에서도 동일하게 말하기 위한 언어다.

---

**관련**: [JUDGMENT_DATA_FLOW.md](./JUDGMENT_DATA_FLOW.md), [DECISION_RULES.md](./DECISION_RULES.md)

**최종 업데이트**: 2026-03-20
