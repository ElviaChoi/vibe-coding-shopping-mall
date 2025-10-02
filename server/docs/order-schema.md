# 주문(Order) 스키마 설계 문서

## 📋 개요

쇼핑몰의 주문 시스템을 위한 MongoDB 스키마입니다. 주문 생성부터 배송 완료, 취소/환불까지의 전체 주문 생명주기를 관리합니다.

## 🗂️ 스키마 구조

### 1. 기본 주문 정보

```javascript
{
  orderNumber: String,      // 주문번호 (예: ORD-20250930-001) - 자동 생성
  user: ObjectId,           // User 모델 참조
  status: String,           // 주문 상태
  createdAt: Date,          // 주문 생성 일시 (자동)
  updatedAt: Date           // 주문 수정 일시 (자동)
}
```

#### 주문 상태 (status)
- `pending`: 주문 대기 (결제 전)
- `paid`: 결제 완료
- `preparing`: 배송 준비중
- `shipping`: 배송중
- `delivered`: 배송 완료
- `cancelled`: 주문 취소
- `refunded`: 환불 완료

### 2. 주문자 정보 (customer)

주문 당시의 고객 정보를 스냅샷으로 저장합니다.

```javascript
{
  customer: {
    name: String,           // 주문자명
    email: String,          // 이메일
    phone: String           // 전화번호
  }
}
```

### 3. 배송 정보 (shipping)

```javascript
{
  shipping: {
    recipient: String,      // 수령인명
    phone: String,          // 수령인 전화번호
    address: {
      postalCode: String,   // 우편번호
      mainAddress: String,  // 기본 주소
      detailAddress: String // 상세 주소
    },
    message: String,        // 배송 요청사항
    trackingNumber: String, // 송장 번호
    shippedAt: Date,        // 배송 시작 일시
    deliveredAt: Date       // 배송 완료 일시
  }
}
```

### 4. 주문 상품 목록 (items)

주문 당시의 상품 정보를 스냅샷으로 저장하여, 상품이 수정/삭제되어도 주문 이력을 유지합니다.

```javascript
{
  items: [{
    product: ObjectId,      // Product 모델 참조
    snapshot: {
      sku: String,          // 상품 코드
      name: String,         // 상품명
      price: Number,        // 주문 당시 가격
      imageUrl: String,     // 대표 이미지
      brand: String         // 브랜드
    },
    size: String,           // 선택한 사이즈
    quantity: Number,       // 수량
    subtotal: Number        // 소계 (가격 × 수량)
  }]
}
```

### 5. 결제 정보 (payment)

```javascript
{
  payment: {
    // 금액 정보
    itemsTotal: Number,     // 총 상품 금액
    shippingFee: Number,    // 배송비
    discount: Number,       // 할인 금액
    finalAmount: Number,    // 최종 결제 금액
    
    // 결제 수단
    method: String,         // credit_card, bank_transfer, kakao_pay 등
    
    // 결제 상태
    status: String,         // pending, completed, failed, cancelled, refunded
    paidAt: Date,           // 결제 완료 일시
    transactionId: String   // PG사 트랜잭션 ID
  }
}
```

#### 결제 수단 (payment.method)
- `credit_card`: 신용카드
- `bank_transfer`: 계좌이체
- `virtual_account`: 가상계좌
- `mobile`: 휴대폰 결제
- `kakao_pay`: 카카오페이
- `naver_pay`: 네이버페이
- `toss`: 토스페이

#### 결제 상태 (payment.status)
- `pending`: 결제 대기
- `completed`: 결제 완료
- `failed`: 결제 실패
- `cancelled`: 결제 취소
- `refunded`: 환불 완료

### 6. 취소/환불 정보 (cancellation)

```javascript
{
  cancellation: {
    reason: String,         // 취소/환불 사유
    cancelledAt: Date,      // 취소 일시
    refundedAt: Date,       // 환불 완료 일시
    refundAmount: Number    // 환불 금액
  }
}
```

### 7. 기타

```javascript
{
  orderNote: String         // 주문 메모 (최대 500자)
}
```

## 🔑 인덱스 설정

성능 최적화를 위한 인덱스:

```javascript
- orderNumber: 고유 인덱스
- user + createdAt: 사용자별 주문 조회
- status: 주문 상태별 조회
- payment.status: 결제 상태별 조회
- createdAt: 최신순 정렬
- items.product: 상품별 주문 조회
```

## 📊 가상 필드 (Virtual Fields)

### totalItems
전체 주문 상품 개수 계산

```javascript
order.totalItems // 모든 items의 quantity 합계
```

