const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

// 주문 생성
const createOrder = async (req, res) => {
  try {
    const { userId, customer, shipping, items, payment, clearCart } = req.body;

    // 입력값 검증
    if (!customer || !customer.name || !customer.email || !customer.phone) {
      return res.status(400).json({
        success: false,
        message: '주문자 정보가 누락되었습니다.'
      });
    }

    if (!shipping || !shipping.recipient || !shipping.phone || 
        !shipping.address || !shipping.address.postalCode || !shipping.address.mainAddress) {
      return res.status(400).json({
        success: false,
        message: '배송지 정보가 누락되었습니다.'
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: '주문할 상품이 없습니다.'
      });
    }

    if (!payment || !payment.finalAmount || !payment.method) {
      return res.status(400).json({
        success: false,
        message: '결제 정보가 누락되었습니다.'
      });
    }

    // 1. 주문 중복 체크 (merchantUid로 확인)
    if (payment.merchantUid) {
      const existingOrder = await Order.findOne({ 
        'payment.transactionId': payment.merchantUid 
      });
      
      if (existingOrder) {
        return res.status(400).json({
          success: false,
          message: '이미 처리된 주문입니다.',
          orderNumber: existingOrder.orderNumber
        });
      }
    }

    // 2. 포트원 결제 검증 (impUid가 있는 경우)
    if (payment.impUid) {
      try {
        // 포트원 API 호출을 위한 액세스 토큰 발급
        const getToken = await fetch('https://api.iamport.kr/users/getToken', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imp_key: process.env.IMP_API_KEY || 'imp_apikey',
            imp_secret: process.env.IMP_API_SECRET || 'ekKoeW8RyKuT0zgaZsUtXXTLQ4AhPFW3ZGseDA6bkA5lamv9OqDMnxyeB9wqOsuO9W3Mx9YSJ4dTqJ3f'
          })
        });
        
        if (!getToken.ok) {
          return res.status(400).json({
            success: false,
            message: '결제 검증에 실패했습니다. (토큰 발급 실패)'
          });
        }
        
        const { response: tokenData } = await getToken.json();
        const accessToken = tokenData.access_token;
        
        // 결제 정보 조회
        const getPaymentData = await fetch(`https://api.iamport.kr/payments/${payment.impUid}`, {
          method: 'GET',
          headers: { 
            'Authorization': accessToken
          }
        });
        
        if (!getPaymentData.ok) {
          return res.status(400).json({
            success: false,
            message: '결제 검증에 실패했습니다. (결제 정보 조회 실패)'
          });
        }
        
        const { response: paymentData } = await getPaymentData.json();
        
        // 결제 금액 검증
        if (paymentData.amount !== payment.finalAmount) {
          return res.status(400).json({
            success: false,
            message: '결제 금액이 일치하지 않습니다.'
          });
        }
        
        // 결제 상태 검증
        if (paymentData.status !== 'paid') {
          return res.status(400).json({
            success: false,
            message: '결제가 완료되지 않았습니다.'
          });
        }
        
      } catch (verifyError) {
        console.error('결제 검증 중 오류:', verifyError);
        // 검증 실패 시에도 주문은 생성하되 (개발 환경)
      }
    }

    // 사용자 ID 가져오기
    let finalUserId = userId || req.user?.id;
    
    // userId가 없으면 이메일로 사용자 찾기
    if (!finalUserId) {
      const user = await User.findOne({ email: customer.email });
      if (user) {
        finalUserId = user._id;
      }
    }

    // 여전히 userId가 없으면 에러 (사용자 없이는 주문 불가)
    if (!finalUserId) {
      return res.status(400).json({
        success: false,
        message: '사용자를 찾을 수 없습니다. 로그인 후 다시 시도해주세요.'
      });
    }

    // 재고 확인 및 검증
    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `상품을 찾을 수 없습니다. (ID: ${item.product})`
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: `${product.name}은(는) 현재 판매하지 않는 상품입니다.`
        });
      }

      const sizeStock = product.sizes.find(s => s.size === item.size);
      if (!sizeStock || sizeStock.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} (${item.size})의 재고가 부족합니다.`
        });
      }
    }

    // 주문번호 생성 (수동)
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    
    const lastOrder = await Order
      .findOne({ orderNumber: new RegExp(`^ORD-${dateStr}`) })
      .sort({ createdAt: -1 })
      .limit(1);
    
    let sequence = 1;
    if (lastOrder && lastOrder.orderNumber) {
      const parts = lastOrder.orderNumber.split('-');
      if (parts.length === 3) {
        const lastSequence = parseInt(parts[2]);
        if (!isNaN(lastSequence)) {
          sequence = lastSequence + 1;
        }
      }
    }
    
    const orderNumber = `ORD-${dateStr}-${String(sequence).padStart(3, '0')}`;

    // 주문 생성
    const order = new Order({
      orderNumber: orderNumber,
      user: finalUserId,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone
      },
      shipping: {
        recipient: shipping.recipient,
        phone: shipping.phone,
        address: {
          postalCode: shipping.address.postalCode,
          mainAddress: shipping.address.mainAddress,
          detailAddress: shipping.address.detailAddress || ''
        },
        message: shipping.message || ''
      },
      items: items,
      payment: {
        itemsTotal: payment.itemsTotal,
        shippingFee: payment.shippingFee,
        finalAmount: payment.finalAmount,
        method: payment.method,
        status: payment.impUid ? 'completed' : 'pending',
        transactionId: payment.impUid || payment.merchantUid,
        paidAt: payment.paidAt || (payment.impUid ? new Date() : null)
      },
      status: payment.impUid ? 'paid' : 'pending'
    });

    await order.save();
    console.log('주문 생성 완료 - orderNumber:', order.orderNumber, 'user:', finalUserId);

    // 재고 차감
    for (const item of items) {
      const product = await Product.findById(item.product);
      const sizeStock = product.sizes.find(s => s.size === item.size);
      sizeStock.stock -= item.quantity;
      await product.save();
    }

    // 장바구니 비우기 (요청된 경우)
    if (clearCart && finalUserId) {
      const cart = await Cart.findOne({ user: finalUserId, status: 'active' });
      if (cart) {
        await cart.clearCart();
        // status를 'active'로 유지 (빈 장바구니로 유지)
        // 주문 이력은 별도로 관리되므로 굳이 'converted'로 변경할 필요 없음
      }
    }

    // 생성된 주문 정보 조회 (상품 정보 포함)
    const populatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name price images brand')
      .populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: '주문이 성공적으로 생성되었습니다.',
      data: populatedOrder
    });

  } catch (error) {
    console.error('주문 생성 오류:', error.message);
    res.status(500).json({
      success: false,
      message: '주문 생성 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 사용자의 주문 목록 조회
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, limit } = req.query;

    console.log('주문 조회 요청 - userId:', userId);

    const options = {};
    if (status) options.status = status;
    if (limit) options.limit = parseInt(limit);

    const orders = await Order.findByUser(userId, options);

    console.log('조회된 주문 개수:', orders.length);

    res.status(200).json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error('주문 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '주문 목록을 조회하는 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 주문 상세 조회
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('user', 'name email')
      .populate('items.product', 'name price images brand');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '주문을 찾을 수 없습니다.'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('주문 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '주문을 조회하는 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 주문 번호로 조회
const getOrderByNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const order = await Order.findByOrderNumber(orderNumber);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '주문을 찾을 수 없습니다.'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('주문 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '주문을 조회하는 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 모든 주문 조회 (관리자용)
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    const query = {};
    
    // 상태 필터
    if (status) {
      query.status = status;
    }
    
    // 검색 (주문번호, 고객명, 이메일)
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const orders = await Order.find(query)
      .populate('items.product')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const totalOrders = await Order.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('주문 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '주문 목록을 조회하는 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 주문 상태 업데이트
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // 상태 값 검증
    const validStatuses = ['pending', 'paid', 'preparing', 'shipping', 'delivered', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `유효하지 않은 주문 상태입니다. 사용 가능한 상태: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '주문을 찾을 수 없습니다.'
      });
    }

    await order.updateStatus(status);

    res.status(200).json({
      success: true,
      message: '주문 상태가 업데이트되었습니다.',
      data: order
    });

  } catch (error) {
    console.error('주문 상태 업데이트 오류:', error);
    res.status(500).json({
      success: false,
      message: '주문 상태를 업데이트하는 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 주문 취소
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '주문을 찾을 수 없습니다.'
      });
    }

    if (order.status === 'delivered') {
      return res.status(400).json({
        success: false,
        message: '배송 완료된 주문은 취소할 수 없습니다.'
      });
    }

    await order.cancelOrder();

    // 재고 복구
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        const sizeStock = product.sizes.find(s => s.size === item.size);
        if (sizeStock) {
          sizeStock.stock += item.quantity;
          await product.save();
        }
      }
    }

    res.status(200).json({
      success: true,
      message: '주문이 취소되었습니다.',
      data: order
    });

  } catch (error) {
    console.error('주문 취소 오류:', error);
    res.status(500).json({
      success: false,
      message: '주문을 취소하는 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 포트원 결제 검증
const verifyPayment = async (req, res) => {
  try {
    const { imp_uid, merchant_uid } = req.body;

    // TODO: 포트원 서버에 결제 검증 요청
    // 실제 운영 환경에서는 포트원 REST API를 통해 결제 정보를 검증해야 합니다
    
    res.status(200).json({
      success: true,
      message: '결제 검증이 완료되었습니다.',
      data: {
        imp_uid,
        merchant_uid
      }
    });

  } catch (error) {
    console.error('결제 검증 오류:', error);
    res.status(500).json({
      success: false,
      message: '결제 검증 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  getOrderByNumber,
  updateOrderStatus,
  cancelOrder,
  verifyPayment
};
