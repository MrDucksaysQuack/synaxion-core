# ADR-0004: E2E Authority 및 그룹 구조 도입

**상태**: 수락  
**일자**: 2026-02-15

## 상황 (Context)

E2E 테스트가 많아지면 전부 돌리면 시간이 오래 걸리고, 실패 시 "머지 막을지/경고만 할지" 기준이 없었다. 어떤 테스트가 핵심인지, 어떤 순서로 돌릴지가 코드·스크립트에만 있어 전달이 어려웠다.

## 결정 (Decision)

우리는 **E2E Authority**와 **그룹** 구조를 도입하기로 했다.

- **Authority**: critical(반드시 통과, 실패 시 머지 불가) / flow(중요, 실패 시 요약) / integration / legacy(단계적 제거).
- **Spec 목록**: `tests/e2e/authority-specs.json` 에서 authority별 스펙 파일 목록 관리.
- **그룹**: group1(인증·가입) ~ group5(에러·엣지). L1~L6 등 단계별 실행으로 영향 범위에 맞는 subset만 실행 가능.
- 실행: `run-e2e-by-authority.js`로 authority별 실행. CI에서는 critical 먼저, 실패 시 exit 1.

## 대안 (Alternatives)

- **전부 동등 취급**: critical이 없으면 회귀 시 머지 차단 기준이 모호함. 거절.
- **태그만 사용**: Playwright 태그만 쓰면 "어떤 것이 critical인지" 매니페스트가 없어 운영 정책과 불일치 가능. JSON 매니페스트로 명시적 유지.

## 결과 (Consequences)

- **긍정**: CI에서 critical만 먼저 돌려 빠른 피드백. 그룹으로 부분 실행해 개발 속도 확보. authority-specs.json으로 "무엇이 핵심인지" 전달 가능.
- **비용**: 새 E2E 추가 시 authority·그룹 지정 의무.
- **검증**: test:trust:validate, authority-specs.json 일치 여부

**참조**: [E2E_TEST_AUTHORITY.md](../05-testing-principles/E2E_TEST_AUTHORITY.md), [VERIFICATION_SCRIPTS.md](../06-automation/VERIFICATION_SCRIPTS.md)
