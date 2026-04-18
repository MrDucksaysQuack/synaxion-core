# ADR-0001: 3계층 아키텍처 채택 (API → Domain → Core)

**상태**: 수락  
**일자**: 2026-02-15

## 상황 (Context)

비즈니스 로직, HTTP 인터페이스, 인프라(DB·인증·로거)가 한데 섞이면 변경 영향 범위가 불명확하고, 도메인 간 의존이 생겨 리팩토링 비용이 커진다. "어디에 무엇을 둘지"에 대한 일관된 규칙이 필요했다.

## 결정 (Decision)

우리는 **3계층**을 채택하기로 했다.

- **API Layer** (`app/api/`): HTTP 요청/응답, 인증·권한 체크, 검증. 비즈니스 로직은 호출만.
- **Domain Layer** (`packages/lib/domain/`): 비즈니스 로직. 도메인별 독립, 다른 도메인 직접 의존 금지.
- **Core Layer** (`packages/lib/core/`): 타입, 로거, 인증/권한 정책 정의, API 클라이언트, 설정. 도메인·API에 의존하지 않음.

의존 방향: **API → Domain → Core** (단방향만 허용).

## 대안 (Alternatives)

- **2계층(API + Core만)**: Domain이 없으면 비즈니스 로직이 API나 Core에 흩어져 계층이 무의미해짐. 거절.
- **4계층(Engine 분리)**: Engine을 Domain과 Core 사이에 두는 경우. Itemwiki는 일단 Domain 내에서 엔진 패턴을 쓰고, 물리적 Engine 계층은 필요 시 도입. 현재는 3계층으로 단순화.

## 결과 (Consequences)

- **긍정**: 변경 영향 범위 예측 가능. check:layer-boundaries로 위반 자동 탐지. 온보딩 시 "어디에 넣을지" 명확.
- **비용**: 새 기능 추가 시 계층 배치를 한 번 더 생각해야 함.
- **검증**: `check:layer-boundaries`, `check:dependency-graph`

**참조**: 프로젝트의 계층 경계 문서 (예: [Itemwiki LAYER_BOUNDARIES](../../itemwiki-constitution/itemwiki-specific/architecture/LAYER_BOUNDARIES.md))
