module.exports = {
  // 서버 설정
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // MongoDB 설정
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/shopping-mall',
  
  // JWT 설정 (나중에 인증 기능 추가시 사용)
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
  
  // CORS 설정
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173'
};
