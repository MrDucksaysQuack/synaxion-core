# Emotional State Patterns

> **Synaxion 18장** — 비즈니스 도구 맥락의 5가지 대표 감정 상태와 UI 대응. Ch.14 브랜드 축과 정합되어야 한다.

---

## §1 5감정 상태 (enum)

| ID | 한글 | 사용자 맥락 |
|----|------|-------------|
| `anxiety` | 불안 | 첫 진입·대량 입력·복잡 매트릭스 |
| `exploration` | 탐색 | 새 도메인·관계 탐색·온보딩 |
| `confidence` | 확신 | 일상 CRUD·익숙한 목록 |
| `trust` | 신뢰 | 자동 결정·Conscious·배치 실행 수용 |
| `pressure` | 압박 | 마감·드릴·장애 복구 |

```typescript
export type EmotionalState =
  | 'anxiety'
  | 'exploration'
  | 'confidence'
  | 'trust'
  | 'pressure';
```

---

## §2 상태별 UI 패턴

### anxiety (불안)

- **목표**: "지금 어디에 있고, 다음에 무엇이 안전한가"를 즉시 전달
- **패턴**: Progress clarity, 단계 헤더, 저장·취소 대칭, 되돌리기 가능 강조
- **금지**: 빈 화면, 로딩 무한, 에러 침묵

### exploration (탐색)

- **목표**: 부담 없이 둘러보기
- **패턴**: DomainGuideCard, OnboardingTour(옵트인), 미리보기·샘플 행
- **금지**: 강제 모달 연쇄, CTA만 3개 이상

### confidence (확신)

- **목표**: 마찰 최소화
- **패턴**: DynamicTable + RowAction, 키보드 단축, 최근 항목
- **금지**: 확인 다이얼로그 남용

### trust (신뢰)

- **목표**: "왜 이렇게 됐는지" 설명
- **패턴**: Conscious 근거 패널, 변경 diff, audit 링크
- **금지**: 블랙박스 자동화

### pressure (압박)

- **목표**: 인지 부하 축소
- **패턴**: Single Primary CTA(UX-04), 단계 축소, 핵심 필드만
- **금지**: 부가 정보·장식 우선

---

## §3 도메인 가이드 연계

`docs/data/domain-guides.json`의 `emotionalState` 필드는 위 5값 중 하나.  
인스턴스 Experience Direction([Ch.14](../14-experience-direction/))의 톤·밀도와 충돌 시 **Ch.14 우선**, 18장은 **구조·가이드 배치**만 담당.

---

## §4 Ch.14 연계

Inflomatrix 인스턴스: `docs/inflomatrix-constitution/EXPERIENCE_DIRECTION.md` (Stream B)  
§A에서 5상태별 UI를 프로젝트 톤에 맞게 구체화한다.

---

**최종 업데이트**: 2026-05-28
