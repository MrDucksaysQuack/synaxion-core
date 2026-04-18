# Inflomatrix 로직 구성 7단계 절대 원칙

> **Constitution 문서**  
> 모든 Flow / Function / API / Event는 반드시 이 7단계를 따라야 한다.  
> 이 순서만 지키면 실수 확률은 0에 가까워진다.

---

## 📋 원칙 개요

| 단계 | 이름 | 목적 | 필수 여부 |
|------|------|------|----------|
| ① | **Trigger** | 행동의 시작점 | ✅ 필수 |
| ② | **State Read** | 현재 상황 정확히 파악 | ✅ 필수 |
| ③ | **Branching** | 상황별 분기 | ✅ 필수 |
| ④ | **Action** | 실제 행동 실행 | ✅ 필수 |
| ⑤ | **State Mutation** | 상태 변화 기록 | ✅ 필수 |
| ⑥ | **Side Effect** | 후속 비동기 작업 | ⚠️ 선택적 |
| ⑦ | **Output** | 사용자에게 반환 | ✅ 필수 |

**⚠️ 경고**: 이 순서가 무너지면 시스템은 불안정해진다.  
**✅ 약속**: 이 순서가 완벽하면 어떤 시스템도 절대 무너지지 않는다.

### ItemWiki HTTP API 라우트와의 관계

이 표는 **모든 Flow·도메인 로직**의 사고 모델이다. **Next.js `app/api` 라우트**에 대해서는 [API_STANDARDIZATION_LEVELS.md](./API_STANDARDIZATION_LEVELS.md)가 **단계 깊이**를 완화한다. 예: 단순 조회 GET은 논리적으로 ① Trigger → ② State Read → ⑦ Output까지만 있으면 되고, ③④⑤는 “해당 없음”이 될 수 있다. 복잡한 POST/PATCH는 동일 문서의 생성·수정 API 절을 따른다. 두 문서가 충돌해 보이면 **API 표준 문서가 HTTP 핸들러 해석에 우선**한다.

---

## ① Trigger 판단 (행동 감지)

### 정의
모든 로직은 하나의 Trigger로 시작한다.

### 예시
- 스캔
- 버튼 클릭
- 파일 업로드
- Webhook 수신
- API 요청
- 타이머 만료
- 사용자 입력

### 규칙

#### 규칙 1.1: 단일 Trigger 원칙
- **Trigger는 반드시 단 하나여야 한다.**
- 여러 Trigger가 동시에 발생하면 안 된다.
- 하나의 함수/API는 하나의 Trigger만 처리해야 한다.

```typescript
// ✅ 올바른 예시
async function handleScan(identifier: string) {
  // 단일 Trigger: 스캔
}

// ❌ 잘못된 예시
async function handleBarcodeScanAndImageUpload(barcode: string, image: File) {
  // 두 개의 Trigger가 섞여 있음 - 분리해야 함
}
```

#### 규칙 1.2: 즉시 상태 조회
- **Trigger를 감지하면 즉시 현재 상태를 조회해야 한다.**
- Trigger 후 바로 State Read로 이어져야 한다.
- Trigger와 State Read 사이에 다른 로직이 들어가면 안 된다.

```typescript
// ✅ 올바른 예시
async function handleBarcodeScan(barcode: string) {
  // ① Trigger: 스캔
  // ② State Read: 즉시 리소스 조회
  const product = await getProduct(barcode);
}

// ❌ 잘못된 예시
async function handleBarcodeScan(barcode: string) {
  // ① Trigger: 바코드 스캔
  console.log('Scanning...'); // ❌ State Read 전에 다른 로직
  const product = await getProduct(barcode);
}
```

---

## ② State Read (현재 상태 확인)

### 정의
Trigger가 발생하면 반드시 "현재 상태"를 먼저 읽어야 한다.

