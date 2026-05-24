# Task Spec Template

> **저장 위치**: `docs/tasks/<task-slug>.md`  
> **용도**: Cursor·Agent·개발자에게 **한 실행 단위**를 넘길 때 사용  
> **완료**: 아래 `check:*` 게이트 전부 exit 0

---

## 메타

```
태스크 ID:
제목:
상태: todo | in_progress | done | blocked
우선순위: P0 | P1 | P2
관련 spec: docs/specs/…
예상 범위: (파일·디렉터리 추정)
```

---

## 목적

```
한 문장:
이 태스크가 끝나면 사용자/시스템에 무엇이 달라지는가:
```

---

## 사전 확인 (읽기 순서)

작업 전 아래를 읽는다.

- [ ] `docs/planning/00-product-intent.md` (범위 이탈 방지)
- [ ] `docs/specs/<관련>_SPEC.md`
- [ ] `docs/<project>-constitution/` 해당 계약
- [ ] (해당 시) `synaxion-core/…` 헌법 절

---

## 작업 범위

### 수정·생성 허용

```
- path/to/…
```

### 수정 금지

```
- 범위 밖 파일 수정 금지
- .env.local, 시크릿 커밋 금지
```

---

## 단계 (선택)

### Step A — …

```
목표:
산출물:
```

### Step B — …

```
목표:
산출물:
```

---

## 완료 기준 (check:* 게이트)

**필수** (이 태스크에서 반드시 통과):

```bash
pnpm run check:layer-boundaries
pnpm run check:…   # 태스크별 추가
```

**PR 직전** (팀 정책):

```bash
pnpm run check:all   # 또는 constitution:check
```

- [ ] 위 필수 check:* exit 0
- [ ] TypeScript / lint 통과
- [ ] (해당 시) E2E 스펙 통과

---

## 인수 조건 (Acceptance)

```
1.
2.
3.
```

---

## 롤백·위험

```
위험:
롤백:
관측 (Sentry·로그):
```

---

## Agent 지시 (복사용)

```
Execute docs/tasks/<this-file>.md only.
Do not expand scope. On ambiguity, stop and ask.
Report which check:* commands were run and their exit codes.
```

---

**최종 업데이트**: 2026-05-24
