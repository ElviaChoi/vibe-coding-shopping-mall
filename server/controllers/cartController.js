const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

// 사용자의 장바구니 조회
const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // 사용자 존재 확인
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    }

    // 장바구니 조회 (상품 정보 포함)
    const cart = await Cart.findOne({ user: userId, status: 'active' })
      .populate('items.product', 'name price images brand mainCategory subCategory sizes')
      .sort({ updatedAt: -1 });

    if (!cart) {
      // 빈 장바구니 반환
      return res.status(200).json({
        success: true,
        data: {
          _id: null,
          user: userId,
          items: [],
          totalItems: 0,
          totalAmount: 0
        }
      });
    }

    // 총 금액 계산
    const totalAmount = await cart.calculateTotal();

    res.status(200).json({
      success: true,
      data: {
        ...cart.toObject(),
        totalAmount
      }
    });

  } catch (error) {
    console.error('장바구니 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '장바구니 조회 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 장바구니에 상품 추가
const addToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, size, quantity = 1 } = req.body;

    // 입력값 검증
    if (!productId || !size) {
      return res.status(400).json({
        success: false,
        message: '상품 ID와 사이즈는 필수입니다.'
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: '수량은 1 이상이어야 합니다.'
      });
    }

    // 사용자 존재 확인
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    }

    // 상품 존재 확인
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.'
      });
    }

    // 상품 활성 상태 확인
    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        message: '현재 판매하지 않는 상품입니다.'
      });
    }

    // 사이즈 재고 확인
    const sizeStock = product.sizes.find(s => s.size === size);
    if (!sizeStock) {
      return res.status(400).json({
        success: false,
        message: '해당 사이즈는 판매하지 않습니다.'
      });
    }

    if (sizeStock.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `재고가 부족합니다. (현재 재고: ${sizeStock.stock}개)`
      });
    }

    // 장바구니 찾기 또는 생성
    let cart = await Cart.findOne({ user: userId, status: 'active' });
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
        status: 'active'
      });
    }

    // 장바구니에 상품 추가
    await cart.addItem(productId, size, quantity);

    // 업데이트된 장바구니 조회
    await cart.populate('items.product', 'name price images brand mainCategory subCategory sizes');
    const totalAmount = await cart.calculateTotal();

    res.status(200).json({
      success: true,
      message: '상품이 장바구니에 추가되었습니다.',
      data: {
        ...cart.toObject(),
        totalAmount
      }
    });

  } catch (error) {
    console.error('장바구니 추가 오류:', error);
    res.status(500).json({
      success: false,
      message: '장바구니에 상품을 추가하는 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 장바구니에서 상품 제거
const removeFromCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, size } = req.body;

    // 입력값 검증
    if (!productId || !size) {
      return res.status(400).json({
        success: false,
        message: '상품 ID와 사이즈는 필수입니다.'
      });
    }

    // 장바구니 조회
    const cart = await Cart.findOne({ user: userId, status: 'active' });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: '장바구니를 찾을 수 없습니다.'
      });
    }

    // 상품 제거
    await cart.removeItem(productId, size);

    // 업데이트된 장바구니 조회
    await cart.populate('items.product', 'name price images brand mainCategory subCategory sizes');
    const totalAmount = await cart.calculateTotal();

    res.status(200).json({
      success: true,
      message: '상품이 장바구니에서 제거되었습니다.',
      data: {
        ...cart.toObject(),
        totalAmount
      }
    });

  } catch (error) {
    console.error('장바구니 제거 오류:', error);
    res.status(500).json({
      success: false,
      message: '장바구니에서 상품을 제거하는 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 장바구니 상품 수량 업데이트
const updateCartItem = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, size, quantity } = req.body;

    // 입력값 검증
    if (!productId || !size || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: '상품 ID, 사이즈, 수량은 필수입니다.'
      });
    }

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: '수량은 0 이상이어야 합니다.'
      });
    }

    // 장바구니 조회
    const cart = await Cart.findOne({ user: userId, status: 'active' });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: '장바구니를 찾을 수 없습니다.'
      });
    }

    // 수량이 0이면 제거
    if (quantity === 0) {
      await cart.removeItem(productId, size);
    } else {
      // 상품 재고 확인
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: '상품을 찾을 수 없습니다.'
        });
      }

      const sizeStock = product.sizes.find(s => s.size === size);
      if (!sizeStock || sizeStock.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `재고가 부족합니다. (현재 재고: ${sizeStock?.stock || 0}개)`
        });
      }

      // 수량 업데이트
      await cart.updateQuantity(productId, size, quantity);
    }

    // 업데이트된 장바구니 조회
    await cart.populate('items.product', 'name price images brand mainCategory subCategory sizes');
    const totalAmount = await cart.calculateTotal();

    res.status(200).json({
      success: true,
      message: '장바구니가 업데이트되었습니다.',
      data: {
        ...cart.toObject(),
        totalAmount
      }
    });

  } catch (error) {
    console.error('장바구니 업데이트 오류:', error);
    res.status(500).json({
      success: false,
      message: '장바구니를 업데이트하는 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 장바구니 비우기
const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    // 장바구니 조회
    const cart = await Cart.findOne({ user: userId, status: 'active' });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: '장바구니를 찾을 수 없습니다.'
      });
    }

    // 장바구니 비우기
    await cart.clearCart();

    res.status(200).json({
      success: true,
      message: '장바구니가 비워졌습니다.',
      data: {
        ...cart.toObject(),
        totalAmount: 0
      }
    });

  } catch (error) {
    console.error('장바구니 비우기 오류:', error);
    res.status(500).json({
      success: false,
      message: '장바구니를 비우는 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 장바구니 아이템 개수 조회 (간단한 정보)
const getCartCount = async (req, res) => {
  try {
    const { userId } = req.params;

    // userId 유효성 검사
    if (!userId || userId === 'undefined' || userId === 'null') {
      return res.status(400).json({
        success: false,
        message: '유효한 사용자 ID가 필요합니다.'
      });
    }

    const cart = await Cart.findOne({ user: userId, status: 'active' });
    
    const totalItems = cart ? cart.totalItems : 0;

    res.status(200).json({
      success: true,
      data: {
        totalItems
      }
    });

  } catch (error) {
    console.error('장바구니 개수 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '장바구니 개수를 조회하는 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 장바구니 통계 조회 (관리자용)
const getCartStats = async (req, res) => {
  try {
    const stats = await Cart.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalItems: { $sum: { $size: '$items' } }
        }
      }
    ]);

    const totalCarts = await Cart.countDocuments();
    const activeCarts = await Cart.countDocuments({ status: 'active' });

    res.status(200).json({
      success: true,
      data: {
        totalCarts,
        activeCarts,
        statusBreakdown: stats
      }
    });

  } catch (error) {
    console.error('장바구니 통계 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '장바구니 통계를 조회하는 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  getCartCount,
  getCartStats
};