### 예시
- "이 리소스는 DB에 존재하는가?"
- "이 Flow는 이미 실행된 적이 있는가?"
- "임시 이미지가 있는가?"
- "이미 연결된 Entity가 있는가?"
- "사용자의 권한은 무엇인가?"
- "현재 진행 중인 작업이 있는가?"

### 규칙

#### 규칙 2.1: 상태 기반 분기
- **모든 분기는 "현재 상태 값"에 의해 결정되어야 한다.**
- 상태를 읽기 전에 분기하면 안 된다.
- 상태 값은 반드시 DB/State에서 조회해야 한다. (추측 금지)

```typescript
// ✅ 올바른 예시
async function handleImageUpload(barcode: string, image: File) {
  // ② State Read: 리소스 존재 확인
  const product = await supabase
    .from('products')
    .select('barcode')
    .eq('barcode', barcode)
    .single();
  
  // ③ Branching: 상태 기반 분기
  const isTemporary = !product;
}

// ❌ 잘못된 예시
async function handleImageUpload(barcode: string, image: File) {
  // ❌ 상태를 읽기 전에 분기
  if (someCondition) { // 추측 기반 분기
    // ...
  }
  
  const product = await getProduct(barcode);
}
```

#### 규칙 2.2: 상태 우선 원칙
- **상태보다 앞서 행동이 오면 안 된다.**
- 여기서 실수가 가장 많이 발생한다.
- 상태를 확인하기 전에 Action을 실행하면 안 된다.

```typescript
// ✅ 올바른 예시
async function handleImageUpload(barcode: string, image: File) {
  // ② State Read: 먼저 상태 확인
  const product = await getProduct(barcode);
  
  // ④ Action: 상태 확인 후 행동
  if (!product) {
    await createProduct(barcode);
  }
}

// ❌ 잘못된 예시
async function handleImageUpload(barcode: string, image: File) {
  // ❌ 상태 확인 전에 행동
  await createResource(identifier); // 리소스가 이미 있을 수 있음
  
  const product = await getProduct(barcode);
}
```

#### 규칙 2.3: 상태 조회 원자성
- **상태 조회는 원자적으로 이루어져야 한다.**
- 여러 상태를 조회할 때는 동시에 조회해야 한다.
- 상태 조회 사이에 다른 로직이 들어가면 안 된다.

```typescript
// ✅ 올바른 예시
async function handleImageUpload(barcode: string, image: File) {
  // ② State Read: 모든 상태를 동시에 조회
  const [product, tempImages, user] = await Promise.all([
    getProduct(barcode),
    getTempImages(barcode),
    getCurrentUser(),
  ]);
}

// ❌ 잘못된 예시
async function handleImageUpload(barcode: string, image: File) {
  const product = await getProduct(barcode);
  // ❌ 다른 로직이 중간에 들어감
  console.log('Product:', product);
  const tempImages = await getTempImages(barcode);
}
```

---

## ③ Branching (상태 기반 분기)

### 정의
상태를 확인한 후에만 분기가 일어난다.

### 예시
- 리소스 있음 → 정식 저장
- 리소스 없음 → 임시 저장 + 자동 생성
- 파일 있음 → 이동
- 파일 없음 → 새로 생성
- 권한 있음 → 실행
- 권한 없음 → 거부

### 규칙

#### 규칙 3.1: 상태 기반 분기만 허용
- **모든 분기 조건은 State Read 결과만 사용해야 한다.**
- 추측, 가정, 하드코딩된 값으로 분기하면 안 된다.
- 분기 조건은 반드시 State Read에서 얻은 값이어야 한다.

```typescript
// ✅ 올바른 예시
async function handleImageUpload(barcode: string, image: File) {
  // ② State Read
  const product = await getProduct(barcode);
  
  // ③ Branching: 상태 기반 분기
  if (product) {
    // 리소스 있음 → 정식 저장
  } else {
    // 제품 없음 → 임시 저장
  }
}

// ❌ 잘못된 예시
async function handleImageUpload(barcode: string, image: File) {
  // ❌ 하드코딩된 값으로 분기
  if (barcode.startsWith('880')) {
    // 한국 제품이라고 가정 - 잘못됨
  }
}
```

