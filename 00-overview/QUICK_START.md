# Quick Start Guide
# 빠른 시작 가이드

> **30분 만에 Constitution 핵심 이해하기**

---

## 🎯 목표

이 가이드를 읽으면:
- Constitution의 핵심 철학을 이해합니다
- 프로젝트에 바로 적용할 수 있는 원칙을 배웁니다
- 자동 검증 도구를 설정할 수 있습니다

---

## ⏱️ 30분 학습 플랜

### Step 1: 핵심 철학 (10분)

**읽기**: [PHILOSOPHY.md](./PHILOSOPHY.md)

**핵심 개념 3가지:**

1. **구조 우선 원칙**
   > "구조가 같으면 목적이 달라도 통합할 수 있다"

2. **엔진 기반 사고**
   > 도메인 독립적인 재사용 가능한 로직

3. **8단계 방법론**
   > 표준화 → 통합 → 추상화 → 모듈화 → 자동화 → 지능화 → 최적화 → 확장

---

### Step 2: 계층 구조 (10분)

**읽기**: [../01-foundations/LAYER_BOUNDARIES.md](../01-foundations/LAYER_BOUNDARIES.md)

**핵심 규칙:**

```
Frontend ↓ API ↓ Domain ↓ Engine ↓ Core
         (단방향 의존만 허용)
```

**금지 사항:**
- ❌ 역방향 의존 (Core → Domain)
- ❌ 도메인 간 의존 (Domain A → Domain B)
- ❌ 계층 우회 (API → Engine 직접)

---

### Step 3: 즉시 적용 가능한 원칙 (10분)

#### 원칙 1: API 표준화

**Level A (필수):**
```typescript
export const POST = (request: NextRequest) => {
  return withMetrics(request, async () => {
    const handler = withAuth(async (context, req) => {
      // ① Trigger
      // ② State Read
      // ③ Branching
      // ④ Action
      // ⑤ State Mutation
      // ⑥ Side Effect
      // ⑦ Output
    });
    return handler(request);
  });
};
```

#### 원칙 2: UX 안전 규칙

**필수 3가지:**
1. 네트워크 호출은 반드시 타임아웃 설정
2. Loading 상태는 반드시 `finally` 블록
3. 사용자 액션 실패는 반드시 피드백

```typescript
// ✅ 올바른 패턴
try {
  setLoading(true);
  await apiCall();
} finally {
  setLoading(false);
}
```

#### 원칙 3: 개념 부패 방지

**Gateway 함수 강제:**
```typescript
// ❌ 금지
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId);

// ✅ 필수
const user = await getUser(userId);
```

---

## 📋 체크리스트

프로젝트에 적용할 때 확인하세요:

### 즉시 적용 (오늘)
- [ ] API 응답 형식 통일
- [ ] 네트워크 호출에 타임아웃 추가
- [ ] Loading 상태에 `finally` 블록 추가

### 1주일 내 적용
- [ ] 계층 경계 확인 및 수정
- [ ] Gateway 함수 만들기
- [ ] ESLint 규칙 추가

### 1개월 내 적용
- [ ] 중복 코드 통합
- [ ] 엔진 기반 설계 시작
- [ ] 자동 검증 스크립트 구축

---

## 🚀 프로젝트 시작하기

### 새 프로젝트

```bash
# 1. Constitution 복사
cp -r docs/constitution /your-project/docs/

# 2. Itemwiki 특화 문서 제거
rm -rf /your-project/docs/constitution/itemwiki-specific/

# 3. 핵심 문서만 유지
# - 00-overview/
# - 01-foundations/
# - 02-development-framework/
# - 03-api-standards/
# - 04-safety-standards/
```

### 기존 프로젝트

**단계별 적용:**

1. **Phase 1 (1주)**: 문서 읽기 + 현재 상태 분석
2. **Phase 2 (2주)**: Tier 1 원칙 적용 (안전 규칙)
3. **Phase 3 (1개월)**: 계층 경계 정리
4. **Phase 4 (2개월)**: 엔진 기반 설계 시작

---

## 💡 핵심만 기억하기

### 3가지만 기억하세요

1. **구조가 같으면 통합**
   - 비슷한 코드를 발견하면 구조 기반으로 통합

2. **의존성은 단방향**
   - 역방향 의존은 절대 금지

3. **실패는 코드로 차단**
   - 운영 사고를 자동 검증으로 방지

---

## 📚 다음 단계

### 30분 이후

1. **[STRUCTURE_FIRST_PRINCIPLE.md](../01-foundations/STRUCTURE_FIRST_PRINCIPLE.md)** 상세 학습
2. **[8_STAGE_METHODOLOGY.md](../02-development-framework/8_STAGE_METHODOLOGY.md)** 실전 적용
3. **팀에 공유** 및 토론

### 1주일 이후

1. **자동 검증 도구** 설정
2. **ESLint 규칙** 추가
3. **CI/CD 통합**

### 1개월 이후

1. **Living Documents** 작성 시작
2. **팀 온보딩 프로세스** 구축
3. **Constitution 확장** (프로젝트 특화)

---

## 🎓 학습 리소스

### 필수 문서 (Tier 1)
- [PHILOSOPHY.md](./PHILOSOPHY.md) - 30분
- [STRUCTURE_FIRST_PRINCIPLE.md](../01-foundations/STRUCTURE_FIRST_PRINCIPLE.md) - 30분
- [LAYER_BOUNDARIES.md](../01-foundations/LAYER_BOUNDARIES.md) - 30분
- [8_STAGE_METHODOLOGY.md](../02-development-framework/8_STAGE_METHODOLOGY.md) - 1시간

### 심화 문서 (Tier 2)
- [INFLOMATRIX_DEVELOPMENT_PROTOCOL.md](../11-protocols/INFLOMATRIX_DEVELOPMENT_PROTOCOL.md)
- [KHS_DEVELOPMENT_TEXTBOOK.md](../11-protocols/KHS_DEVELOPMENT_TEXTBOOK.md)

---

## ✅ 성공 지표

Constitution 적용 후 1개월 뒤 측정:

| 지표 | 목표 |
|------|------|
| 코드 중복률 | -30% 이상 |
| 버그 발생률 | -50% 이상 |
| 리팩토링 시간 | -70% 이상 |
| 팀원 만족도 | +50% 이상 |

---

## 💬 도움이 필요하신가요?

### FAQ

**Q: 어디서부터 시작해야 하나요?**  
A: PHILOSOPHY.md를 읽고 → 계층 경계 확인 → UX 안전 규칙 적용

**Q: 팀원들에게 어떻게 설명하나요?**  
A: 이 Quick Start Guide를 공유하세요

**Q: 기존 코드를 모두 수정해야 하나요?**  
A: 아니요. 점진적으로 적용 가능합니다

---

## 🎉 축하합니다!

30분 만에 Constitution의 핵심을 이해했습니다!

**이제 당신의 프로젝트에 적용해보세요.**

---

**다음:** [../01-foundations/STRUCTURE_FIRST_PRINCIPLE.md](../01-foundations/STRUCTURE_FIRST_PRINCIPLE.md)

---

**최종 업데이트**: 2026-01-22  
**버전**: 1.0.0
