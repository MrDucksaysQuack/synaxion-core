# Consumer Decision Contract (소비자 판단 계약)

**Status**: **LAW** — PR·CI에서 위반 시 실패한다. 설명용 아키텍처 메모와 동등하지 않다.  
**Enforcement**: `pnpm run check:consumer-facing-judgment-decision-only`, `pnpm run check:consumer-judgment-manifest-sync`, `pnpm run check:consumer-judgment-closure`  
**Related**: [CONSUMER_DECISION_LAYERS.md](../../../architecture/CONSUMER_DECISION_LAYERS.md) (진실 = 규칙·증거; UUID·gid는 정렬·추적 축), [CONSUMER_GATE_AND_RANK.md](../../../architecture/CONSUMER_GATE_AND_RANK.md)

---

## Consumer-facing API scope (normative)

아래 HTTP 경로만 **동일한 judgment 봉투**(`decisions` 필수, 참고 `score`, 선택 `explanation`)를 **공식 소비자 표면**으로 고정한다. **검색·브랜드 목록·독성 전용 등**은 이 목록에 없다 — 별도 계약·표면이다.

| Method | Path (pattern) | Notes |
|--------|----------------|--------|
| GET | `/api/v1/products/[barcode]/personalization-score` | 단일 제품 개인화 점수 |
| GET | `/api/v1/products/recommended` | 목록 행마다 동일 봉투 (`score`, `decisions`, `explanation`) |
| GET | `/api/v1/products/[barcode]/alternatives` | 루트·행 동일 봉투 |
| GET | `/api/v1/products/[barcode]/meta` | **`consumerJudgment` 슬라이스만** (전체 meta 페이로드의 일부) |

**Recommended 참고 점수** 필드명은 **`score`** 만 사용한다 (목록 행의 레거시 `personalizationScore`는 제거됨).

### Evaluation boundary (C1–C5, C8)

본 문서와 CI 봉인에서 말하는 **PASS/FAIL·“봉인”**은 **위 Consumer-facing API scope 표**에 한정한다. **검색·브랜드·독성 전용·기타 비표 경로**는 별도 계약·표면이며, 이 표의 준수 여부만으로 그 영역의 완결성을 판단하지 않는다.

### C4 / meta vs `consumerJudgment`

`GET …/meta` 응답 **전체**는 합성 페이로드다. **판단 계약**을 소비하는 쪽은 **`consumerJudgment` 슬라이스만** 보면 된다. (`decision` 등 다른 키의 레거시 필드가 병행될 수 있으나, 자격·제외의 근거는 여전히 **`Decision[]`** 규칙을 따른다.)

### Score and eligibility (normative, explicit)

**English:** **score MUST NOT be used to determine eligibility or exclusion** (visibility, filtering, or “can show”). It is for ordering, display, and transparency only, consistent with **Prohibition (eligibility)** and **O-4** below.

**Korean:** **score는 노출·제외·자격 판단에 사용되어서는 안 된다.** 정렬·표시·투명성 목적일 뿐이며, 아래 **Prohibition (eligibility)**·**O-4**와 동일 취지의 **판단 금지**다.

---

## Ontology (ItemWiki — normative)

ItemWiki는 “UUID-only 단일 진실”이 아니라 **레이어 분리 모델**을 쓴다. 평가·구현·코드 리뷰는 아래 정의를 전제로 한다.

**O-1.** The **single source of truth** for **consumer-facing eligibility / exclusion** is **`Decision[]`** (`ConsumerAvoidanceDecisionV0` / API `decisions`), not any numeric or explanatory field.

**O-2.** **UUID** (and stable feature / global ids where applicable) is an **alignment / normalization / learning key axis** — not a replacement for `Decision[]` and not the sole definition of “truth” for the whole system.

**O-3.** **Evidence** may appear on **`Decision` rows** (structured evidence refs for audit and stable contracts) **and** inside **`Explanation`** (e.g. ranking trace, score breakdown for transparency). **Eligibility itself** is still **determined only by `Decision` rules and rows**, not by re-deriving gate outcomes from explanation-only payloads.

**O-4.** **Ranking**, **score**, and **score breakdown** are **non-decisive** layers: they **order, explain, and surface** outcomes **after** the gate; they **must not** become a parallel source of gate truth.

---

## Prohibition (eligibility)

**English (normative):**

- No consumer eligibility decision may be derived from score, breakdown, or explanation.
- Any such usage is a contract violation.

**Korean:**

- score, breakdown, explanation을 기반으로 자격/제외 판단을 내리는 것은 계약 위반이다.

---

## Normative clauses (normative)

**C-1.** All **consumer-facing eligibility / exclusion / “can show this product”** decisions **MUST** be derived from **`Decision[]`** (`ConsumerAvoidanceDecisionV0` / API field `decisions`), typically by inspecting `decisions[].avoided` (and related fields defined on the decision row).

**C-2.** **No other field** may be used as a **source of truth** for that class of judgment, including:

- numeric **`score`** / **`personalizationScore`** / **`preferenceScore`**
- **`scoreBreakdown`** (whether on `explanation` or legacy shapes)
- **`explanation`** as a whole (including `evaluationSummary`, `rankingTrace`, and nested breakdown)

Those fields are **ranking, UX copy, transparency, and debugging** only. (This is the same substance as **Prohibition (eligibility)** above; both apply.)

