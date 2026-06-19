# 페이지 레이아웃·플로우 짧은 체크리스트 (Page layout & flow checklist)

**목적**: 신규·개편 화면에서 **입구/출구**, **주요 행동**, **한 화면 한 목적**을 빠르게 점검한다.  
**다역할·업무 흐름 제품**은 [Ch.19 PAGE_DERIVATION_AND_AUDIT.md](../19-product-ui-architecture/PAGE_DERIVATION_AND_AUDIT.md) 6차원 감사를 먼저 수행한다.

**Tier**: **권장** — 심화는 [DESIGN_FLOW_PRINCIPLES.md](./DESIGN_FLOW_PRINCIPLES.md), [EXPECTATION_MODEL_RULES.md](./EXPECTATION_MODEL_RULES.md), [IA_NAVIGATION_PRINCIPLES.md](../07-frontend-ui/IA_NAVIGATION_PRINCIPLES.md).

---

## 6차원 빠른 점검 (Ch.19 연동)

신규 URL·대규모 개편 시 아래 6문항에 **각각 한 문장**으로 답할 수 있는지 확인한다.

1. **Role** — 누가 쓰는가?
2. **Goal** — 무엇을 끝내려 하는가?
3. **Data** — 중심 객체는 무엇인가?
4. **Action** — 주 행동(Primary)은 무엇인가?
5. **Permission** — 허용된 범위인가?
6. **Workflow Stage** — 업무 흐름상 어느 단계인가?

2~3개가 흐리거나 한 답에 "그리고/또한"이 반복되면 [Ch.19 감사 판정](../19-product-ui-architecture/PAGE_DERIVATION_AND_AUDIT.md#6-페이지-문제-유형-감사-판정)을 참고한다.

---

## 체크리스트 (예 / 아니오)

1. **한 화면 한 목적**: 이 URL에서 사용자가 끝내야 할 **한 가지 주 목적**을 한 문장으로 말할 수 있는가?
2. **입구(Entry)**: 검색·딥링크·알림 등 **어디서 들어와도** 목적이 흐트러지지 않는가? 필요한 맥락(로그인·선행 데이터)이 명시되는가?
3. **출구(Exit)**: 완료·취소·뒤로가기 후 **다음 합리적 화면**이 정의돼 있는가(데드 엔드·막다른 팝업 없음)?
4. **주 행동(Primary action)**: 화면당 **하나의 주 버튼/주 경로**가 시각적으로 구별되는가? 파괴적 행동은 **둔하게·확인**이 있는가?
5. **보조 행동**: 두 번째 이후 행동이 **주 행동을 가리지 않는가**?
6. **기대 모델**: 로딩·성공·실패·빈 상태가 [EXPECTATION_MODEL_RULES.md](./EXPECTATION_MODEL_RULES.md)와 맞는가?
7. **IA 깊이**: 내비게이션 깊이·카테고리 수가 [IA_NAVIGATION_PRINCIPLES.md](../07-frontend-ui/IA_NAVIGATION_PRINCIPLES.md) 범위를 벗어나지 않는가?

---

## 🔗 인스턴스 (Itemwiki 예)

- [NEW_PAGE_DESIGN_CHECKLIST.md](../../itemwiki-constitution/itemwiki-specific/design-flow/NEW_PAGE_DESIGN_CHECKLIST.md)  
- [FLOW_ENTRY_EXIT_MATRIX.md](../../itemwiki-constitution/itemwiki-specific/design-flow/FLOW_ENTRY_EXIT_MATRIX.md)  
- [BUTTON_PLACEMENT_AUDIT.md](../../itemwiki-constitution/itemwiki-specific/design-flow/BUTTON_PLACEMENT_AUDIT.md)  
- Ch.19 [PAGE_AUDIT_MATRIX.template.md](../19-product-ui-architecture/PAGE_AUDIT_MATRIX.template.md) — 다역할 제품 평가 매트릭스

---

**최종 업데이트**: 2026-06-16 — 6차원 빠른 점검·Ch.19 연동
