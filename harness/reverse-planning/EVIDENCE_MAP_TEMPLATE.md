# Evidence Map

> **Reverse Planning Protocol — Step 5 산출물**  
> 복원 문서의 모든 Observed 주장과 그 근거 파일을 중앙 집중 관리한다.  
> Evidence Pointer 없는 주장은 Observed가 아니라 Inferred 또는 Unknown이다.

---

## 메타

```
프로젝트명: [프로젝트명]
작성 일시: [YYYY-MM-DD]
작성: [AI 모델 또는 담당자]
```

---

## 사용법

각 Observed 주장을 아래 형식으로 등록한다.

```
## [도메인] — [주장 요약]

- **Claim**: [구체적인 주장 문장]
- **Label**: Observed
- **Evidence**:
  - `[파일 경로]` — [관련 내용 설명]
  - `[파일 경로]:[라인 범위]` — [함수명 또는 필드명]
```

---

## Domain: DB Schema

<!-- 예시
## DB — orders 테이블에 status 컬럼이 존재한다

- **Claim**: orders 테이블은 status 컬럼을 가지며 pending / confirmed / completed 세 값을 허용한다.
- **Label**: Observed
- **Evidence**:
  - `db/migrations/20260101_create_orders.sql` — CREATE TABLE orders, status enum 정의
  - `src/lib/orders/status.ts:3-8` — OrderStatus enum 선언
-->

---

## Domain: API Routes

---

## Domain: UI Routes

---

## Domain: Auth / Permission

---

## Domain: State Transitions

---

## Domain: Env / Config

---

## Domain: External Services

---

## Evidence 없이 Inferred로 처리된 주장

<!-- Evidence가 충분하지 않아 Inferred로 처리한 주장들 -->

| 주장 | 추론 근거 | 확인 필요 사항 |
|------|---------|-------------|
| | | |

---

## Evidence 없이 Unknown으로 처리된 주장

<!-- 코드에서 전혀 확인할 수 없는 사항 — UNKNOWN_REGISTER로 이동 -->

| 항목 | 이유 |
|------|------|
| | |
