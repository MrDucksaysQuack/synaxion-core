# 페이지·폼 UX 휴리스틱 (검증 표준)

**목적**: 설정·콘솔·온보딩 등 **한 화면에 결정이 많이 쌓이는 UI**를 일관된 축으로 평가·개선하기 위한 **보편 체크리스트**를 둔다.  
**Tier**: 2 (권장). 프로젝트/팀 단위로 PR 리뷰·정기 감사에 사용.  
**근거 정렬**: [IA_NAVIGATION_PRINCIPLES.md](./IA_NAVIGATION_PRINCIPLES.md) (Hick’s Law, 인지 부하), [10-design-flow/DESIGN_FLOW_PRINCIPLES.md](../10-design-flow/DESIGN_FLOW_PRINCIPLES.md) (한 목적, View→Act, 목적 기반 카피), [UX_FEEDBACK_AND_ACCESSIBILITY.md](./UX_FEEDBACK_AND_ACCESSIBILITY.md) (피드백·폼 구역).

---

## 1. 적용 범위

| 적합 | 덜 적합 (다른 기준 우선) |
|------|---------------------------|
| 설정/프로필/선호도 폼, 긴 옵션 나열 | 단일 CTA 랜딩, 읽기 전용 상세 |
| 탭 안에 여러 Organism이 세로로 이어진 화면 | 검색 결과 그리드(필터는 별도 IA 문서) |
| 마법사 일부 단계가 “설문형”인 경우 | 플레이어·에디터 등 전문 도구(도메인별 가이드) |

**단위**: “페이지”뿐 아니라 **탭 패널·모달·접이식 섹션 하나**도 동일 축으로 평가할 수 있다. (스코프를 문서/PR에 명시.)

---

## 2. 일곱 축 — 보편 정의

취약 사용자군 설정에서 도출한 관찰을 **식별자·질문 형태**로 일반화한다.

### D1 — 결정 밀도 (Decision density)

- **질문**: 이 화면(또는 섹션)에서 사용자가 **켜/끄·택일·입력**해야 하는 **독립 결정**이 몇 개인가?
- **가이드**: 한 눈에 보이는 구역 기준으로 **3~7개를 넘으면** [IA §2 Hick’s Law](./IA_NAVIGATION_PRINCIPLES.md)에 맞춰 **그룹화·단계 분리·접기**를 검토한다.
- **신호**: “전부 읽고 전부 정해야 할 것 같다”, 스크롤만 길고 끝이 안 보인다.

### D2 — 목적 단일성 (Purpose separation)

- **질문**: **“나/내 데이터에 대한 선언”**과 **“시스템이 어떻게 동작할지(정책·필터·알림)”**이 한 블록에 섞여 있는가?
- **가이드**: [Design Flow §1 한 페이지 한 목적](../10-design-flow/DESIGN_FLOW_PRINCIPLES.md)에 가깝게, **목적이 다르면 제목·fieldset·탭·페이지**로 나눈다.
- **신호**: “여기서 뭘 하러 왔는지” 한 문장으로 말하기 어렵다.

### D3 — 시각적 위계 (Visual hierarchy)

- **질문**: **주요 행동(저장, 필터 총스위치 등)**이 **보조 옵션**과 같은 카드/테두리 패턴으로 반복되는가?
- **가이드**: 반복 카드는 “전부 동급”으로 읽힌다. **1차/2차**를 타이포·밀도·배치로 구분한다.
- **신호**: 스캔했을 때 손댈 곳이 한 군데로 안 모인다.

### D4 — 수직 스캔 비용 (Vertical scan cost)

- **질문**: 첫 뷰포트에서 **구조(몇 단계·무엇이 요약인지)**가 잡히는가?
- **가이드**: **요약 → 상세** 순서, **접기·단계**, 짧은 행(부연은 툴팁/`sr-only`) 등으로 **첫 화면 정보량**을 줄인다.
- **신호**: 스크롤 없이는 “지금 어디쯤인지” 모르겠다.

### D5 — 주 액션 대 잡 액션 (Primary vs auxiliary actions)

- **질문**: **되돌리기·고급·실험적** 기능이 **저장/다음**과 같은 눈높이에 있는가?
- **가이드**: 보조 기능은 **접기·메뉴·텍스트 링크**로 낮추고, **주 계약은 저장·취소(또는 다음)**에 맞춘다.
- **신호**: “또 뭘 눌러야 하지?”

### D6 — 언어·멘탈 모델 (Copy & mental model)

- **질문**: 카피가 **구현 세부(점수, 파이프라인, 내부 용어)**를 먼저 드러내는가, **사용자 결과(경고·추천·프라이버시)**를 먼저 말하는가?
- **가이드**: [Design Flow §5 목적 기반](../10-design-flow/DESIGN_FLOW_PRINCIPLES.md). 기술 설명은 **보조 문장·툴팁·“자세히”**로.
- **신호**: 설정 이름만 보고 효과를 상상하기 어렵다.

### D7 — 이웃 맥락 (Adjacent context)

- **질문**: **같은 탭·같은 스크롤 구간**에 유사한 “긴 폼” 블록이 연속되는가?
- **가이드**: 탭/페이지 쪼개기, 섹션 간 **시각적 리듬(구분선·여백·짧은 요약)**, 필요 시 **진행 상태** 표시.
- **신호**: 한 탭이 전부 “설문지 덩어리”로 느껴진다.

---

## 3. 빠른 체크리스트 (PR·자가 점검)

스코프: `________` (예: `/preferences` 기본 설정 탭, `SensitiveGroupsSettings` 단독)

