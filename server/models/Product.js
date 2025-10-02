const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // SKU (고유 식별자)
  sku: {
    type: String,
    required: [true, 'SKU는 필수입니다.'],
    unique: true,
    trim: true,
    uppercase: true,
    match: [/^[A-Z0-9-]+$/, 'SKU는 영문 대문자, 숫자, 하이픈만 사용할 수 있습니다.']
  },
  
  // 상품명
  name: {
    type: String,
    required: [true, '상품명은 필수입니다.'],
    trim: true,
    maxlength: [100, '상품명은 100자를 초과할 수 없습니다.']
  },
  
  // 상품 설명 (선택사항)
  description: {
    type: String,
    trim: true,
    maxlength: [1000, '상품 설명은 1000자를 초과할 수 없습니다.']
  },
  
  // 가격
  price: {
    type: Number,
    required: [true, '가격은 필수입니다.'],
    min: [0, '가격은 0 이상이어야 합니다.']
  },
  
  // 메인 카테고리 (성별/타입 기반)
  mainCategory: {
    type: String,
    required: [true, '메인 카테고리는 필수입니다.'],
    enum: {
      values: ['women', 'men', 'accessories'],
      message: '메인 카테고리는 women, men, accessories 중 하나여야 합니다.'
    }
  },
  
  // 서브 카테고리 (상품 타입)
  subCategory: {
    type: String,
    required: [true, '서브 카테고리는 필수입니다.'],
    enum: {
      values: [
        // 의류 관련
        'top', 'bottom', 'dress', 'outer',
        // 악세사리 관련
        'bag', 'shoes', 'jewelry', 'hat', 'belt', 'watch',
        // 기타
        'other'
      ],
      message: '올바른 서브 카테고리를 선택해주세요.'
    }
  },
  
  // 이미지 배열
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  
  // 사이즈별 재고 정보
  sizes: [{
    size: {
      type: String,
      required: true
    },
    stock: {
      type: Number,
      required: true,
      min: [0, '재고는 0 이상이어야 합니다.']
    }
  }],
  
  // 브랜드
  brand: {
    type: String,
    trim: true,
    maxlength: [50, '브랜드명은 50자를 초과할 수 없습니다.']
  },
  
  // 상품 태그
  tags: [{
    type: String,
    trim: true
  }],
  
  // 상품 상태
  isActive: {
    type: Boolean,
    default: true
  },
  
  isFeatured: {
    type: Boolean,
    default: false,
    comment: '추천 상품으로 표시할지 여부'
  },
  
  // 평점 및 리뷰
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// 미들웨어: SKU 자동 대문자 변환
productSchema.pre('save', function(next) {
  if (this.sku) {
    this.sku = this.sku.toUpperCase();
  }
  next();
});

// 인덱스 설정
productSchema.index({ sku: 1 }, { unique: true });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ mainCategory: 1, subCategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });

module.exports = mongoose.model('Product', productSchema);
