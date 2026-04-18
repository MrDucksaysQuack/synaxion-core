# 데이터 조회 시점 (Data Fetch Initiation)

**목적**: "언제 데이터를 조회할지"를 표준화하여, 의도가 명확하고 예측 가능한 로딩 동작을 유지합니다.  
**Tier**: 2 (권장. 프로젝트/팀 단위 적용)

---

## 1. 핵심 원칙

> **접근 행동이 있는 경우, 해당 화면/모달에 필요한 데이터는 "화면이 보일 때"가 아니라 "그 화면에 접근하기로 한 사용자 행동"에서 조회를 시작한다.**

- **접근 행동**: 버튼 클릭(모달 열기), 링크/탭 클릭(페이지·탭 이동), 드로어 열기 등.
- **시작 시점**: 해당 행동의 이벤트 핸들러에서 fetch/refetch 호출.
- **우선하지 말 것**: "해당 UI가 보일 때"(모달 `isOpen`, 라우트 마운트)에만 조회하는 방식은, **접근 행동이 있을 때는 그 행동을 우선**한다.

---

## 2. 규칙

### 2.1 접근 행동이 있는 경우

- **모달**: "모달을 여는 버튼"의 클릭에서 refetch(또는 fetch) 호출 후 모달 open.  
  → 조회는 "모달이 열릴 때"가 아니라 "열기 버튼 클릭"에서 시작.
- **탭**: "해당 탭으로 가는 클릭"에서 해당 탭 데이터 조회 시작.  
  → 탭 전환 시 "활성 탭 변경 useEffect"만이 아닌, **탭 클릭**을 트리거로 사용 권장.
- **드로어/패널**: 열기 버튼(또는 진입 액션)에서 필요한 데이터 조회 시작 후 open.

### 2.2 접근 행동이 없는 경우

- 직접 URL 입력, 새로고침, 딥링크로 해당 화면에 도달한 경우.  
- 이때는 **마운트 시점**(해당 페이지/레이아웃의 useEffect 또는 데이터 훅)에서 조회.  
  "접근 행동"이 없으므로 노출 기반이 유일한 트리거.

### 2.3 공통

- 필요한 최소 데이터만 해당 시점에 조회.
- 이미 캐시/전역 상태로 충분하면 refetch 생략 가능(프로젝트 정책에 따라).

---

## 3. 예시 (모달)

**권장**: 버튼 클릭에서 조회 시작 후 open.

```tsx
const handleOpen = useCallback(() => {
  refetchData();  // 접근 행동(클릭) 시점에 조회
  modal.open();
}, [modal, refetchData]);

<Button onClick={handleOpen}>상세 보기</Button>
```

**비권장**: 모달이 열릴 때만 조회 (접근 행동과 인과가 코드만으로는 덜 분명함).

```tsx
useEffect(() => {
  if (modal.isOpen && id) fetchDetail();
}, [modal.isOpen, id, fetchDetail]);
```

---

## 4. 관련 문서

- [FRONTEND_LAYER_PRINCIPLES.md](./FRONTEND_LAYER_PRINCIPLES.md) — 페이지 설계·데이터 흐름·상태 관리
- [STATE_MANAGEMENT_PRINCIPLES.md](./STATE_MANAGEMENT_PRINCIPLES.md) §2 — `useAsyncState` 등과 `useCallback`/`useEffect` **의존성 배열**(반복 fetch 방지)
- [UX_SAFETY_RULES.md](../04-safety-standards/UX_SAFETY_RULES.md) — 로딩 상태·타임아웃
- [STALE_UI_PREVENTION.md](../04-safety-standards/STALE_UI_PREVENTION.md) — Mutation 후 갱신 의무

---

**최종 업데이트**: 2026-03-22 — §4 관련 문서에 STATE_MANAGEMENT §2 링크
