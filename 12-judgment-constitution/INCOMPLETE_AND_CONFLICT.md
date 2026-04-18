# Incomplete & Conflict (불완전·모순)

> 운영에서 무너지지 않으려면 **판단 결과 타입**이 먼저 고정되어 있어야 한다.  
> **단일 소스**: [JUDGMENT_OUTPUT_TYPE.md](./JUDGMENT_OUTPUT_TYPE.md) · [judgment-output.schema.json](../judgment-output.schema.json)

이 문서는 **Engineering 문서와의 매핑**만 유지한다. enum 정의는 OUTPUT_TYPE을 따른다.

---

## Engineering 문서 → 판단 outcome (참고)

| Engineering 영역 | 판단 층에 가깝게 매핑되는 outcome |
|------------------|-----------------------------------|
| [SILENT_FAILURE_PREVENTION.md](../04-safety-standards/SILENT_FAILURE_PREVENTION.md) | **INSUFFICIENT_DATA** / **DEGRADED_CONFIDENCE** + 관측 필수 |
| [STALE_UI_PREVENTION.md](../04-safety-standards/STALE_UI_PREVENTION.md) | **DEGRADED_CONFIDENCE** UI 또는 **HOLD** 후 재조회 |
| [META_CONSTITUTION.md](../META_CONSTITUTION.md) 원칙 충돌 | **ESCALATE_TO_HUMAN** 또는 ADR 기반 **DENY/ALLOW** |
| [AUTH_FLOW_PRINCIPLES.md](../04-safety-standards/AUTH_FLOW_PRINCIPLES.md) | **INSUFFICIENT_DATA** / **HOLD** (재인증·리다이렉트) |

---

## 규칙 작성 시

- 암묵적 “else DENY”보다, **INSUFFICIENT_DATA**·**HOLD**·**ESCALATE_TO_HUMAN** 중 어떤 기본 분기인지 명시하는 것을 권장한다.
- 출처 모순은 **CONFLICTING_SOURCES**로 먼저 진단한 뒤, 정책에 따라 **DENY** / **ESCALATE_TO_HUMAN** / 추가 수집을 `nextAction`으로 연결한다.

**관련**: [ERIC_SPEC.md](./ERIC_SPEC.md), [JUDGMENT_DATA_FLOW.md](./JUDGMENT_DATA_FLOW.md)

**최종 업데이트**: 2026-03-20
