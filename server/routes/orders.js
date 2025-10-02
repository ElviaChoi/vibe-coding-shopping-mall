const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  getOrderByNumber,
  updateOrderStatus,
  cancelOrder,
  verifyPayment
} = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');

// 공개 라우트 (인증 불필요)

// 주문 생성 (POST /api/orders)
router.post('/', createOrder);

// 결제 검증 (POST /api/orders/verify-payment)
router.post('/verify-payment', verifyPayment);

// 모든 주문 조회 - 관리자용 (GET /api/orders)
router.get('/', getAllOrders);

// 주문 번호로 조회 (GET /api/orders/number/:orderNumber)
router.get('/number/:orderNumber', getOrderByNumber);

// 사용자의 주문 목록 조회 (GET /api/orders/user/:userId)
router.get('/user/:userId', getUserOrders);

// 주문 상세 조회 (GET /api/orders/:orderId)
router.get('/:orderId', getOrderById);

// 주문 상태 업데이트 (PUT /api/orders/:orderId/status)
router.put('/:orderId/status', updateOrderStatus);

// 주문 취소 (PUT /api/orders/:orderId/cancel)
router.put('/:orderId/cancel', cancelOrder);

module.exports = router;