**C-3.** **`ConsumerAvoidanceDecisionV0.evidence`** is part of the **formal decision row contract** (refs and auditability). It **MUST NOT** be used to **replace** eligibility logic with “score-like” shortcuts (e.g. treating breakdown or explanation as if it were the gate).

**C-4.** **`ConsumerExplanationV0`** (ranking trace, score breakdown, evaluation summaries) is for **interpretation and transparency**. It **MUST NOT** be used as the **authority** for eligibility; only **`Decision[]`** is.

**C-5.** The **personalization scorer** and **ranking** layers **MUST NOT** introduce **new** consumer gate outcomes. They may order, score, and explain only **after** the gate envelope is applied on the server.

**C-6.** **Learning / feedback aggregation** that claims to represent “user avoided / accepted” **SHOULD** key off **stable decision axis + UUID / feature ids** as defined in pipeline docs — **not** raw numeric score alone — consistent with **O-2** (alignment axis, not a separate gate). (ItemWiki: align with `truth_axis` / resolution truth policies where applicable.)

---

## Evaluation rubric (T1, T5)

내부·외부 평가 시 잘못된 루브릭으로 PASS/FAIL을 내지 않도록, 최소한 다음을 따른다.

- **T1 (Truth axis)** — 질문은 “UUID만 진실인가?”가 **아니다**. 올바른 질문은 **“소비자 자격·제외 판단의 SoT가 `Decision[]` 하나인가?”** 이다. UUID는 **O-2**의 정렬·식별 축이다.
- **T5 (Evidence)** — 질문은 “evidence는 explanation에만 있는가?”가 **아니다**. 올바른 질문은 **“판단 규칙과 자격은 `Decision`에서만 확정되는가?”**, **“score/breakdown/explanation이 eligibility를 우회하지 않는가?”** 이다. **Prohibition (eligibility)** 와 **C-3·C-4**를 기준으로 본다.

---

## 한국어 요약 (비규범)

- 소비자 **자격·제외·노출**의 유일한 근거는 **`Decision[]`** 이다. UUID·gid는 **정렬·식별·학습 축**이지, 그 자체가 “유일 진실”을 대체하지 않는다.
- **score, breakdown, explanation**으로 자격/제외 판단을 내리는 것은 **계약 위반**이다. 이들은 정렬·표시·투명성·설명용이다.
- `Decision` 행의 **evidence**는 판정 계약의 일부이고, **Explanation** 안의 trace·breakdown은 해석용이다. **자격 결정**은 여전히 **`Decision`만** 한다.
- 스코어러는 **새 게이트 결과를 만들지 않는다**. 학습·집계는 **결정 축·식별자**에 묶는 것을 권장한다.

---

## 시스템 종료 조건 (완성 정의)

아래 네 조건이 **동시에** 만족되면, 본 “소비자 판단 파이프”는 **완성된 상태**로 본다. 이후 변경은 **회귀 방지·관측·문서**가 중심이지, 기능 확장이 아니다.

1. **모든 대상 API**가 `decisions` + `explanation`(및 참고 `score`) **단일 표면**을 따른다.
2. **클라이언트·공개 UI**에서 `Decision[]` **외의 필드로 판단하지 않는다** (CI 검사로 강제).
3. **Scorer**는 판단(자격 박탈)을 하지 않고, 게이트 이후 **순위·수치·설명**만 담당한다.
4. **Learning**은 score 단독이 아니라 **결정 축·식별자**에 묶인다.

---

## Escape hatch

정적 검사가 **의도적으로** 허용해야 하는 한 줄만, 해당 줄에 주석을 단다:

```ts
// @consumer-judgment-allowed: <짧은 사유>
```

남용 시 리뷰에서 반려한다.

---

## Scope of the automated check

**SSOT**: `scripts/consumer-judgment-scan-manifest.json` (`scanDirs`, `extraFiles`, `discoveryRoots`, `sealBypassFiles`).

`scripts/check-consumer-facing-judgment-decision-only.ts`는 **레포 전역이 아니라 판단이 표면으로 나가는 구역**에 집중한다 (경로는 매니페스트와 동기화):

- `components/product/**` (제품·추천·대안 UI)
- `app/api/v1/products/**` (위 scope의 HTTP 응답 조립)
- (선택) `packages/web/hooks/product/**` — 동일 판단 맥락이 명확할 때만

`scripts/check-consumer-judgment-scan-manifest-sync.ts`는 위 스크립트가 매니페스트에서 경로를 읽는지 검사한다. `scripts/check-consumer-judgment-closure.ts`는 탐색 루트 아래 **휴리스틱으로 판단 표면이 감지되면** 해당 파일이 봉인 스캔 또는 문서화된 `sealBypassFiles`에 포함되는지 검사한다.

금지 규칙은 **단독 `score`**, `personalizationScore`, `preferenceScore`, `scoreBreakdown`, `explanation.*` 등 **의미 있는 식별자**에 한정하고, `toxicityScore` / `similarityScore` / `overallScore` 등 **다른 도메인 점수**는 기본 대상에서 제외한다 (오탐 방지).

서버의 `minScore` 정렬·랭킹 컷 등은 [CONSUMER_GATE_AND_RANK.md](../../../architecture/CONSUMER_GATE_AND_RANK.md) 에 따르며, 본 스크립트 범위 밖이다.