| ID | 통과 기준 (한 줄) | 이 화면 |
|----|-------------------|--------|
| D1 | 한 구역에 **동시에 보이는** 독립 결정 ≤ 7이거나, 그룹/단계로 나뉨 | ☐ / 메모 |
| D2 | “데이터 선언”과 “동작 정책”이 제목·구조상 분리됨 | ☐ |
| D3 | 주요 조작이 시각적으로 한 단계 위로 읽힘 | ☐ |
| D4 | 상단(또는 고정 영역)에 **요약·단계**가 있음 | ☐ |
| D5 | 저장/다음이 최종 동선의 중심, 잡기능은 덜 눈에 띔 | ☐ |
| D6 | 첫 문장이 **사용자 관점 결과**를 말함 | ☐ |
| D7 | 아래 이웃 블록과 리듬·구획이 과도하게 이어지지 않음 | ☐ |

**메모**: 실패 항목은 “다음 스프린트” 또는 “본 PR 범위 밖”을 명시하고, 이슈/ADR에 한 줄 남긴다.

---

## 4. 헌법·린트와의 관계

- **자동화 불가 항목**: D2, D6, D7은 ESLint로 완전 대체하기 어렵다 → **체크리스트·디자인 리뷰**가 표준 검증.
- **부분 정렬 가능**: D1(선택지 수)은 특정 패턴(예: `tabs.length`)에 한해 스크립트 힌트 가능 — 프로젝트 선택.
- **접근성**: 구역 분리 시 `fieldset`/`legend`, `aria-labelledby`는 [UX_FEEDBACK §2](./UX_FEEDBACK_AND_ACCESSIBILITY.md)와 함께 점검.
- **PR·스프린트**: 해당 화면을 수정한 PR에서는 §3 표를 **스코프 한 줄 + 통과/메모**만 채우는 것을 권장한다. 실패 항목은 PR 본문·이슈·ADR 중 한 곳에 한 줄로 남긴다.

---

## 5. 롤아웃 제안 (Itemwiki)

1. **파일럿**: 이미 개선한 컴포넌트를 **기준 예시**로 링크 (코드 주석에 본 문서 §2 참조 가능).
2. **우선 순위 페이지**: `app/(console)/preferences/**`, `profile/**` 설정류, 온보딩 다단계 폼.
3. **주기·검증**: 쿼터별 1~2 화면 또는 “**터치한 화면은 §3 표 한 줄**(스코프 + 통과/메모)” 규칙. D2·D6·D7은 §4대로 린트로 끝나지 않으므로, PR에서 그 한 줄이 실제로 채워졌는지 리뷰어가 확인한다.
4. **백로그·제외 경로**: 화면별 Phase·`preferences/sets/**` 리다이렉트·공유 세트 종료는 [PAGE_FORM_AUDIT_BACKLOG.md](../../itemwiki-constitution/itemwiki-specific/input-persistence/PAGE_FORM_AUDIT_BACKLOG.md)에 정리한다. `sets/**`는 UI 롤아웃 대상에서 제외한다.
5. **재발 방지 습관 (기능 추가 시)**  
   - **한 목적·중복 UI**: 탭·모달을 건드리면 “이 블록의 목적 한 문장”과 “같은 CTA가 두 군데 생기지 않았는지”를 PR에서 한 번 확인한다. ([FRONTEND_LAYER_PRINCIPLES.md](./FRONTEND_LAYER_PRINCIPLES.md) §2 단일 목적·중복 금지와 같이 본다.)  
   - **데이터 많을 때 (D4·D7)**: 긴 리스트·카드는 접기·처음 N개·더 보기를 기본으로 두고, IA 구조 변경이 필요하면 별도 설계 문서로 넘긴다.  
   - **모바일 (D3·D5)**: 긴 폼·하단 고정 바·탭 동선을 바꾼 PR은 좁은 뷰포트에서 주 버튼 위계를 한 번 확인한다.  
   - **인증 판단 분산**: 컴포넌트 안에 `const checkAuth = …`만 두고 `useAuthState`를 쓰지 않으면 `pnpm run check:conceptual-rot`(별칭 `check:decision-logic`)이 실패한다. Flow 전용이면 `ensureAuthenticatedForFlow`처럼 **이름을 분리**하거나, 팀 표준대로 `useAuthState`를 함께 쓴다.

---

## 6. 관련 문서

- [IA_NAVIGATION_PRINCIPLES.md](./IA_NAVIGATION_PRINCIPLES.md)  
- [DESIGN_FLOW_PRINCIPLES.md](../10-design-flow/DESIGN_FLOW_PRINCIPLES.md)  
- [UX_FEEDBACK_AND_ACCESSIBILITY.md](./UX_FEEDBACK_AND_ACCESSIBILITY.md)  
- [FRONTEND_LAYER_PRINCIPLES.md](./FRONTEND_LAYER_PRINCIPLES.md)  
- [INPUT_PERSISTENCE_SCHEMA_ALIGNMENT.md](./INPUT_PERSISTENCE_SCHEMA_ALIGNMENT.md) — 폼 데이터와 저장 스키마 정렬·mapper 필수·SSOT·부분 실패 정책·Round-trip·PR 항목 IP-1~6(권위 시점은 [UI_INPUT_RENDER_AUTHORITY.md](./UI_INPUT_RENDER_AUTHORITY.md))  

---

**최종 업데이트**: 2026-03-23 (§5 재발 방지 습관·conceptual-rot 안내; §6 입력-저장 정렬 링크)
