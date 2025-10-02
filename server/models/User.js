const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '이름은 필수입니다.'],
    trim: true,
    maxlength: [50, '이름은 50자를 초과할 수 없습니다.']
  },
  email: {
    type: String,
    required: [true, '이메일은 필수입니다.'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '올바른 이메일 형식이 아닙니다.']
  },
  password: {
    type: String,
    required: [true, '비밀번호는 필수입니다.'],
    minlength: [8, '비밀번호는 최소 8자 이상이어야 합니다.']
  },
  user_type: {
    type: String,
    required: [true, '사용자 유형은 필수입니다.'],
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  address: {
    type: String,
    trim: true,
    maxlength: [200, '주소는 200자를 초과할 수 없습니다.']
  }
}, {
  timestamps: true
});

// 인덱스 설정
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);