## 🛠️ 인스턴스 메서드

### updateStatus(newStatus)
주문 상태 업데이트

```javascript
await order.updateStatus('shipping');
// 배송중으로 변경 시 shippedAt 자동 설정
```

### markAsPaid(transactionId)
결제 완료 처리

```javascript
await order.markAsPaid('TXN-123456');
```

### cancelOrder(reason)
주문 취소

```javascript
await order.cancelOrder('고객 요청에 의한 취소');
```

### processRefund(amount, reason)
환불 처리

```javascript
await order.processRefund(50000, '상품 불량');
```

## 🔍 정적 메서드

### findByUser(userId, options)
사용자의 주문 내역 조회

```javascript
// 전체 주문 조회
const orders = await Order.findByUser(userId);

// 특정 상태 주문 조회
const pendingOrders = await Order.findByUser(userId, { status: 'pending' });

// 최근 5개 주문 조회
const recentOrders = await Order.findByUser(userId, { limit: 5 });
```

### findByOrderNumber(orderNumber)
주문 번호로 조회

```javascript
const order = await Order.findByOrderNumber('ORD-20250930-001');
```

## 🔄 주문 생명주기

```
1. 주문 생성 (pending)
   ↓
2. 결제 완료 (paid)
   ↓
3. 배송 준비 (preparing)
   ↓
4. 배송 시작 (shipping)
   ↓
5. 배송 완료 (delivered)

또는

취소 (cancelled) → 환불 (refunded)
```

## 💡 사용 예시

### 1. 주문 생성

```javascript
const Order = require('./models/Order');

const newOrder = new Order({
  user: userId,
  customer: {
    name: '홍길동',
    email: 'hong@example.com',
    phone: '010-1234-5678'
  },
  shipping: {
    recipient: '홍길동',
    phone: '010-1234-5678',
    address: {
      postalCode: '12345',
      mainAddress: '서울시 강남구 테헤란로 123',
      detailAddress: '456호'
    },
    message: '문 앞에 놔주세요'
  },
  items: [{
    product: productId,
    snapshot: {
      sku: 'TSH-001',
      name: '기본 티셔츠',
      price: 29900,
      imageUrl: 'https://...',
      brand: 'MyBrand'
    },
    size: 'M',
    quantity: 2,
    subtotal: 59800
  }],
  payment: {
    itemsTotal: 59800,
    shippingFee: 3000,
    discount: 0,
    finalAmount: 62800,
    method: 'credit_card',
    status: 'pending'
  }
});

await newOrder.save();
// orderNumber 자동 생성: ORD-20250930-001
```

### 2. 주문 조회

```javascript
// 주문 번호로 조회
const order = await Order.findByOrderNumber('ORD-20250930-001');

// 사용자의 모든 주문 조회
const userOrders = await Order.findByUser(userId);

// 배송중인 주문만 조회
const shippingOrders = await Order.find({ status: 'shipping' });
```

### 3. 주문 상태 변경

```javascript
// 결제 완료
await order.markAsPaid('PG-TXN-123456');

// 배송 시작
await order.updateStatus('shipping');
order.shipping.trackingNumber = '1234567890';
await order.save();

// 배송 완료
await order.updateStatus('delivered');
```

### 4. 주문 취소/환불

```javascript
// 주문 취소
await order.cancelOrder('단순 변심');

// 환불 처리
await order.processRefund(62800, '상품 불량');
```

## 📝 주의사항

1. **스냅샷 저장**: 주문 생성 시 상품 정보를 snapshot에 복사하여 저장해야 합니다. 원본 상품이 수정/삭제되어도 주문 이력이 유지됩니다.

2. **금액 계산**: 
   - `subtotal` = 가격 × 수량
   - `finalAmount` = itemsTotal + shippingFee - discount

3. **주문 번호**: 주문 생성 시 자동으로 생성됩니다 (형식: ORD-YYYYMMDD-XXX)

4. **상태 관리**: 주문 상태와 결제 상태를 별도로 관리하여 세밀한 추적이 가능합니다.

5. **재고 관리**: 주문 생성/취소 시 Product의 재고(stock)를 업데이트하는 로직이 별도로 필요합니다.

## 🔗 관련 모델

- **User**: 주문한 사용자 정보
- **Product**: 주문 상품 정보
- **Cart**: 장바구니에서 주문으로 전환

## 📦 향후 확장 가능 항목

- 쿠폰/프로모션 코드 지원
- 포인트/적립금 사용
- 배송 추적 이력
- 주문 리뷰/평점
- 교환 요청 처리
- 부분 취소/환불