#### 규칙 3.2: 예외 상황 처리
- **예외 상황(Edge case)은 분기 조건 바로 아래에서 처리한다.**
- 예외 처리는 분기와 함께 이루어져야 한다.
- 예외 처리를 나중으로 미루면 안 된다.

```typescript
// ✅ 올바른 예시
async function handleImageUpload(barcode: string, image: File) {
  // ② State Read
  const product = await getProduct(barcode);
  
  // ③ Branching: 상태 기반 분기 + 예외 처리
  if (product) {
    // 정식 저장
  } else {
    // 예외 처리: 제품 생성 실패 시
    try {
      await createProduct(barcode);
    } catch (error) {
      // 예외 상황 처리
      return { error: 'Failed to create product' };
    }
    // 임시 저장
  }
}
```

#### 규칙 3.3: 분기 명확성
- **분기는 반드시 명확해야 한다.**
- 불명확한 조건(예: `if (maybe)`)은 사용하면 안 된다.
- 모든 분기는 boolean 값으로 명확히 판단 가능해야 한다.

```typescript
// ✅ 올바른 예시
const isTemporary = !product; // 명확한 boolean
if (isTemporary) {
  // ...
}

// ❌ 잘못된 예시
if (product?.maybe?.exists) { // 불명확한 조건
  // ...
}
```

---

## ④ Action Execution (핵심 행동 실행)

### 정의
분기 이후 비로소 실제 "행동"이 발생한다.

### 예시
- 리소스 자동 생성
- 임시 이미지 저장
- 정식 경로 이동
- DB 업데이트
- 파일 업로드
- 사용자 권한 부여

### 규칙

#### 규칙 4.1: 행동 순서 원칙
- **행동은 절대 상태보다 먼저 오면 안 된다.**
- State Read → Branching → Action 순서가 반드시 지켜져야 한다.
- Action이 State Read보다 먼저 오면 데이터 불일치가 발생한다.

```typescript
// ✅ 올바른 예시
async function handleImageUpload(barcode: string, image: File) {
  // ② State Read
  const product = await getProduct(barcode);
  
  // ③ Branching
  const isTemporary = !product;
  
  // ④ Action: 상태 확인 후 행동
  if (isTemporary) {
    await createProduct(barcode);
    await saveImageToTemp(image);
  } else {
    await saveImageToOfficial(image);
  }
}

// ❌ 잘못된 예시
async function handleImageUpload(barcode: string, image: File) {
  // ❌ 행동이 상태 확인보다 먼저 옴
  await saveImageToOfficial(image);
  
  const product = await getProduct(barcode);
}
```

#### 규칙 4.2: 액션 묶음 원칙
- **행동은 하나의 분기가 하나의 액션 묶음을 가져야 한다.**
- 각 분기마다 명확한 액션 묶음이 있어야 한다.
- 액션 묶음은 논리적으로 연결되어야 한다.

```typescript
// ✅ 올바른 예시
async function handleImageUpload(barcode: string, image: File) {
  const product = await getProduct(barcode);
  
  if (!product) {
    // 분기 1: 리소스 없음 → 액션 묶음 1
    await createProduct(barcode);
    await saveImageToTemp(image);
    await addToRecognitionQueue(media);
  } else {
    // 분기 2: 리소스 있음 → 액션 묶음 2
    await saveImageToOfficial(image);
    await updateProductImageCount(barcode);
  }
}
```

#### 규칙 4.3: 원자적 실행
- **액션은 최소 단위로 쪼개더라도 "원자적으로" 실행돼야 한다.**
- 하나의 액션이 실패하면 전체 액션 묶음이 롤백되어야 한다.
- 트랜잭션을 사용하여 원자성을 보장해야 한다.

