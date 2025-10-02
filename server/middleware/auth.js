const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

// JWT 토큰 검증 미들웨어
const authenticateToken = async (req, res, next) => {
  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN 형식

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '액세스 토큰이 필요합니다.'
      });
    }

    // 토큰 검증
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // 토큰에서 사용자 ID 추출
    const userId = decoded.userId;
    
    // 사용자 존재 여부 확인
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '유효하지 않은 토큰입니다.'
      });
    }

    // 요청 객체에 사용자 정보 추가
    req.user = user;
    req.userId = userId;
    
    next();
  } catch (error) {
    console.error('토큰 검증 오류:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '유효하지 않은 토큰입니다.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: '토큰이 만료되었습니다.'
      });
    }

    res.status(500).json({
      success: false,
      message: '토큰 검증 중 오류가 발생했습니다.'
    });
  }
};

module.exports = {
  authenticateToken
};
