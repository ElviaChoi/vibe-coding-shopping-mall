const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  // 사용자 ID (참조)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '사용자 ID는 필수입니다.']
  },
  
  // 장바구니 아이템들
  items: [{
    // 상품 ID (참조)
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, '상품 ID는 필수입니다.']
    },
    
    // 선택된 사이즈
    size: {
      type: String,
      required: [true, '사이즈는 필수입니다.']
    },
    
    // 수량
    quantity: {
      type: Number,
      required: [true, '수량은 필수입니다.'],
      min: [1, '수량은 1 이상이어야 합니다.']
    },
  }],
  
  // 장바구니 상태
  status: {
    type: String,
    enum: ['active', 'abandoned', 'converted'],
    default: 'active',
    comment: 'active: 활성, abandoned: 포기됨, converted: 주문으로 전환됨'
  },
  
  // 마지막 업데이트 시간
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 복합 인덱스: 사용자별 장바구니 조회 최적화
cartSchema.index({ user: 1, status: 1 });
cartSchema.index({ user: 1, createdAt: -1 });

// 인덱스: 장바구니 아이템의 상품 참조 최적화
cartSchema.index({ 'items.product': 1 });

// 미들웨어: 장바구니 업데이트 시 lastUpdated 자동 갱신
cartSchema.pre('save', function(next) {
  if (this.isModified('items')) {
    this.lastUpdated = new Date();
  }
  next();
});

// 가상 필드: 장바구니 총 아이템 수
cartSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// 가상 필드: 장바구니 총 금액 계산
cartSchema.virtual('totalAmount').get(async function() {
  // populate가 필요한 경우를 위해 별도 메서드로 처리
  return 0; // 기본값, 실제 계산은 메서드에서 처리
});

// 인스턴스 메서드: 장바구니에 상품 추가
cartSchema.methods.addItem = function(productId, size, quantity = 1) {
  // 이미 같은 상품과 사이즈가 있는지 확인
  const existingItem = this.items.find(
    item => item.product.toString() === productId.toString() && item.size === size
  );
  
  if (existingItem) {
    // 기존 아이템 수량 증가
    existingItem.quantity += quantity;
    existingItem.addedAt = new Date();
  } else {
    // 새 아이템 추가
    this.items.push({
      product: productId,
      size: size,
      quantity: quantity,
      addedAt: new Date()
    });
  }
  
  this.lastUpdated = new Date();
  return this.save();
};

// 인스턴스 메서드: 장바구니에서 상품 제거
cartSchema.methods.removeItem = function(productId, size) {
  this.items = this.items.filter(
    item => !(item.product.toString() === productId.toString() && item.size === size)
  );
  
  this.lastUpdated = new Date();
  return this.save();
};

// 인스턴스 메서드: 특정 아이템 수량 업데이트
cartSchema.methods.updateQuantity = function(productId, size, quantity) {
  const item = this.items.find(
    item => item.product.toString() === productId.toString() && item.size === size
  );
  
  if (item) {
    if (quantity <= 0) {
      // 수량이 0 이하면 아이템 제거
      return this.removeItem(productId, size);
    } else {
      item.quantity = quantity;
      this.lastUpdated = new Date();
      return this.save();
    }
  }
  
  return Promise.resolve(this);
};

// 인스턴스 메서드: 장바구니 비우기
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.lastUpdated = new Date();
  return this.save();
};

// 인스턴스 메서드: 장바구니 총 금액 계산 (populate 필요)
cartSchema.methods.calculateTotal = async function() {
  await this.populate('items.product');
  
  let total = 0;
  for (const item of this.items) {
    if (item.product && item.product.price) {
      total += item.product.price * item.quantity;
    }
  }
  
  return total;
};

// 정적 메서드: 사용자의 활성 장바구니 찾기 또는 생성
cartSchema.statics.findOrCreateActiveCart = async function(userId) {
  let cart = await this.findOne({ user: userId, status: 'active' });
  
  if (!cart) {
    cart = new this({
      user: userId,
      items: [],
      status: 'active'
    });
    await cart.save();
  }
  
  return cart;
};

// JSON 변환 시 가상 필드 포함
cartSchema.set('toJSON', { virtuals: true });
cartSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Cart', cartSchema);
