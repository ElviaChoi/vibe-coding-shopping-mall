const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, '이메일은 필수입니다.'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '올바른 이메일 형식이 아닙니다.']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: {
    type: Date
  },
  source: {
    type: String,
    enum: ['website', 'admin', 'api'],
    default: 'website'
  },
  preferences: {
    frequency: {
      type: String,
      enum: ['weekly', 'monthly', 'promotions'],
      default: 'monthly'
    },
    categories: [{
      type: String,
      enum: ['women', 'men', 'accessories', 'sales', 'new-arrivals']
    }]
  }
}, {
  timestamps: true
});

// 인덱스 설정
newsletterSchema.index({ email: 1 });
newsletterSchema.index({ isActive: 1 });
newsletterSchema.index({ subscribedAt: -1 });

module.exports = mongoose.model('Newsletter', newsletterSchema);
