# ADR-0005: 구조 생성 CLI 도입

**상태**: 제안 | 수락 | 폐기  
**일자**: 2026-02-15

## 상황 (Context)

운영 OS 2.0으로 가기 위해 구조를 사람이 손으로 쓰지 않고, 명령어가 생성하도록 자동화가 필요했다. ADR, 도메인 모듈, API 라우트 생성 CLI가 있으면 일관된 패턴을 유지할 수 있다.

## 결정 (Decision)

우리는 다음 생성 CLI를 도입하기로 했다.

- **generate:adr** — ADR 번호 자동 부여, 템플릿 복사, 제목/일자 치환
- **generate:domain** — packages/lib/domain/<name> 골격 (index.ts, README.md)
- **generate:api-route** — app/api/<path>/route.ts, Handler Factory 패턴 (GET/POST 등)

## 대안 (Alternatives)

- 대안 A: 수동으로만 생성 — 일관성 유지 비용이 크고, 실수 가능성 높음
- 대안 B: 코드 생성기(복잡한 템플릿 엔진) — 과한 설계, 유지보수 부담

## 결과 (Consequences)

- 긍정: 새 도메인/API/ADR 추가 시 동일 패턴 유지, 온보딩 시간 단축
- 부정/비용: CLI 스크립트 유지보수, 프로젝트별 커스터마이즈 필요 시 확장
- 검증: check:layer-boundaries, check:all
