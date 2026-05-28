# AI Agent Handoff Protocol

> **Synaxion Constitution 11장 — 보편 프로토콜**
> 분석 에이전트(Claude)가 만든 계획을 실행 에이전트(Cursor 등)에게
> 정보 손실 없이 최소 토큰으로 전달하는 표준 절차를 정의한다.

**버전**: 1.0.0
**작성일**: 2026-05-28

---

## §0 역할과 범위

### 이 프로토콜이 다루는 것

```
Claude 분석/계획
  → 7블록 핸드오프 태스크 작성
  → Cursor(실행 에이전트)에게 전달
  → 구현
  → Claude 리뷰
```

### 이 프로토콜이 다루지 않는 것

- Claude 내부 분석 절차 (→ CLAUDE.md 운영 원칙)
- 정방향 계획 (→ 00-planning/FORWARD_PLANNING_PROTOCOL.md)
- 역방향 복원 (→ 11-protocols/REVERSE_PLANNING_PROTOCOL.md)

### 핵심 명제

> **AI는 맥락을 재탐색하지 않아도 될 때 가장 효율적으로 실행한다.**

핸드오프 태스크의 목적은 실행 에이전트가 레포 전체를 다시 뒤지지 않고도
"무엇을·어디서·어떻게 끝냈는지"를 알 수 있게 하는 것이다.

---

## §1 7블록 스키마

모든 핸드오프 태스크는 아래 순서로 작성한다.
위에서 아래로 읽을수록 "무엇을 할지"가 좁혀진다.

### 1. 목표 (Outcome)

끝났을 때 시스템/사용자가 어떻게 되는지 **1~2문장**.
동사 + 결과물 형식. 작업 나열 금지.

```
# 약함
Synaxion 맞춰줘

# 강함
check:constitution-version이 2.14.0으로 통과되고,
README 락이 VERSION 파일과 동기화된 상태.
```

### 2. 맥락 (Context)

이미 알고 있는 사실만. **3~7줄**.

```
- SSOT: @파일명 (텍스트 경로 대신 @멘션 우선)
- 증거: 터미널 에러 L1003 / 실패 스펙 경로
- 이미 시도함: X 방법으로 했으나 Y 이유로 실패 (버그픽스 시 필수)
- 전제: submodule @ 커밋해시
```

50줄 히스토리, "예전에 말했던 것"은 맥락이 아니다.

### 3. 범위 (Scope)

건드릴 파일/영역과 하지 말 것을 **대칭으로** 명시.

```
In:  package.json, README.md, scripts/check-constitution-version.ts
Out: playwright-report, .cursor/plans, 무관 리팩터, 커밋/푸시
```

Out이 없으면 실행 에이전트는 "친절하게" 주변까지 수정한다.

### 4. 우선순위 (Tradeoff)

충돌이 있을 때만 작성. **없으면 생략** (= 기본 Constitution 규칙 따름).

```
Structure First → Safety → Quality
이번 건: Quality(테스트 green) < Safety(레이어 경계)
```

### 5. 제약 (Constraints)

실행 가능한 것만.

```
- pnpm run check:constitution-version 통과
- packages/lib 외 수정 금지
- 커밋은 명시적 요청 시에만
```

### 6. 완료 기준 (Done)

**검증 명령을 그대로** 적는다. 체크박스 형식 권장.

```
- [ ] pnpm run check:constitution-version
- [ ] 변경 요약 3줄 (왜/무엇/다음)
```

실행 에이전트가 "끝났다"고 착각하는 일이 줄어든다.

### 7. 권한 (Authority)

망설임 비용을 제거한다.

```
- 가정 OK: 스크립트·문서 1파일 수정, 타입 수정
- 질문 후 진행: 아키텍처 선택, 신규 레이어 추가, 외부 의존성
- 절대 금지: submodule upstream 직접 푸시
```

---

## §2 유형별 최소 구조

7블록 전부가 필요한 경우는 아키텍처 변경·도메인 신규 설계뿐이다.
대부분의 작업은 15~25줄로 충분하다.

| 유형 | 필수 블록 | 자주 생략 |
|------|-----------|-----------|
| 버그 픽스 | 목표 + 맥락(증거+이미시도함) + In/Out + Done | 우선순위·제약 |
| 신규 문서 | 목표 + @SSOT파일 + In/Out + Done | 우선순위·제약·권한 |
| 리팩터 | 목표 + In/Out + 우선순위 + Done + 권한 | 맥락(자명할 때) |
| E2E 수정 | 스펙 경로 + `--project=chromium` + 재현 명령 + Done | 4·5·7 |
| Synaxion 문서 | 목표 + @템플릿파일 + In/Out + Done | 4·5 |

---

## §3 @멘션 규칙

텍스트 경로보다 `@파일멘션`이 탐색 단계를 없앤다.

```
# 텍스트 경로 (실행 에이전트가 탐색 필요)
SSOT: docs/planning/03-synaxion-compliance-improvement-plan.md

# @멘션 (즉시 컨텍스트에 포함)
@03-synaxion-compliance-improvement-plan.md 기준으로 ...
```

CLAUDE.md·Constitution에 이미 있는 규칙(레이어 경계, 우선순위 등)은
블록에서 생략한다. 중복 작성은 노이즈다.

---

## §4 능률을 떨어뜨리는 패턴

| 패턴 | 손해 |
|------|------|
| "알아서 잘 해줘" | 탐색·추측·과잉 수정 |
| 목표 3개를 한 메시지에 | 우선순위 재해석 비용 |
| 전체 레포/전체 E2E 지시 | 런타임 폭증 + 인프라 실패 혼동 |
| "리팩터도 해줘" (범위 외 추가) | diff·리뷰 비용 폭발 |
| "아까 그거" (이전 대화 전제) | transcript 없으면 환각·재조사 |
| 해결책 강제 ("무조건 X로") | 더 나은 기존 패턴 무시 |

---

## §5 Tier

| 항목 | 값 |
|------|-----|
| Tier | 2 — 팀 선택 적용 |
| 자동 검증 | 없음 (PR 체크리스트로 권장) |
| 인스턴스 템플릿 | 프로젝트별 `CURSOR_TASK_TEMPLATE.md` |

Tier 1이 아닌 이유: 핸드오프 형식 자체는 check:*로 강제할 수 없다.
단, **Cursor를 사용하는 PR**에는 프로젝트 PR 체크리스트 항목으로 포함을 권장한다.

---

**최종 업데이트**: 2026-05-28
