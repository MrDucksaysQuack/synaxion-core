# 상태 관리 원칙 (State Management Principles)

**목적**: 프론트엔드에서 **언제 useState를 직접 쓰고, 언제 커스텀 훅·전역 공유를 쓸지** 기준을 두어 일관성과 유지보수성을 높입니다.

**참고**: 구체적 훅 이름(예: useAsyncState, useForm)과 적용 리소스 목록은 프로젝트 인스턴스(예: itemwiki-constitution 내 state-management)에서 정의합니다.

---

## 1. useState 직접 사용 vs 커스텀 훅

| 허용: useState 직접 | 필수: 커스텀 훅(또는 표준 훅) |
|---------------------|-------------------------------|
| 단순 UI 상태(모달 열림/닫힘, 탭 선택) | 비동기 작업 상태(로딩, 에러, 데이터) |
| 컴포넌트 내부에서만 쓰는 일시적 상태 | 폼 상태 및 검증 |
| 다른 컴포넌트와 공유되지 않는 상태 | 복잡한 상태 로직(여러 상태 연관) |
| | 재사용 가능한 상태 로직 |

- **비동기 상태**: 로딩/에러/데이터를 한 덩어리로 다루는 **비동기 전용 훅** 사용을 권장. `useState` 여러 개로 흩어두지 않는다.
- **폼 상태**: 스키마 기반 검증·제출 로직이 있으면 **폼 전용 훅** 사용을 권장.
- **모달·위저드**: 열림/닫힘·단계 전환 등 반복 패턴은 **공통 훅**으로 추출 권장.

---

## 2. 비동기 상태 훅(`useAsyncState` 등)과 의존성 배열 (필수)

**문제**: `useAsyncState`가 돌려주는 **결과 객체 전체**(`state`, `loadingState`, `draftsState` 등 변수명 불문)는 내부에서 `useMemo`로 묶이며, **`data` / `loading` / `error`가 바뀔 때마다 참조가 달라진다.** 이 객체를 `useCallback`·`useMemo`·`useEffect`의 의존성 배열에 넣으면, 한 번의 fetch로 상태가 갱신될 때마다 콜백 식별자가 바뀌고, 그 콜백을 의존하는 effect가 **다시 실행**되어 **같은 API가 짧은 시간에 반복 호출**될 수 있다(서킷 브레이커·레이트 리밋·토스트 폭주로 이어질 수 있음).

**규칙 (Level A)**:

1. **금지**: `useAsyncState()`의 **반환 객체 전체**를 `useCallback` / `useEffect` / `useMemo`의 의존성에 넣지 않는다.
2. **허용**: 같은 훅에서 구조 분해한 **`setData`**, **`setLoading`**, **`setError`**, **`reset`** — `useState`에서 오는 setter와 동일하게 **참조가 안정적**이므로 의존성에 포함해도 된다.
3. **의도적 재실행이 필요할 때만**: `data`, `loading`, `error` 같은 **원시값**(또는 안정적으로 비교 가능한 값)을 의존성에 넣어 “이 값이 바뀔 때만” effect를 다시 돌리는 것은 허용된다. (다만 “fetch 함수” 자체의 의존성에는 보통 setter만 넣는다.)

**권장 패턴**:

```tsx
const { setData, setLoading, setError, data, loading, error } = useAsyncState<T>(null, false);

const fetchItem = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    const res = await getItem(id);
    setData(res);
  } catch (e) {
    setError(/* … */);
  } finally {
    setLoading(false);
  }
}, [id, setData, setLoading, setError]); // ✅ 객체 전체(state) 금지

useEffect(() => {
  fetchItem();
}, [fetchItem]);
```

**비권장 패턴**:

```tsx
const state = useAsyncState<T>(null, false);
const fetchItem = useCallback(async () => {
  state.setLoading(true);
  // …
}, [id, state]); // ❌ state 참조가 loading/data 변경마다 바뀜
```

**참고**: `react-hooks/exhaustive-deps`는 종종 “객체에 속한 메서드만 쓰면 객체를 deps에 넣으라”고 오해하기 쉬우나, 위와 같이 **의도적으로 불안정한 객체**는 예외이며, **구조 분해한 setter**로 맞춘다.

