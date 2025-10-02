const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  loginUser,
  getCurrentUser
} = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// 모든 유저 조회 (GET /api/users)
router.get('/', getAllUsers);

// 현재 유저 정보 조회 (GET /api/users/profile) - 토큰 인증 필요
router.get('/profile', authenticateToken, getCurrentUser);

// 이메일로 유저 검색 (GET /api/users/search/email/:email)
router.get('/search/email/:email', getUserByEmail);

// 특정 유저 조회 (GET /api/users/:id) - 이 라우트는 마지막에 위치해야 함
router.get('/:id', getUserById);

// 새 유저 생성 (POST /api/users)
router.post('/', createUser);

// 유저 로그인 (POST /api/users/login)
router.post('/login', loginUser);

// 유저 정보 수정 (PUT /api/users/:id)
router.put('/:id', updateUser);

// 유저 삭제 (DELETE /api/users/:id)
router.delete('/:id', deleteUser);

module.exports = router;
