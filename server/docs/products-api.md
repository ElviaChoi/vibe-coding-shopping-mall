# 상품 관리 API 문서

## 개요
상품의 생성, 조회, 수정, 삭제를 위한 완전한 CRUD API입니다.

## 기본 URL
```
/api/products
```

## 인증
- 공개 라우트: 인증 불필요
- 관리자 라우트: JWT 토큰 필요 (`Authorization: Bearer <token>`)

---

## 공개 라우트 (인증 불필요)

### 1. 모든 상품 조회
```http
GET /api/products
```

**쿼리 파라미터:**
- `page` (number): 페이지 번호 (기본값: 1)
- `limit` (number): 페이지당 상품 수 (기본값: 10)
- `mainCategory` (string): 메인 카테고리 필터
- `subCategory` (string): 서브 카테고리 필터
- `minPrice` (number): 최소 가격
- `maxPrice` (number): 최대 가격
- `search` (string): 검색어
- `isActive` (boolean): 활성 상태 필터 (기본값: true)

**응답 예시:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalProducts": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 2. 특정 상품 조회
```http
GET /api/products/:id
```

### 3. SKU로 상품 조회
```http
GET /api/products/sku/:sku
```

### 4. 카테고리별 상품 조회
```http
GET /api/products/category/:mainCategory/:subCategory?
```

### 5. 상품 고급 검색
```http
GET /api/products/search
```

**쿼리 파라미터:**
- `query` (string): 검색어
- `mainCategory` (string): 메인 카테고리
- `subCategory` (string): 서브 카테고리
- `minPrice` (number): 최소 가격
- `maxPrice` (number): 최대 가격
- `brand` (string): 브랜드명
- `tags` (array): 태그 배열
- `isActive` (boolean): 활성 상태
- `isFeatured` (boolean): 추천 상품 여부
- `sortBy` (string): 정렬 기준 (기본값: createdAt)
- `sortOrder` (string): 정렬 순서 (asc/desc, 기본값: desc)
- `page` (number): 페이지 번호
- `limit` (number): 페이지당 상품 수

### 6. 상품 통계 조회
```http
GET /api/products/stats
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalProducts": 100,
      "activeProducts": 85,
      "inactiveProducts": 15,
      "featuredProducts": 20,
      "averagePrice": 45000,
      "minPrice": 10000,
      "maxPrice": 200000
    },
    "categoryStats": [
      { "_id": "women", "count": 40 },
      { "_id": "men", "count": 35 },
      { "_id": "accessories", "count": 25 }
    ],
    "subCategoryStats": [
      { "_id": "top", "count": 30 },
      { "_id": "bottom", "count": 25 },
      { "_id": "dress", "count": 20 }
    ]
  }
}
```

---

## 관리자 라우트 (인증 필요)

### 1. 새 상품 생성
```http
POST /api/products
Authorization: Bearer <token>
```

**요청 본문:**
```json
{
  "sku": "WOMEN-TSHIRT-001",
  "name": "여성용 기본 티셔츠",
  "description": "편안한 소재의 기본 티셔츠입니다.",
  "price": 25000,
  "mainCategory": "women",
  "subCategory": "top",
  "images": [
    {
      "url": "https://example.com/image1.jpg",
      "alt": "티셔츠 앞면",
      "isMain": true
    }
  ],
  "sizes": [
    { "size": "S", "stock": 10 },
    { "size": "M", "stock": 15 },
    { "size": "L", "stock": 8 }
  ],
  "brand": "브랜드명",
  "tags": ["기본", "티셔츠", "여성"]
}
```

### 2. 상품 정보 수정
```http
PUT /api/products/:id
Authorization: Bearer <token>
```

**요청 본문:** (수정할 필드만 포함)

### 3. 상품 삭제
```http
DELETE /api/products/:id
Authorization: Bearer <token>
```

### 4. 대량 상품 삭제
```http
DELETE /api/products/bulk
Authorization: Bearer <token>
```

**요청 본문:**
```json
{
  "productIds": ["productId1", "productId2", "productId3"]
}
```

### 5. 상품 복사
```http
POST /api/products/:id/duplicate
Authorization: Bearer <token>
```

**요청 본문:**
```json
{
  "newSku": "WOMEN-TSHIRT-002"
}
```

### 6. 재고 업데이트
```http
PUT /api/products/:id/stock
Authorization: Bearer <token>
```

**요청 본문:**
```json
{
  "sizes": [
    { "size": "S", "stock": 5 },
    { "size": "M", "stock": 12 },
    { "size": "L", "stock": 3 }
  ]
}
```

---

## 상품 모델 스키마

```javascript
{
  sku: String,           // 필수, 고유
  name: String,          // 필수
  description: String,  // 선택
  price: Number,         // 필수
  mainCategory: String,  // 필수 (women, men, accessories, sale)
  subCategory: String,   // 필수 (top, bottom, dress, outer, bag, shoes, etc.)
  images: [{
    url: String,         // 필수
    alt: String,        // 선택
    isMain: Boolean     // 기본값: false
  }],
  sizes: [{
    size: String,       // 필수
    stock: Number       // 필수, 0 이상
  }],
  brand: String,        // 선택
  tags: [String],       // 선택
  isActive: Boolean,    // 기본값: true
  isFeatured: Boolean, // 기본값: false
  rating: {
    average: Number,    // 기본값: 0, 0-5 범위
    count: Number       // 기본값: 0
  }
}
```

---

## 에러 응답

모든 API는 일관된 에러 응답 형식을 사용합니다:

```json
{
  "success": false,
  "message": "에러 메시지",
  "errors": ["상세 에러 1", "상세 에러 2"] // 유효성 검사 실패 시
}
```

**HTTP 상태 코드:**
- `200`: 성공
- `201`: 생성 성공
- `400`: 잘못된 요청
- `401`: 인증 실패
- `404`: 리소스 없음
- `409`: 중복 충돌
- `500`: 서버 오류

---

## 사용 예시

### JavaScript (Fetch API)
```javascript
// 상품 목록 조회
const response = await fetch('/api/products?page=1&limit=10');
const data = await response.json();

// 새 상품 생성
const newProduct = await fetch('/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    sku: 'WOMEN-TSHIRT-001',
    name: '여성용 기본 티셔츠',
    price: 25000,
    mainCategory: 'women',
    subCategory: 'top',
    images: [{ url: 'https://example.com/image.jpg', isMain: true }],
    sizes: [{ size: 'M', stock: 10 }]
  })
});
```

### cURL
```bash
# 상품 목록 조회
curl -X GET "http://localhost:5000/api/products?page=1&limit=10"

# 새 상품 생성
curl -X POST "http://localhost:5000/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "sku": "WOMEN-TSHIRT-001",
    "name": "여성용 기본 티셔츠",
    "price": 25000,
    "mainCategory": "women",
    "subCategory": "top",
    "images": [{"url": "https://example.com/image.jpg", "isMain": true}],
    "sizes": [{"size": "M", "stock": 10}]
  }'
```