```typescript
// ✅ 올바른 예시
async function handleImageUpload(barcode: string, image: File) {
  const product = await getProduct(barcode);
  
  if (!product) {
    // 원자적 실행: 모두 성공하거나 모두 실패
    await supabase.rpc('create_product_with_image', {
      barcode,
      image_data: image,
    });
  }
}

// ❌ 잘못된 예시
async function handleImageUpload(barcode: string, image: File) {
  const product = await getProduct(barcode);
  
  if (!product) {
    // ❌ 원자성 없음: 리소스 생성 성공 후 미디어 저장 실패 시 불일치
    await createProduct(barcode);
    await saveImage(image); // 실패할 수 있음
  }
}
```

---

## ⑤ State Mutation (상태 변화 기록)

### 정의
행동이 발생하면 반드시 **상태를 갱신**해야 한다.

### 예시
- `is_temporary` → `false`
- `barcode` → 연결
- `url` → 업데이트
- `created_at` / `updated_at` → 기록
- `status` → 변경
- `trust_level` → 업데이트

### 규칙

#### 규칙 5.1: 상태 변화 필수
- **행동 후에는 항상 State Mutation이 필요하다.**
- 행동이 발생했는데 상태가 변하지 않으면 잘못된 로직이다.
- 모든 Action은 반드시 State Mutation을 동반해야 한다.

```typescript
// ✅ 올바른 예시
async function handleImageUpload(barcode: string, image: File) {
  const product = await getProduct(barcode);
  
  if (!product) {
    // ④ Action
    await createProduct(barcode);
    
    // ⑤ State Mutation: 상태 변화 기록
    await saveImage({
      barcode,
      is_temporary: false, // 상태 변화
      uploaded_at: new Date(), // 상태 변화
    });
  }
}

// ❌ 잘못된 예시
async function handleImageUpload(barcode: string, image: File) {
  const product = await getProduct(barcode);
  
  if (!product) {
    await createProduct(barcode);
    // ❌ 상태 변화 없음: 이미지가 저장되지 않음
  }
}
```

#### 규칙 5.2: UI와 상태 분리
- **상태 변화 없이 UI 변화만 일어나면 그것은 잘못된 로직이다.**
- UI는 상태의 반영이어야 한다.
- 상태 없이 UI만 변경하면 나중에 불일치가 발생한다.

```typescript
// ✅ 올바른 예시
async function handleLike(barcode: string) {
  // ② State Read
  const isLiked = await checkLikeStatus(barcode);
  
  // ③ Branching
  if (!isLiked) {
    // ④ Action
    await addLike(barcode);
    
    // ⑤ State Mutation: 상태 변화 기록
    await updateLikeStatus(barcode, true);
    
    // ⑦ Output: 상태 변화 후 UI 업데이트
    setIsLiked(true);
  }
}

// ❌ 잘못된 예시
async function handleLike(barcode: string) {
  // ❌ 상태 변화 없이 UI만 변경
  setIsLiked(true);
  
  await addLike(barcode); // 나중에 실패할 수 있음
}
```

#### 규칙 5.3: 상태-행동 쌍
- **하나의 행동에는 반드시 하나의 상태 변화가 묶여야 한다.**
- 행동과 상태 변화는 1:1 관계여야 한다.
- 여러 행동이 하나의 상태 변화를 공유하면 안 된다.

```typescript
// ✅ 올바른 예시
async function handleImageUpload(barcode: string, image: File) {
  const product = await getProduct(barcode);
  
  if (!product) {
    // 행동 1: 제품 생성 → 상태 변화 1
    await createProduct(barcode);
    
    // 행동 2: 이미지 저장 → 상태 변화 2
    await saveImage({
      barcode,
      is_temporary: false,
    });
  }
}

// ❌ 잘못된 예시
async function handleImageUpload(barcode: string, image: File) {
  const product = await getProduct(barcode);
  
  if (!product) {
    // ❌ 여러 행동이 하나의 상태 변화를 공유
    await createProduct(barcode);
    await saveImage(image);
    await addToQueue(image);
    // 모든 행동이 하나의 상태로 기록됨 - 잘못됨
  }
}
```

