# Feature Spec Template

> **저장 위치**: `docs/specs/<FEATURE_NAME>_SPEC.md`  
> **작성 시점**: 구현 전 ([FORWARD_PLANNING_PROTOCOL](./FORWARD_PLANNING_PROTOCOL.md) Step 7 또는 §3 Step 3)  
> **관련**: [FEATURE_CONTRACT_TEMPLATE.md](../FEATURE_CONTRACT_TEMPLATE.md) (PR·계약), [FEATURE_PLACEMENT_GUIDE.md](../01-foundations/FEATURE_PLACEMENT_GUIDE.md)

---

## 메타

```
기능 ID:
상태: draft | review | approved | implemented
작성일:
담당:
관련 ADR: (없으면 "없음")
```

---

## 1. 의도

### 한 줄 요약

```
[기능 이름]: [한 문장]
```

### 문제·가치

```
해결하는 문제:
Primary 사용자:
왜 지금 (이번 릴리스):
```

### 비목표

```
- 이번 스펙에서 하지 않음:
- 후속 스펙으로 미룸:
```

---

## 2. 사용자 흐름

```
1. 사용자가 …
2. 시스템이 …
3. 완료 조건: …
```

### 엣지·오류

| 상황 | 기대 UX | 계약 참조 |
|------|---------|----------|
| loading | | |
| empty | | |
| error | | |
| 권한 없음 | | |

---

## 3. 시스템 경계

### API / Server (해당 시)

```
엔드포인트·Action:
입력:
성공:
에러 코드:
타임아웃:
```

### 데이터 (해당 시)

```
엔티티·테이블:
마이그레이션 필요: yes / no
RLS·권한:
```

### UI 배치

[FEATURE_PLACEMENT_GUIDE](../01-foundations/FEATURE_PLACEMENT_GUIDE.md) Q1~Q4 결과:

```
lib:
components:
app routes:
```

---

## 4. Synaxion 준수

| 축 | 적용 규칙 | 확인 |
|----|----------|------|
| Layer | LAYER_BOUNDARIES | [ ] |
| API | 7-stage (해당 시) | [ ] |
| Safety | SILENT_FAILURE, UX timeout | [ ] |
| UI/UX | 상태 4종, a11y | [ ] |

---

## 5. 테스트·검증

```
단위:
통합:
E2E (critical flow):
완료 시 통과 check:*:
  - check:layer-boundaries
  - (기능별 추가)
```

---

## 6. Definition of Done

- [ ] spec approved
- [ ] FEATURE_CONTRACT (또는 본 spec §3) 리뷰 완료
- [ ] ADR (필요 시) merged
- [ ] 구현 + 명시된 check:* 통과
- [ ] `<project>-constitution` 계약 갱신 (ENV/DB 변경 시)

---

**최종 업데이트**: 2026-05-24
