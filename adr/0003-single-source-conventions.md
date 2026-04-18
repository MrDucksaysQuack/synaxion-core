# ADR-0003: 단일 소스 규칙 도입

**상태**: 수락  
**일자**: 2026-02-15

## 상황 (Context)

"인증됐는가?", "리다이렉트 URL은?", "이 필드 편집 가능한가?" 같은 질문에 여러 곳에서 각자 구현하면 판단이 어긋나고(예: 로그인 vs signup 혼동), 수정 시 전수 수정이 필요해진다. 같은 목적에 한 진입점만 두어야 했다.

## 결정 (Decision)

우리는 **단일 소스 규칙**을 도입하기로 했다.

- "이 판단/이 값"에 대해서는 **한 모듈·한 함수**만 사용한다.
- 인증·가입 완료: 클라이언트 useAuthState().state === 'console' / 서버 getAccountState, hasSignedUp(profile)
- React 브라우저 세션: **AuthSessionProvider 한 인스턴스** + `useAuth`는 Context 소비만; 제품 판단·API 허용 여부는 `useAuthState`(및 `authState`에서 파생한 session) 단일 패턴([AUTH_FLOW_PRINCIPLES](../04-safety-standards/AUTH_FLOW_PRINCIPLES.md) §5)
- 리다이렉트 URL: determineRedirectUrl(state, options). failureReason → state는 authStateFromFailureReason.
- 편집 가능 필드: getEditableFieldsForUser / getAllowedFieldsForTrustLevel (actions.ts)
- 권한: checkUnifiedPermission / usePermission, policy.ts 한 곳 정의.

단일 소스 목록은 **SINGLE_SOURCE_MAP** 및 **docs/standardization/SINGLE_SOURCE_CONVENTIONS.md**에서 유지한다.

## 대안 (Alternatives)

- **문서만 있고 강제 없음**: 드리프트 방지가 어렵다. check:signup-url 등 검증 스크립트로 보완.
- **타입/코드 생성으로 단일 소스 강제**: 이상적이지만 도입 비용 큼. 우선 문서 + check:* 로 시작.

## 결과 (Consequences)

- **긍정**: 판단 일관성, 변경 시 한 곳만 수정. SINGLE_SOURCE_MAP으로 시각화·온보딩 용이.
- **비용**: 새 "판단" 추가 시 맵과 문서 갱신 의무(META_CONSTITUTION).
- **검증**: `check:signup-url`, 기타 단일 소스별 check 확장(single-source drift 등)

**참조**: [SINGLE_SOURCE_MAP.md](../SINGLE_SOURCE_MAP.md), [SINGLE_SOURCE_CONVENTIONS.md](../../standardization/SINGLE_SOURCE_CONVENTIONS.md)