---

## ⑥ Side Effects (후속 처리, 비동기)

### 정의
핵심 로직이 끝난 후에 발생하는 작업들.

### 예시
- 인식 큐에 추가
- 웹훅 호출
- 알림 생성
- 자동 Flow 이어붙이기
- 로그 기록
- 통계 업데이트
- 캐시 무효화

### 규칙

#### 규칙 6.1: 핵심 로직 분리
- **Side Effect는 핵심 로직과 분리해야 한다.**
- Side Effect가 핵심 로직의 성공/실패에 영향을 주면 안 된다.
- Side Effect는 독립적으로 실행되어야 한다.

```typescript
// ✅ 올바른 예시
async function handleImageUpload(barcode: string, image: File) {
  // ②-⑤: 핵심 로직
  const product = await getProduct(barcode);
  if (!product) {
    await createProduct(barcode);
    await saveImage({ barcode, is_temporary: false });
  }
  
  // ⑥ Side Effect: 핵심 로직과 분리
  try {
    await addToRecognitionQueue(media); // 실패해도 핵심 로직에 영향 없음
  } catch (error) {
    console.error('Recognition queue error:', error);
  }
}

// ❌ 잘못된 예시
async function handleImageUpload(barcode: string, image: File) {
  const product = await getProduct(barcode);
  if (!product) {
    await createProduct(barcode);
    // ❌ Side Effect가 핵심 로직에 영향
    await addToRecognitionQueue(media); // 실패 시 전체 실패
    await saveImage({ barcode, is_temporary: false });
  }
}
```

#### 규칙 6.2: 실패 허용
- **실패해도 전체 로직을 망치지 않아야 한다.**
- Side Effect는 try-catch로 감싸야 한다.
- Side Effect 실패는 로그만 남기고 계속 진행해야 한다.

```typescript
// ✅ 올바른 예시
async function handleImageUpload(barcode: string, image: File) {
  // ②-⑤: 핵심 로직
  const product = await getProduct(barcode);
  if (!product) {
    await createProduct(barcode);
    await saveImage({ barcode, is_temporary: false });
  }
  
  // ⑥ Side Effect: 실패 허용
  try {
    await addToRecognitionQueue(media);
  } catch (error) {
    // 실패해도 핵심 로직은 성공
    console.error('Recognition queue error:', error);
  }
  
  // ⑦ Output: Side Effect 실패와 무관하게 반환
  return { success: true };
}
```

#### 규칙 6.3: 비동기 처리 권장
- **가능하면 비동기(Worker, Queue)로 처리한다.**
- Side Effect는 사용자 대기를 필요로 하지 않아야 한다.
- 긴 작업은 Worker나 Queue로 분리해야 한다.

```typescript
// ✅ 올바른 예시
async function handleImageUpload(barcode: string, image: File) {
  // ②-⑤: 핵심 로직
  const product = await getProduct(barcode);
  if (!product) {
    await createProduct(barcode);
    await saveImage({ barcode, is_temporary: false });
  }
  
  // ⑥ Side Effect: 비동기 처리
  // 사용자 대기 없이 백그라운드에서 실행
  addToOCRQueue(image).catch(error => {
    console.error('Recognition queue error:', error);
  });
  
  // ⑦ Output: 즉시 반환
  return { success: true };
}

// ❌ 잘못된 예시
async function handleImageUpload(barcode: string, image: File) {
  const product = await getProduct(barcode);
  if (!product) {
    await createProduct(barcode);
    await saveImage({ barcode, is_temporary: false });
  }
  
  // ❌ 사용자 대기: 인식 처리가 끝날 때까지 기다림
  await processOCR(image); // 느림
}
```

---

## ⑦ Output (결과 반환 / 화면 이동)

### 정의
마지막에 반드시 사용자가 받을 "결과"를 정리한다.

