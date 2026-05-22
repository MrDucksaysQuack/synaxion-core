# 입력–저장 보증 (Input → Persistence Guarantee)

**목적**: “사용자가 입력한 것이 저장되었는지, 화면이 그 사실을 말해 주는지”를 **제품 중립**한 문장으로 고정한다. 구현 이름·레지스트리·CI 스크립트는 프로젝트 인스턴스에 둔다.

**Tier**: **필수(원칙)** — 세부 체크리스트·IP 번호·PR 표는 [INPUT_PERSISTENCE_SCHEMA_ALIGNMENT.md](../07-frontend-ui/INPUT_PERSISTENCE_SCHEMA_ALIGNMENT.md)와 인스턴스 매핑 문서를 본다.

---

## 1. 단일 Save 권위 (Single mutation authority)

- **사용자 입력이 서버(또는 권위 저장소)에 반영되는 경로**는 화면·도메인마다 **하나의 명시된 mutation 경로**로 수렴해야 한다. 동일 필드에 대해 **서로 다른 저장 API·서로 다른 “저장” 버튼이 조용히 공존**하면 드리프트·부분 저장·감사 불가가 된다.
- **권장**: “폼 → 단일 `mapUIToPersistence` / 단일 PATCH·POST 클라이언트 → 단일 라우트 핸들러”처럼, **입력에서 영속까지의 엣지**를 문서·코드에서 한 줄로 추적 가능하게 유지한다.

---

## 2. 렌더 모델 (Render trusts persisted truth)

- **사용자에게 보이는 값(렌더)**의 최종 권위는 **저장이 반영된 뒤의 서버(또는 API) 스냅샷**이어야 한다. 로컬 드래프트·낙관적 UI는 **임시**이며, “언제 서버가 이김인지”를 팀이 합의해 둔다.
- 저장 성공·부분 성공·실패 각각에 대해 **refetch·무효화·롤백** 중 무엇을 쓸지 정하지 않으면 Stale UI·거짓 성공이 반복된다 — [STALE_UI_PREVENTION.md](./STALE_UI_PREVENTION.md), [UI_INPUT_RENDER_AUTHORITY.md](../07-frontend-ui/UI_INPUT_RENDER_AUTHORITY.md)와 함께 본다.

---

## 3. 스키마 정렬 (Input vs persistence alignment)

- UI 필드 의미·와이어 키·enum이 바뀔 때 **한쪽만** 고치지 않는다. 계약(타입·Zod·allowlist·DB 제약)과 매퍼를 **같은 변경 단위**로 움직인다 — [INPUT_PERSISTENCE_SCHEMA_ALIGNMENT.md](../07-frontend-ui/INPUT_PERSISTENCE_SCHEMA_ALIGNMENT.md) §1~3.

---

## 4. 다중 단계 저장 (한 사용자 액션 → 여러 요청)

- 한 번의 사용자 의도가 **여러 네트워크 단계**로 쪼개지면, **부분 성공·재시도·토스트**를 사용자에게 일관되게 설명할 수 있어야 한다. “절반만 됐다”를 숨기지 않는다(인스턴스의 MULTI·필드 필터 계약과 정렬).
- 서버 측 primary/secondary 조합 응답은 [SILENT_FAILURE_PREVENTION.md](./SILENT_FAILURE_PREVENTION.md) **Fail-Soft Multi-Target**과 정렬한다.

---

## 5. 클라이언트 영속 데이터 버저닝 (localStorage / sessionStorage)

**Tier**: **Tier 1** (드래프트·위저드·오프라인 큐 등 사용자 입력이 브라우저에 남는 경우)

서버 저장 흐름(§1~4)과 별도로, **브라우저 영속 저장소**에도 스키마 드리프트·구버전 키 잔존 리스크가 있다.

### 원칙

1. **키에 major 버전 포함**: `app_feature_draft_v1`처럼 저장소 키 자체에 **breaking 변경 시 바꿀 수 있는 major**를 둔다. 필드만 바꿀 때와 키를 바꿀 때의 기준을 팀이 정한다.
2. **페이로드에 `schema_version`**: JSON(또는 직렬화 객체) 안에 **정수 `schema_version`**(또는 동등한 필드)을 넣어, 로드 시 현재 코드가 기대하는 버전과 대조한다.
3. **read 시점 forward migration**: `load`·hydrate 경로에서 **마이그레이션 함수**(`migrateX(fromVersion)`)를 호출해 구버전 → 현재 버전으로 변환한다. 쓰기 전에 한 번만 적용해도 된다.
4. **파싱 실패 = null + clear 선택**: 손상·알 수 없는 버전은 사용자 데이터 손실을 최소화하며 **조용히 오염된 상태를 재사용하지 않는다**(필요 시 키 삭제·빈 드래프트).
5. **서버 메타와 정렬**: 제출 본문에도 동일 `schema_version`을 실어 서버·시트·감사 로그가 클라이언트 드래프트와 추적 가능하게 한다 — [INPUT_PERSISTENCE_SCHEMA_ALIGNMENT.md](../07-frontend-ui/INPUT_PERSISTENCE_SCHEMA_ALIGNMENT.md).

### 금지

- 버전 없는 `localStorage.setItem(key, JSON.stringify(form))`만으로 장기 운영.
- 마이그레이션 없이 필드 rename/remove 후 구 데이터를 그대로 렌더.

### 인스턴스 참고

- truefarm: `draft-storage` 키 `_v1`, `migrateJoinSubmissionMeta` / `migrateDraftAnswers`, `SCHEMA_VERSION` 상수.

---

## 🔗 관련 문서

| 문서 | 역할 |
|------|------|
| [INPUT_PERSISTENCE_SCHEMA_ALIGNMENT.md](../07-frontend-ui/INPUT_PERSISTENCE_SCHEMA_ALIGNMENT.md) | IP 체크리스트·mapper·allowlist·PR 절차 |
| [UI_INPUT_RENDER_AUTHORITY.md](../07-frontend-ui/UI_INPUT_RENDER_AUTHORITY.md) | 입력 vs 표시 권위·낙관·실패 시 |
| [STALE_UI_PREVENTION.md](./STALE_UI_PREVENTION.md) | Mutation 후 refetch / invalidate |
| [PAGE_FORM_UX_HEURISTICS.md](../07-frontend-ui/PAGE_FORM_UX_HEURISTICS.md) | 긴 폼·설정 화면 UX 휴리스틱 |
| **Itemwiki 인스턴스** | [input-persistence/README.md](../../itemwiki-constitution/itemwiki-specific/input-persistence/README.md) — 매핑 인덱스·화면별 표·실행 백로그 |

---

**최종 업데이트**: 2026-05-23 — §5 클라이언트 영속 데이터 버저닝
