# Application Layer Boundary
# Application 계층 경계

> **API는 Application을 통해서만 Domain·Engine을 호출한다. Frontend는 Application을 직접 호출하지 않는다.**

**Tier**: 2 (권장 · 2.18.0)  
**연계**: [LAYER_BOUNDARIES.md](./LAYER_BOUNDARIES.md) · [FEATURE_PLACEMENT_GUIDE.md](../FEATURE_PLACEMENT_GUIDE.md)

**최종 업데이트**: 2026-06-23

---

## 1. 확장 계층 스택

[LAYER_BOUNDARIES.md](./LAYER_BOUNDARIES.md)의 Frontend → API → Domain → Engine 위에, 대형 모노레포에서는 **Application** 층을 명시한다.

```
Frontend (tenant/*, components)
    ↓ HTTP only
API (routes, middleware, handler factory)
    ↓
Application (use-cases, orchestration, DTO assembly)
    ↓
Domain (entities, domain services)
    ↓
Engine (reusable algorithms)
    ↓
Core (infra)
```

---

## 2. 금지 규칙

| # | 금지 | 이유 |
|---|------|------|
| AB-01 | `application/` → `api/` import | 역방향 — handler가 use-case를 끌어올 수 없음 |
| AB-02 | `domain/` · `models/` → `api/` import | 역방향 |
| AB-03 | `api/` → `engine/` **직접** import (adapter 없이) | API가 엔진 세부에 묶임 |
| AB-04 | `tenant/*/frontend` → `application/` **런타임** import | FE가 서버 orchestration에 직접 접근 |
| AB-05 | `engine/` → `api/` · `application/` import | 엔진이 전송 계층에 의존 |

`shared/`는 전 계층에서 import 가능하나, **런타임 서버 코드**를 FE 번들에 넣지 않는다.

---

## 3. 검증 (인스턴스 패턴)

| 스크립트 (Inflomatrix 예) | 목적 |
|---------------------------|------|
| `check:application-boundary` | AB-01, AB-04 |
| `check:reverse-boundary` | AB-02 |
| `check:api-engine-boundary` | AB-03 |
| `check:engine-backend-boundary` | engine ↔ backend glue |
| `check:boundaries-backend` | 위 backend 묶음 |

인스턴스는 `check:layer-boundaries`에 **Application 규칙을 추가**하거나 별도 스크립트로 분리한다.

---

## 4. PR 체크리스트

- [ ] 새 API handler가 Application service를 호출하는가? (Domain 직접 X)
- [ ] 새 FE 코드가 `@application/*`를 import하지 않는가?
- [ ] 공유 타입은 `shared/`에 있는가?

**실증 인스턴스**: Inflomatrix `check:application-boundary` + `check:layer-boundaries` (2026-06)