### 예시
- 제품 페이지 이동
- 성공 메시지
- FlowFrame의 다음 스텝
- 로그 기록
- API 응답
- UI 상태 업데이트

### 규칙

#### 규칙 7.1: 최종 단계
- **Output은 가장 마지막이어야 한다.**
- Output 전에 UI 이동이나 DB 저장이 발생하면 시스템이 꼬인다.
- 모든 로직이 완료된 후에만 Output이 발생해야 한다.

```typescript
// ✅ 올바른 예시
async function handleImageUpload(barcode: string, image: File) {
  // ②-⑤: 핵심 로직
  const product = await getProduct(barcode);
  if (!product) {
    await createProduct(barcode);
    await saveImage({ barcode, is_temporary: false });
  }
  
  // ⑥ Side Effect
  addToOCRQueue(image).catch(console.error);
  
  // ⑦ Output: 모든 로직 완료 후 반환
  return { success: true, imageId: image.id };
}

// ❌ 잘못된 예시
async function handleImageUpload(barcode: string, image: File) {
  // ❌ Output이 중간에 발생
  return { success: true };
  
  // 이후 로직은 실행되지 않음
  await saveImage({ barcode, is_temporary: false });
}
```

#### 규칙 7.2: 상태 변화 후 해석
- **Output은 항상 "상태 변화 후"에만 해석해야 한다.**
- 상태가 변경되기 전의 값을 Output으로 반환하면 안 된다.
- Output은 최신 상태를 반영해야 한다.

```typescript
// ✅ 올바른 예시
async function handleImageUpload(barcode: string, image: File) {
  const product = await getProduct(barcode);
  
  if (!product) {
    await createProduct(barcode);
    await saveImage({ barcode, is_temporary: false });
    
    // ⑦ Output: 상태 변화 후 최신 상태 반환
    const updatedProduct = await getProduct(barcode);
    return { success: true, product: updatedProduct };
  }
}

// ❌ 잘못된 예시
async function handleImageUpload(barcode: string, image: File) {
  const product = await getProduct(barcode);
  
  if (!product) {
    await createProduct(barcode);
    
    // ❌ 상태 변화 전의 값을 반환
    return { success: true, product }; // null 또는 오래된 값
  }
}
```

#### 규칙 7.3: 명확한 결과
- **Output은 반드시 명확해야 한다.**
- 성공/실패 여부가 명확해야 한다.
- 에러가 발생하면 에러 정보를 포함해야 한다.

```typescript
// ✅ 올바른 예시
async function handleImageUpload(barcode: string, image: File) {
  try {
    // ②-⑤: 핵심 로직
    const product = await getProduct(barcode);
    if (!product) {
      await createProduct(barcode);
      await saveImage({ barcode, is_temporary: false });
    }
    
    // ⑦ Output: 명확한 결과
    return {
      success: true,
      imageId: image.id,
      barcode,
    };
  } catch (error) {
    // ⑦ Output: 명확한 에러
    return {
      success: false,
      error: error.message,
    };
  }
}

// ❌ 잘못된 예시
async function handleImageUpload(barcode: string, image: File) {
  // ❌ 불명확한 결과
  return { ok: true }; // 무엇이 성공했는지 불명확
}
```

---

## 🔄 전체 플로우 예시

### 예시 1: 이미지 업로드 (제품 없을 때)

