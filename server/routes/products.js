const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  getProductBySku,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getProductsByCategory,
  deleteMultipleProducts,
  duplicateProduct,
  getProductStats,
  searchProducts
} = require('../controllers/productController');
const { authenticateToken } = require('../middleware/auth');

// 공개 라우트 (인증 불필요)

// 상품 통계 조회 (GET /api/products/stats)
router.get('/stats', getProductStats);

// 상품 고급 검색 (GET /api/products/search)
router.get('/search', searchProducts);

// 카테고리별 상품 조회 (GET /api/products/category/:mainCategory)
router.get('/category/:mainCategory', getProductsByCategory);

// 카테고리별 상품 조회 (GET /api/products/category/:mainCategory/:subCategory)
router.get('/category/:mainCategory/:subCategory', getProductsByCategory);

// SKU로 상품 조회 (GET /api/products/sku/:sku)
router.get('/sku/:sku', getProductBySku);

// 특정 상품 조회 (GET /api/products/:id)
router.get('/:id', getProductById);

// 모든 상품 조회 (GET /api/products)
router.get('/', getAllProducts);

// 관리자 전용 라우트 (인증 필요)

// 새 상품 생성 (POST /api/products)
router.post('/', authenticateToken, createProduct);

// 대량 상품 삭제 (DELETE /api/products/bulk)
router.delete('/bulk', authenticateToken, deleteMultipleProducts);

// 상품 복사 (POST /api/products/:id/duplicate)
router.post('/:id/duplicate', authenticateToken, duplicateProduct);

// 상품 정보 수정 (PUT /api/products/:id)
router.put('/:id', authenticateToken, updateProduct);

// 상품 삭제 (DELETE /api/products/:id)
router.delete('/:id', authenticateToken, deleteProduct);

// 재고 업데이트 (PUT /api/products/:id/stock)
router.put('/:id/stock', authenticateToken, updateStock);

module.exports = router;
