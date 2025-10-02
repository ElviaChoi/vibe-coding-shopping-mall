const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  getCartCount,
  getCartStats
} = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/auth');

// 공개 라우트 (인증 불필요)

// 장바구니 아이템 개수 조회 (GET /api/carts/:userId/count)
router.get('/:userId/count', getCartCount);

// 사용자 장바구니 조회 (GET /api/carts/:userId)
router.get('/:userId', getCart);

// 장바구니에 상품 추가 (POST /api/carts/:userId)
router.post('/:userId', addToCart);

// 장바구니 상품 수량 업데이트 (PUT /api/carts/:userId)
router.put('/:userId', updateCartItem);

// 장바구니에서 상품 제거 (DELETE /api/carts/:userId)
router.delete('/:userId', removeFromCart);

// 장바구니 비우기 (DELETE /api/carts/:userId/clear)
router.delete('/:userId/clear', clearCart);

// 관리자 전용 라우트 (인증 필요)

// 장바구니 통계 조회 (GET /api/carts/stats) - 관리자용
router.get('/stats', authenticateToken, getCartStats);

module.exports = router;