```typescript
async function handleImageUpload(barcode: string, image: File) {
  try {
    // ① Trigger: 이미지 업로드 요청
    // (함수 호출 자체가 Trigger)
    
    // ② State Read: 현재 상태 확인
    const product = await supabase
      .from('products')
      .select('barcode')
      .eq('barcode', barcode)
      .single();
    
    // ③ Branching: 상태 기반 분기
    const isTemporary = !product;
    
    // ④ Action: 핵심 행동 실행
    if (isTemporary) {
      // 제품 자동 생성
      await supabase.from('products').insert({
        barcode,
        product_name: `제품 ${barcode}`,
      });
    }
    
    // 이미지 저장
    const imageRecord = await supabase
      .from('product_images')
      .insert({
        barcode: isTemporary ? null : barcode,
        image_url: imageUrl,
        is_temporary: isTemporary,
      })
      .select()
      .single();
    
    // ⑤ State Mutation: 상태 변화 기록
    if (!isTemporary && product) {
      // 제품 생성되었으면 이미지 경로 이동
      await supabase
        .from('product_images')
        .update({
          barcode: barcode,
          is_temporary: false,
          image_url: officialUrl,
        })
        .eq('id', imageRecord.id);
    }
    
    // ⑥ Side Effect: 후속 처리 (비동기)
    addToOCRQueue(imageRecord.id).catch(error => {
      console.error('Recognition queue error:', error);
    });
    
    // ⑦ Output: 결과 반환
    return {
      success: true,
      imageId: imageRecord.id,
      barcode,
    };
  } catch (error) {
    // ⑦ Output: 에러 반환
    return {
      success: false,
      error: error.message,
    };
  }
}
```

### 예시 2: 제품 정보 저장

```typescript
async function handleProductSave(barcode: string, data: ProductData) {
  try {
    // ① Trigger: 저장 버튼 클릭
    // (함수 호출 자체가 Trigger)
    
    // ② State Read: 현재 상태 확인
    const [product, tempImages, existingRequests] = await Promise.all([
      getProduct(barcode),
      getTempImages(barcode),
      getMissingFieldRequests(barcode),
    ]);
    
    // ③ Branching: 상태 기반 분기
    const isNewProduct = !product;
    
    // ④ Action: 핵심 행동 실행
    if (isNewProduct) {
      // 제품 생성
      await createProduct(barcode, data);
    } else {
      // 제품 업데이트
      await updateProduct(barcode, data);
    }
    
    // 임시 이미지 이동
    if (tempImages.length > 0) {
      for (const image of tempImages) {
        await moveImageToOfficial(image, barcode);
      }
    }
    
    // ⑤ State Mutation: 상태 변화 기록
    await supabase
      .from('products')
      .update({
        updated_at: new Date(),
        trust_score: calculateTrustScore(data),
      })
      .eq('barcode', barcode);
    
    // 부족 정보 요청 완료 처리
    if (existingRequests.length > 0) {
      await updateRequestStatus(existingRequests, data);
    }
    
    // ⑥ Side Effect: 후속 처리 (비동기)
    saveScanSession({
      barcode,
      data,
      images: tempImages,
    }).catch(error => {
      console.error('Scan session save error:', error);
    });
    
    // ⑦ Output: 결과 반환
    return {
      success: true,
      product: await getProduct(barcode), // 최신 상태
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
```

---

## 🎯 FlowFrame 적용

### FlowFrame도 이 7단계를 따라야 한다:

```
① Trigger (Flow 시작)
  ↓
② State Read (관련 Entity/Item 상태 조회)
  ↓
③ Branching (조건부 FlowFrame 선택)
  ↓
④ Action Blocks 실행
  ↓
⑤ Impact Field로 상태 변화 기록
  ↓
⑥ Side Effects (알림/회계/후속 Flow)
  ↓
⑦ Output (다음 화면/다음 Flow)
```

### FlowFrame 예시

```yaml
flow_frame:
  name: "제품 이미지 업로드"
  
  # ① Trigger
  trigger:
    type: "file_upload"
    event: "image_uploaded"
  
  # ② State Read
  state_read:
    - entity: "products"
      query: "barcode = {{barcode}}"
    - entity: "product_images"
      query: "temp_barcode = {{barcode}} AND is_temporary = true"
  
  # ③ Branching
  branching:
    condition: "product.exists == false"
    true_branch: "create_product_flow"
    false_branch: "update_product_flow"
  
  # ④ Action Blocks
  actions:
    - name: "create_product"
      condition: "product.exists == false"
      execute: "create_product_action"
    
    - name: "save_image"
      execute: "save_image_action"
    
    - name: "move_temp_images"
      condition: "temp_images.length > 0"
      execute: "move_images_action"
  
  # ⑤ State Mutation
  state_mutation:
    - entity: "products"
      update:
        updated_at: "{{now}}"
    
    - entity: "product_images"
      update:
        is_temporary: false
        barcode: "{{barcode}}"
  
  # ⑥ Side Effects
  side_effects:
    - type: "ocr_queue"
      action: "add"
      async: true
    
    - type: "notification"
      action: "send"
      async: true
  
  # ⑦ Output
  output:
    type: "redirect"
    target: "/products/{{barcode}}"
    success_message: "이미지가 업로드되었습니다."
```

