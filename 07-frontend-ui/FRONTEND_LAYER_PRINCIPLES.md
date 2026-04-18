# 프론트엔드 계층 원칙 (Frontend Layer Principles)

**목적**: 프론트엔드 계층의 역할, 페이지 설계 원칙, 데이터 흐름에 따른 렌더링 전략, 상태 관리 원칙을 범용적으로 정의합니다.

**참고**: 구체적 레이아웃·패턴·훅 이름은 프로젝트 인스턴스(예: itemwiki-constitution)에서 정의합니다.

---

## 1. 프론트엔드 계층 역할

- **위치**: `app/`, `components/`, `pages/` 등 클라이언트 UI 코드.
- **역할**: 사용자 인터페이스 제공, 사용자 입력 수집, 서버와의 계약 준수.
- **의존성**: API 계층을 통해서만 서버 통신. Domain/Core는 프로젝트 정책에 따라 선택적 직접 사용. Engine 직접 의존 금지.

자세한 경계는 [LAYER_BOUNDARIES.md](../01-foundations/LAYER_BOUNDARIES.md)를 참고하세요.

---

## 2. 페이지 설계 원칙

### 2.1 단일 목적 원칙

- **한 페이지 = 한 목적.** 복합 목적(검색+생성+수정 등)은 별도 페이지로 분리.
- **한 화면 = 한 기능.** 복잡한 작업은 단계별로 분리.

### 2.2 동일 기능 중복 금지

- 같은 기능(검색창, 저장 버튼, 필터 패널 등)이 한 페이지에 2회 이상 나타나면 안 됨. 모바일/데스크톱에서 같은 기능이 다른 위치에 있어도 중복으로 간주.

### 2.3 정보 배치

- 정보는 **중요도** 기준으로 위에서 아래로 배치.
- 가장 중요한 정보는 화면 상단 1/3. 관련 정보는 그룹화.

---

## 3. 데이터 흐름 방향과 렌더링 전략

**핵심 원칙**: 데이터 흐름 방향에 따라 렌더링 전략을 결정한다.

### 3.1 시스템 → 사용자 (정보 제공)

- **특징**: 시스템이 사용자에게 정보를 제공. 정보 가용성·중요도가 동적.
- **렌더링**: **정보 우선순위 기반 동적 구성.**  
  정보의 가용성에 따라 표시 여부를 결정하고, 중요도에 따라 순서를 결정. 사용자가 스크롤해 찾게 하지 않고, 시스템이 우선순위를 정해 상단에 배치.
- **적용 예**: 상세 페이지, 정보 조회, 대시보드.

### 3.2 사용자 → 시스템 (입력)

- **특징**: 사용자가 시스템에 정보를 입력.
- **렌더링**: **컴포넌트 중심 안정적 구조.**  
  구조가 안정적이고 예측 가능해야 하며, 입력 흐름이 명확하고 직관적이어야 함.
- **적용 예**: 등록·편집·설정·폼 입력 페이지.

### 3.3 혼합 페이지

- 읽기/쓰기가 혼재면 **컴포넌트 단위**로 방향을 나눔.  
  읽기 영역 → 정보 중심, 쓰기 영역 → 컴포넌트 중심.

---

## 4. 상태 관리 원칙

### 4.1 직접 상태 vs 추상화

- **직접 상태 허용**: 단순 UI 상태(모달 열림/닫힘, 탭 선택), 컴포넌트 내부에서만 쓰이는 일시적 상태, 다른 컴포넌트와 공유하지 않는 상태.
- **추상화 필수**: 비동기 작업(로딩·에러·데이터), 폼 상태·검증, 복잡한 연관 상태, 재사용 가능한 상태 로직 → **훅 또는 단일 진입점**으로 관리.

### 4.2 비동기 상태

- 로딩·에러·데이터를 한 덩어리로 다루는 패턴 사용. `setLoading(true)` 후 예외 시에도 반드시 `setLoading(false)` 되도록 finally 등으로 처리. (상세: [UX_SAFETY_RULES](../04-safety-standards/UX_SAFETY_RULES.md))

### 4.3 인증·권한

- 클라이언트에서 인증/권한 판단은 **훅 또는 정책 단일 진입점**만 사용. 컴포넌트 내부에서 `checkAuth` 직접 구현·중복 판단 로직 금지. (상세: [CONCEPTUAL_ROT_PREVENTION](../04-safety-standards/CONCEPTUAL_ROT_PREVENTION.md))
- **세션 데이터 경로**: 루트 **AuthSessionProvider**에서만 브라우저 세션을 동기화하고, UI는 `useAuthState`(+ 필요 시 `authState`에서 파생한 `session`)로만 읽는다. 같은 모듈에서 `useAuth`+`useAuthState`를 **토큰 목적으로 병용하지 않는다**. (상세: [AUTH_FLOW_PRINCIPLES](../04-safety-standards/AUTH_FLOW_PRINCIPLES.md) §5)

### 4.4 전역 공유

- 여러 컴포넌트가 동일 리소스를 조회할 때는 **전역 상태 공유 또는 단일 진입점**을 사용해 중복 요청을 막음. 프로젝트별로 패턴(훅 이름·캐시 전략)을 정의.

---

## 5. 적용 시 참고

- **레이아웃( F/Z 패턴, 3구역, 반응형)**·**버튼/색상 체계**·**구체적 UI 패턴**은 프로젝트 인스턴스의 UI 헌법·패턴 가이드를 따릅니다.
- **Itemwiki 예**: [UI_CONSTITUTION](../../itemwiki-constitution/itemwiki-specific/ui-ux/UI_CONSTITUTION.md), [PAGE_CONSTITUTION](../../itemwiki-constitution/itemwiki-specific/ui-ux/PAGE_CONSTITUTION.md), [FRONTEND_STATE_MANAGEMENT_CONSTITUTION](../../itemwiki-constitution/itemwiki-specific/state-management/FRONTEND_STATE_MANAGEMENT_CONSTITUTION.md), [DATA_FLOW_RENDERING_GUIDE](../../itemwiki-constitution/itemwiki-specific/ui-ux/DATA_FLOW_RENDERING_GUIDE.md).

---

**최종 업데이트**: 2026-03-21 — §4.3 AuthSessionProvider·훅 병용 금지