### 2.1 후속 시스템 개선 과제 (권장·메타)

헌법만으로는 재발을 완전히 막기 어려우므로, 아래를 **시스템**에 붙이는 것을 권장한다.

| 영역 | 개선 |
|------|------|
| **정적 분석** | `useAsyncState` 반환값이 `useCallback`/`useEffect` deps에 들어가는 패턴을 ESLint 커스텀 규칙 또는 ast-grep/CI 스크립트로 탐지·경고 |
| **구현** | `useAsyncState` JSDoc·주석에 본 절 링크 유지; (선택) `useAsyncActions()`처럼 **setter만** 담은 안정 객체를 별도 반환하는 API 검토 |
| **코드베이스** | 동일 패턴 잔여 호출부 정리(예: `*State` 통째로 deps에 둔 컴포넌트·훅) |
| **리뷰** | PR 체크리스트 한 줄: “비동기 상태 훅 반환 **전체 객체**를 deps에 넣지 않았는가?” |

---

## 3. 전역 상태 공유 (중복 조회 방지)

- **여러 컴포넌트가 동일한 리소스를 조회**할 때, 각자 독립적으로 fetch하면 중복 요청·406/429·일관성 깨짐이 생길 수 있다.
- 이럴 때는 **전역 상태 공유 패턴**(동일 리소스에 대한 단일 소스·캐시·invalidate 규칙)을 사용한다. 프로젝트별로 "어떤 리소스를 공유할지"와 "어디서 invalidate할지"를 정의한다.
- 금지: 공유가 필요한 데이터를 컴포넌트마다 `useState` + `useEffect` fetch로만 관리.

### 3.1 인증 세션 (React Context 단일 인스턴스)

- **브라우저 인증 세션**(Supabase 클라이언트·세션 갱신·스토리지 동기화)은 **루트 Provider 한 인스턴스**에서만 구독·갱신하고, 하위는 Context(`useAuth` / 이를 포함하는 `useAuthState`)로만 읽는다.
- **장점**: 깊은 트리에서도 동일 스냅샷, 중복 `getSession`·구독 누락 방지, 테스트 시 `AuthSessionTestProvider` 등으로 주입 가능.
- **헌법 정렬**: 판단은 `useAuthState` 단일 계층([CONCEPTUAL_ROT_PREVENTION](../04-safety-standards/CONCEPTUAL_ROT_PREVENTION.md) §2.1), 플로우·리다이렉트는 [AUTH_FLOW_PRINCIPLES](../04-safety-standards/AUTH_FLOW_PRINCIPLES.md).

---

## 4. Stale UI 방지

- **Mutation(생성·수정·삭제) 후** 해당 데이터를 보여주는 화면은 **반드시 갱신**한다. refetch·invalidate·캐시 무효화 중 프로젝트가 정한 한 가지 방식을 일관되게 사용한다.
- 상세: [STALE_UI_PREVENTION.md](../04-safety-standards/STALE_UI_PREVENTION.md).

---

## 5. 계층 정리

- **Level A (필수)**: 비동기 상태·폼·인증·모달 등 **표준 패턴이 있으면 해당 훅/패턴 사용**. 프로젝트가 정한 "필수 표준 훅"을 따른다. **§2(의존성 배열)** 포함.
- **Level B (권장)**: 위저드·도메인별 폼 등 **재사용 가능한 로직은 훅으로 추출**.
- **Level C**: **전역 공유**가 필요한 리소스는 공유 패턴 사용.

---

## 🔗 관련 문서

- [FRONTEND_LAYER_PRINCIPLES.md](./FRONTEND_LAYER_PRINCIPLES.md) — 계층·데이터 흐름
- [STATE_TRANSITION_CONTRACT.md](../01-foundations/STATE_TRANSITION_CONTRACT.md) — 로딩 수렴·전이 가시성(훅 이름 없이 불변식만)
- [04-safety-standards/STALE_UI_PREVENTION.md](../04-safety-standards/STALE_UI_PREVENTION.md) — Mutation 후 refetch/invalidate
- [DATA_FETCH_INITIATION.md](./DATA_FETCH_INITIATION.md) — 접근 행동에서 fetch

---

**최종 업데이트**: 2026-04-14 — 관련 문서에 상태 전이 계약 링크