---

## ⚠️ 위반 시나리오 및 해결

### 위반 1: State Read 전에 Action 실행

```typescript
// ❌ 잘못된 예시
async function handleImageUpload(barcode: string, image: File) {
  // ④ Action이 ② State Read보다 먼저 옴
  await saveImage(image);
  
  const product = await getProduct(barcode);
}

// ✅ 올바른 예시
async function handleImageUpload(barcode: string, image: File) {
  // ② State Read 먼저
  const product = await getProduct(barcode);
  
  // ④ Action 나중에
  await saveImage(image);
}
```

### 위반 2: State Mutation 없이 Action 실행

```typescript
// ❌ 잘못된 예시
async function handleImageUpload(barcode: string, image: File) {
  const product = await getProduct(barcode);
  
  if (!product) {
    // ④ Action만 실행, ⑤ State Mutation 없음
    await createProduct(barcode);
  }
}

// ✅ 올바른 예시
async function handleImageUpload(barcode: string, image: File) {
  const product = await getProduct(barcode);
  
  if (!product) {
    // ④ Action
    await createProduct(barcode);
    
    // ⑤ State Mutation
    await saveImage({
      barcode,
      is_temporary: false,
    });
  }
}
```

### 위반 3: Output 전에 Side Effect가 핵심 로직에 영향

```typescript
// ❌ 잘못된 예시
async function handleImageUpload(barcode: string, image: File) {
  const product = await getProduct(barcode);
  
  if (!product) {
    await createProduct(barcode);
    // ⑥ Side Effect가 핵심 로직에 영향
    await processOCR(image); // 실패 시 전체 실패
  }
  
  // ⑦ Output
  return { success: true };
}

// ✅ 올바른 예시
async function handleImageUpload(barcode: string, image: File) {
  const product = await getProduct(barcode);
  
  if (!product) {
    await createProduct(barcode);
    await saveImage({ barcode, is_temporary: false });
  }
  
  // ⑥ Side Effect: 핵심 로직과 분리
  processOCR(image).catch(console.error);
  
  // ⑦ Output
  return { success: true };
}
```

---

## 📚 체크리스트

모든 로직을 작성할 때 다음 체크리스트를 확인하세요:

- [ ] ① Trigger가 명확히 정의되어 있는가?
- [ ] ② State Read가 Trigger 직후에 실행되는가?
- [ ] ③ Branching이 State Read 결과만 사용하는가?
- [ ] ④ Action이 Branching 이후에 실행되는가?
- [ ] ⑤ State Mutation이 모든 Action 후에 실행되는가?
- [ ] ⑥ Side Effect가 핵심 로직과 분리되어 있는가?
- [ ] ⑦ Output이 모든 로직 완료 후에 반환되는가?

---

## 🎯 결론

이 7단계 절대 원칙을 따르면:

1. **데이터 일관성** 보장
2. **에러 처리** 명확화
3. **사용자 경험** 향상
4. **유지보수성** 향상
5. **실수 확률** 최소화

**이 순서가 무너지면 시스템은 불안정해진다.**  
**이 순서가 완벽하면 어떤 시스템도 절대 무너지지 않는다.**

---

**작성일**: 2024년  
**문서 타입**: Constitution (절대 원칙)  
**적용 범위**: 모든 Flow / Function / API / Event

