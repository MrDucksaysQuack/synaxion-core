# ADR-0002: API Handler Factory 단일 패턴 채택

**상태**: 수락  
**일자**: 2026-02-15

## 상황 (Context)

API 라우트마다 withMetrics, withAuth, 검증, 에러 처리, 권한 체크를 각자 구현하면 중복과 누락(예: 메트릭 빼먹음, 권한 분기 불일치)이 생긴다. "인증 필요 + 정책 기반 권한"을 한 진입점으로 통일할 필요가 있었다.

## 결정 (Decision)

우리는 **createGetHandler / createPostHandler + checkAuthorization: { resource, action }** 를 단일 패턴으로 채택하기로 했다.

- 신규·수정 API는 가능한 한 이 팩토리만 사용.
- requireProfile은 라우트가 넘기지 않고, **정책(policy.ts)**에서만 읽고 handler-common이 사용.
- 인증·권한·7단계 흐름·측정·표준 에러 형식이 한 곳에 묶인다.

## 대안 (Alternatives)

- **라우트마다 withAuth + 수동 checkAuthorization**: 이미 일부 라우트에 존재. 패턴이 흩어져 동일 동작 보장이 어렵다. 점진적으로 팩토리로 이전.
- **미들웨어만으로 권한 처리**: 리소스/액션별 정책이 복잡해지면 미들웨어만으로는 부족. 핸들러 내 checkAuthorization으로 유지.

## 결과 (Consequences)

- **긍정**: 새 라우트 추가 시 "팩토리 + 정책"만 맞추면 일관성 확보. check:permission-drift로 정책·코드 불일치 탐지 가능.
- **비용**: 기존 withAuth 직접 사용 라우트는 점진적 이전 필요.
- **검증**: 코드 리뷰, `check:constitution`(직접 패턴 위반 시), 정책 기반 권한은 `check:permission-drift`

**참조**: 프로젝트의 구조·API 표준 헌법 (예: [Itemwiki PROJECT_STRUCTURE](../../itemwiki-constitution/itemwiki-specific/architecture/PROJECT_STRUCTURE_CONSTITUTION.md) §3)
