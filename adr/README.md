# Architecture Decision Records (ADR)

> **왜 이 구조인가?** 결정 배경을 남겨 전달 가능한 구조로 만든다. ADR이 없는 헌법은 기억 의존, ADR이 있으면 전달 가능.

**위치**: `docs/constitution/adr/`  
**번호**: `ADR-0001` 형식. 시간순 유지.

---

## 목록

| 번호 | 제목 | 일자 |
|------|------|------|
| [ADR-0001](./0001-three-layer-architecture.md) | 3계층 아키텍처 채택 (API → Domain → Core) | 2026-02-15 |
| [ADR-0002](./0002-handler-factory-single-pattern.md) | API Handler Factory 단일 패턴 채택 | 2026-02-15 |
| [ADR-0003](./0003-single-source-conventions.md) | 단일 소스 규칙 도입 | 2026-02-15 |
| [ADR-0004](./0004-e2e-authority-and-groups.md) | E2E Authority 및 그룹 구조 도입 | 2026-02-15 |
| [ADR-0005](./0005-structure-cli-introduction.md) | 구조 생성 CLI 도입 | 2026-02-15 |

---

## 템플릿 (새 ADR 작성 시)

`template.md`를 복사한 뒤 `NNNN-short-title.md`로 저장하고 아래를 채운다.

```markdown
# ADR-NNNN: 제목

**상태**: 제안 | 수락 | 폐기  
**일자**: YYYY-MM-DD

## 상황 (Context)

무엇이 문제였고, 어떤 결정이 필요했는가?

## 결정 (Decision)

우리는 ~하기로 했다.

## 대안 (Alternatives)

- 대안 A: … (거절 이유)
- 대안 B: … (거절 이유)

## 결과 (Consequences)

- 긍정: …
- 부정/비용: …
- 검증: check:*, 테스트 등
```

---

## 규칙

- **구조적 결정**이 있을 때마다 ADR을 추가한다.
- 삭제하지 않고 **상태: 폐기**로 두고, 새 ADR에서 대체 결정을 참조한다.
- META_CONSTITUTION에서 요구하는 경우(삭제·폐기·충돌 해결) ADR을 기록한다.

**최종 업데이트**: 2026-02-15
