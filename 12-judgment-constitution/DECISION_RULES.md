# Decision Rules (판단 규칙)

> **데이터(ERIC 상태) → 판단 결과** 를 사람·기계가 같이 읽게 적는 형식.  
> **`outcome` 문자열은 [JUDGMENT_OUTPUT_TYPE.md](./JUDGMENT_OUTPUT_TYPE.md) 및 [judgment-output.schema.json](../judgment-output.schema.json) 과 동일**해야 한다.

---

## 1. 파일 위치

| 구분 | 위치 |
|------|------|
| **출력 타입(단일 소스)** | [JUDGMENT_OUTPUT_TYPE.md](./JUDGMENT_OUTPUT_TYPE.md), [judgment-output.schema.json](../judgment-output.schema.json) |
| **규칙 스키마** | [decision-rules.schema.json](../decision-rules.schema.json) |
| **코어 예시** | [decision-rules.example.json](../decision-rules.example.json) — `check:decision-rules` |
| **프로젝트 인스턴스** | 예: [itemwiki decision-rules.json](../../itemwiki-constitution/decision-rules.json) |

---

## 2. 규칙 필드

- **id**, **title**, **when**, **outcome**, **requiredDimensions** — 필수 (`requiredDimensions`는 ERIC 축 **최소 1개**; [ERIC_SPEC.md](./ERIC_SPEC.md)).
- **rationaleDoc** — 선택.
- **match** XOR **matcherRef** — 필수(하나만). `match`는 [declarative-match.ts](../../../packages/lib/core/judgment/declarative-match.ts), `matcherRef`는 아래 §3.

---

## 3. `matcherRef` 정책 (escape hatch ~30%)

**원칙**: 기본은 선언형 **`match`**. 다음을 만족할 때만 **`matcherRef`** + **`matcherRefReason`**(필수·CI 강제)를 쓴다.

| 단계 | 내용 |
|------|------|
| 1 | 동일 조건을 **얕은 DSL**(`allOf`/`flag`/`itemwiki` 등, 중첩 ≤4)로 표현했을 때 **트리가 비대**하거나 **중복 서술**이 생기는가? |
| 2 | 도메인 술어를 **한 함수**로 캡슐화하는 편이 **감사·대칭 규칙**(allow/deny 쌍) 유지에 유리한가? |
| 3 | PR에 **허용 목록 추가**가 필요한가? 새 ref는 [escape-matcher-registry.ts](../../../packages/lib/core/judgment/escape-matcher-registry.ts)의 `JUDGMENT_MATCHER_REF_ALLOWLIST`에만 등록한다. |

**이중 검토(팀 룰)**:

- 신규 `matcherRef` PR에는 **(a)** 제품/도메인 오너 리뷰, **(b)** Judgment·헌법 담당 1인 확인을 권장한다.
- “나중에 DSL로 당길 수 있는지”를 **`matcherRefReason`** 한 줄에 남긴다(리팩터링 우선순위).

**검증**: `pnpm run check:decision-rules` · `check:decision-rules:itemwiki` · `check:judgment-runtime-rules` (`--strict-matcher-ref-reason`).

---

## 4. 마이그레이션 (Constitution ≤2.4 `outcome` 명칭)

| 이전 | 이후(권장 매핑) |
|------|-----------------|
| DEFER | **INSUFFICIENT_DATA**(정보 부족) 또는 **HOLD**(비동기 대기)로 쪼갬 |
| DEGRADED | **DEGRADED_CONFIDENCE** |
| ESCALATE | **ESCALATE_TO_HUMAN** 또는 상황에 따라 **CONFLICTING_SOURCES**만 먼저 |

---

## 5. Decision Registry와의 관계

| Artifact | 질문 |
|----------|------|
| `decision-registry.json` | “이 **결정 축**은 코드 **어디 한 곳**에서 하느냐?” |
| `decision-rules.json` | “**어떤 조건**이면 **어떤 outcome**이냐?” |

---

## 6. 검증 · 권장 적용 순서

**검증**은 스펙이 안정된 뒤 단계적으로 켠다([README 권장 순서](./README.md)).

```bash
pnpm run check:decision-rules
pnpm run check:decision-rules:itemwiki   # docs 인스턴스
pnpm run check:judgment-runtime-rules    # 번들(JSON) — 배포본과 문서본 동기 확인
# 또는
pnpm exec tsx docs/constitution/scripts/check-decision-rules.ts --strict-matcher-ref-reason --rules=docs/<project>-constitution/decision-rules.json
```

**관련**: [DECISION_REGISTRY.md](../DECISION_REGISTRY.md), [ERIC_SPEC.md](./ERIC_SPEC.md)

**최종 업데이트**: 2026-03-21 (G2: ERIC 필수·matcherRef 정책)
