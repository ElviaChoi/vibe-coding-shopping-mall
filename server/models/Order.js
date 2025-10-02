const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // 주문 번호 (자동 생성)
  orderNumber: {
    type: String,
    unique: true,
    required: true,
    comment: '주문번호 (예: ORD-20250930-001)'
  },
  
  // 사용자 정보
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '사용자 ID는 필수입니다.']
  },
  
  // 주문 상태
  status: {
    type: String,
    required: true,
    enum: {
      values: [
        'pending',      // 주문 대기 (결제 전)
        'paid',         // 결제 완료
        'preparing',    // 배송 준비중
        'shipping',     // 배송중
        'delivered',    // 배송 완료
        'cancelled',    // 주문 취소
        'refunded'      // 환불 완료
      ],
      message: '올바른 주문 상태를 선택해주세요.'
    },
    default: 'pending'
  },
  
  // 주문자 정보
  customer: {
    name: {
      type: String,
      required: [true, '주문자명은 필수입니다.'],
      trim: true
    },
    email: {
      type: String,
      required: [true, '이메일은 필수입니다.'],
      lowercase: true
    },
    phone: {
      type: String,
      required: [true, '전화번호는 필수입니다.'],
      trim: true
    }
  },
  
  // 배송 정보
  shipping: {
    recipient: {
      type: String,
      required: [true, '수령인명은 필수입니다.'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, '수령인 전화번호는 필수입니다.'],
      trim: true
    },
    address: {
      postalCode: {
        type: String,
        required: [true, '우편번호는 필수입니다.'],
        trim: true
      },
      mainAddress: {
        type: String,
        required: [true, '기본 주소는 필수입니다.'],
        trim: true
      },
      detailAddress: {
        type: String,
        trim: true
      }
    },
    message: {
      type: String,
      trim: true,
      maxlength: [200, '배송 메시지는 200자를 초과할 수 없습니다.']
    },
    trackingNumber: {
      type: String,
      trim: true,
      comment: '송장 번호'
    },
    shippedAt: {
      type: Date,
      comment: '배송 시작 일시'
    },
    deliveredAt: {
      type: Date,
      comment: '배송 완료 일시'
    }
  },
  
  // 주문 상품 목록
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    size: {
      type: String,
      required: [true, '사이즈는 필수입니다.']
    },
    quantity: {
      type: Number,
      required: [true, '수량은 필수입니다.'],
      min: [1, '수량은 1 이상이어야 합니다.']
    }
  }],
  
  // 결제 정보
  payment: {
    // 금액 정보
    itemsTotal: {
      type: Number,
      required: true,
      min: 0,
      comment: '총 상품 금액'
    },
    shippingFee: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      comment: '배송비'
    },
    finalAmount: {
      type: Number,
      required: true,
      min: 0,
      comment: '최종 결제 금액 (상품금액 + 배송비)'
    },
    
    // 결제 수단
    method: {
      type: String,
      required: true,
      enum: {
        values: [
          'credit_card',      // 신용카드
          'bank_transfer',    // 계좌이체
          'virtual_account',  // 가상계좌
          'mobile',           // 휴대폰 결제
          'kakao_pay',        // 카카오페이
          'naver_pay',        // 네이버페이
          'toss'              // 토스페이
        ],
        message: '올바른 결제 수단을 선택해주세요.'
      }
    },
    
    // 결제 상태
    status: {
      type: String,
      required: true,
      enum: {
        values: [
          'pending',    // 결제 대기
          'completed',  // 결제 완료
          'failed',     // 결제 실패
          'cancelled',  // 결제 취소
          'refunded'    // 환불 완료
        ],
        message: '올바른 결제 상태를 선택해주세요.'
      },
      default: 'pending'
    },
    
    // 결제 일시
    paidAt: {
      type: Date,
      comment: '결제 완료 일시'
    },
    
    // 결제 트랜잭션 ID (PG사 제공)
    transactionId: {
      type: String,
      trim: true
    }
  },
  
  // 취소/환불 정보
  cancellation: {
    cancelledAt: {
      type: Date,
      comment: '취소 일시'
    },
    refundedAt: {
      type: Date,
      comment: '환불 완료 일시'
    },
    refundAmount: {
      type: Number,
      min: 0,
      comment: '환불 금액'
    }
  }
}, {
  timestamps: true
});

// 주문 번호 자동 생성 미들웨어
orderSchema.pre('save', async function(next) {
  try {
    if (this.isNew && !this.orderNumber) {
      const date = new Date();
      const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
      
      // 오늘 날짜의 마지막 주문 번호 찾기
      const lastOrder = await this.constructor
        .findOne({ orderNumber: new RegExp(`^ORD-${dateStr}`) })
        .sort({ createdAt: -1 })
        .limit(1);
      
      let sequence = 1;
      if (lastOrder && lastOrder.orderNumber) {
        const parts = lastOrder.orderNumber.split('-');
        if (parts.length === 3) {
          const lastSequence = parseInt(parts[2]);
          if (!isNaN(lastSequence)) {
            sequence = lastSequence + 1;
          }
        }
      }
      
      this.orderNumber = `ORD-${dateStr}-${String(sequence).padStart(3, '0')}`;
    }
    next();
  } catch (error) {
    console.error('주문번호 생성 오류:', error);
    next(error);
  }
});

// 인덱스 설정
orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'items.product': 1 });

// 가상 필드: 총 상품 개수
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// 인스턴스 메서드: 주문 상태 업데이트
orderSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  
  // 상태에 따른 자동 업데이트
  if (newStatus === 'shipping' && !this.shipping.shippedAt) {
    this.shipping.shippedAt = new Date();
  } else if (newStatus === 'delivered' && !this.shipping.deliveredAt) {
    this.shipping.deliveredAt = new Date();
  }
  
  return this.save();
};

// 인스턴스 메서드: 결제 완료 처리
orderSchema.methods.markAsPaid = function(transactionId) {
  this.payment.status = 'completed';
  this.payment.paidAt = new Date();
  this.payment.transactionId = transactionId;
  this.status = 'paid';
  
  return this.save();
};

// 인스턴스 메서드: 주문 취소
orderSchema.methods.cancelOrder = function() {
  this.status = 'cancelled';
  this.payment.status = 'cancelled';
  this.cancellation.cancelledAt = new Date();
  
  return this.save();
};

// 인스턴스 메서드: 환불 처리
orderSchema.methods.processRefund = function(amount) {
  this.status = 'refunded';
  this.payment.status = 'refunded';
  this.cancellation.refundedAt = new Date();
  this.cancellation.refundAmount = amount || this.payment.itemsTotal;
  
  return this.save();
};

// 정적 메서드: 사용자의 주문 내역 조회
orderSchema.statics.findByUser = function(userId, options = {}) {
  const query = this.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate('items.product', 'name price images');
  
  if (options.status) {
    query.where('status').equals(options.status);
  }
  
  if (options.limit) {
    query.limit(options.limit);
  }
  
  return query;
};

// 정적 메서드: 주문 번호로 조회
orderSchema.statics.findByOrderNumber = function(orderNumber) {
  return this.findOne({ orderNumber })
    .populate('user', 'name email')
    .populate('items.product', 'name price images');
};

// JSON 변환 시 가상 필드 포함
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Order', orderSchema);
