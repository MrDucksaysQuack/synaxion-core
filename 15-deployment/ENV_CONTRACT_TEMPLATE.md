# Environment Contract Template

**목적**: 프로젝트가 자신의 env contract를 작성할 때 사용하는 템플릿.
         이 파일을 복사하여 `docs/<project>-constitution/ENV_CONTRACT.md`로 작성한다.

---

## 환경 목록

| 환경 | 목적 | URL |
|------|------|-----|
| development | 로컬 개발 | localhost |
| preview | PR별 preview deploy | Vercel Preview URL |
| production | 실제 서비스 | https://yourdomain.com |

---

## 필수 환경 변수 목록

| 변수 이름 | 환경 | 목적 | 누락 시 동작 |
|-----------|------|------|-------------|
| DATABASE_URL | 전체 | DB 연결 | 앱 기동 실패 |
| NEXTAUTH_SECRET | 전체 | 세션 암호화 | 인증 불가 |
| ... | | | |

---

## Startup Validation 위치

앱 기동 시 필수 env를 검증하는 코드의 위치:
- `src/lib/env.ts` 또는 `packages/lib/core/config/env/`

누락 env 감지 시 동작:
- 개발 환경: 경고 출력
- 프로덕션: 즉시 throw (기동 실패)

**최종 업데이트**: 2026-05-24
