const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');

// 뉴스레터 구독
router.post('/subscribe', async (req, res) => {
  try {
    const { email, preferences = {} } = req.body;

    // 이메일 유효성 검사
    if (!email) {
      return res.status(400).json({
        success: false,
        message: '이메일 주소를 입력해주세요.'
      });
    }

    // 이메일 형식 검사
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: '올바른 이메일 형식이 아닙니다.'
      });
    }

    // 기존 구독자 확인
    const existingSubscriber = await Newsletter.findOne({ 
      email: email.toLowerCase() 
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return res.status(409).json({
          success: false,
          message: '이미 구독 중인 이메일 주소입니다.'
        });
      } else {
        // 비활성 구독자를 다시 활성화
        existingSubscriber.isActive = true;
        existingSubscriber.subscribedAt = new Date();
        existingSubscriber.unsubscribedAt = undefined;
        existingSubscriber.preferences = {
          ...existingSubscriber.preferences,
          ...preferences
        };
        await existingSubscriber.save();

        return res.status(200).json({
          success: true,
          message: '뉴스레터 구독이 완료되었습니다.',
          data: {
            email: existingSubscriber.email,
            subscribedAt: existingSubscriber.subscribedAt
          }
        });
      }
    }

    // 새로운 구독자 생성
    const newSubscriber = new Newsletter({
      email: email.toLowerCase(),
      preferences: {
        frequency: preferences.frequency || 'monthly',
        categories: preferences.categories || []
      }
    });

    await newSubscriber.save();

    res.status(201).json({
      success: true,
      message: '뉴스레터 구독이 완료되었습니다.',
      data: {
        email: newSubscriber.email,
        subscribedAt: newSubscriber.subscribedAt
      }
    });

  } catch (error) {
    console.error('뉴스레터 구독 오류:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: '이미 구독 중인 이메일 주소입니다.'
      });
    }

    res.status(500).json({
      success: false,
      message: '뉴스레터 구독 중 오류가 발생했습니다.'
    });
  }
});

// 뉴스레터 구독 해지
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: '이메일 주소를 입력해주세요.'
      });
    }

    const subscriber = await Newsletter.findOne({ 
      email: email.toLowerCase() 
    });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: '구독되지 않은 이메일 주소입니다.'
      });
    }

    if (!subscriber.isActive) {
      return res.status(409).json({
        success: false,
        message: '이미 구독 해지된 이메일 주소입니다.'
      });
    }

    subscriber.isActive = false;
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: '뉴스레터 구독이 해지되었습니다.',
      data: {
        email: subscriber.email,
        unsubscribedAt: subscriber.unsubscribedAt
      }
    });

  } catch (error) {
    console.error('뉴스레터 구독 해지 오류:', error);
    res.status(500).json({
      success: false,
      message: '뉴스레터 구독 해지 중 오류가 발생했습니다.'
    });
  }
});

// 구독 상태 확인
router.get('/status/:email', async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: '이메일 주소를 입력해주세요.'
      });
    }

    const subscriber = await Newsletter.findOne({ 
      email: email.toLowerCase() 
    });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: '구독되지 않은 이메일 주소입니다.',
        data: { isSubscribed: false }
      });
    }

    res.status(200).json({
      success: true,
      message: '구독 상태를 확인했습니다.',
      data: {
        email: subscriber.email,
        isSubscribed: subscriber.isActive,
        subscribedAt: subscriber.subscribedAt,
        unsubscribedAt: subscriber.unsubscribedAt,
        preferences: subscriber.preferences
      }
    });

  } catch (error) {
    console.error('구독 상태 확인 오류:', error);
    res.status(500).json({
      success: false,
      message: '구독 상태 확인 중 오류가 발생했습니다.'
    });
  }
});

// 구독자 목록 조회 (관리자용)
router.get('/subscribers', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status = 'all',
      search = '' 
    } = req.query;

    const query = {};
    
    // 상태 필터
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    // 검색 필터
    if (search) {
      query.email = { $regex: search, $options: 'i' };
    }

    const subscribers = await Newsletter.find(query)
      .sort({ subscribedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Newsletter.countDocuments(query);

    res.status(200).json({
      success: true,
      message: '구독자 목록을 조회했습니다.',
      data: {
        subscribers,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalSubscribers: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('구독자 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '구독자 목록 조회 중 오류가 발생했습니다.'
    });
  }
});

// 구독자 통계 (관리자용)
router.get('/stats', async (req, res) => {
  try {
    const totalSubscribers = await Newsletter.countDocuments();
    const activeSubscribers = await Newsletter.countDocuments({ isActive: true });
    const inactiveSubscribers = await Newsletter.countDocuments({ isActive: false });
    
    // 최근 30일 구독자 수
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentSubscribers = await Newsletter.countDocuments({
      subscribedAt: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      success: true,
      message: '구독자 통계를 조회했습니다.',
      data: {
        total: totalSubscribers,
        active: activeSubscribers,
        inactive: inactiveSubscribers,
        recent: recentSubscribers
      }
    });

  } catch (error) {
    console.error('구독자 통계 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '구독자 통계 조회 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;
