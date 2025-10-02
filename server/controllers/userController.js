const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// 모든 유저 조회
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, user_type } = req.query;
    
    // 필터 조건 생성
    const filter = {};
    if (user_type) {
      filter.user_type = user_type;
    }

    // 페이지네이션 설정
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      select: '-password' // 비밀번호 제외
    };

    // 유저 목록 조회
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit);

    // 전체 개수 조회
    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: options.page,
        totalPages: Math.ceil(total / options.limit),
        totalUsers: total,
        hasNext: options.page < Math.ceil(total / options.limit),
        hasPrev: options.page > 1
      }
    });
  } catch (error) {
    console.error('유저 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '유저 목록을 불러오는 중 오류가 발생했습니다.'
    });
  }
};

// 특정 유저 조회
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '유저를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('유저 조회 오류:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: '유효하지 않은 유저 ID입니다.'
      });
    }

    res.status(500).json({
      success: false,
      message: '유저 정보를 불러오는 중 오류가 발생했습니다.'
    });
  }
};

// 새 유저 생성
const createUser = async (req, res) => {
  try {
    const { name, email, password, user_type, address } = req.body;

    // 필수 필드 검증
    if (!name || !email || !password || !user_type) {
      return res.status(400).json({
        success: false,
        message: '이름, 이메일, 비밀번호, 사용자 유형은 필수입니다.'
      });
    }

    // 이메일을 소문자로 변환
    const normalizedEmail = email.toLowerCase();

    // 이메일 중복 검사
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: '이미 존재하는 이메일입니다.'
      });
    }

    // 비밀번호 암호화
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 새 유저 생성
    const newUser = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      user_type,
      address
    });

    const savedUser = await newUser.save();

    // 비밀번호 제외하고 응답
    const userResponse = await User.findById(savedUser._id).select('-password');

    res.status(201).json({
      success: true,
      message: '유저가 성공적으로 생성되었습니다.',
      data: userResponse
    });
  } catch (error) {
    console.error('유저 생성 오류:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: '유효성 검사 실패',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: '유저 생성 중 오류가 발생했습니다.'
    });
  }
};

// 유저 정보 수정
const updateUser = async (req, res) => {
  try {
    const { name, email, password, user_type, address } = req.body;
    
    // 업데이트할 필드만 포함
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) {
      // 이메일을 소문자로 변환
      updateFields.email = email.toLowerCase();
    }
    if (password) {
      // 비밀번호 암호화
      const saltRounds = 10;
      updateFields.password = await bcrypt.hash(password, saltRounds);
    }
    if (user_type) updateFields.user_type = user_type;
    if (address !== undefined) updateFields.address = address;

    // 이메일 변경 시 중복 검사
    if (email) {
      const normalizedEmail = email.toLowerCase();
      const existingUser = await User.findOne({ 
        email: normalizedEmail, 
        _id: { $ne: req.params.id } 
      });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: '이미 존재하는 이메일입니다.'
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: '유저를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      message: '유저 정보가 성공적으로 수정되었습니다.',
      data: updatedUser
    });
  } catch (error) {
    console.error('유저 수정 오류:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: '유효하지 않은 유저 ID입니다.'
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: '유효성 검사 실패',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: '유저 정보 수정 중 오류가 발생했습니다.'
    });
  }
};

// 유저 삭제
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id).select('-password');

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: '유저를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      message: '유저가 성공적으로 삭제되었습니다.',
      data: deletedUser
    });
  } catch (error) {
    console.error('유저 삭제 오류:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: '유효하지 않은 유저 ID입니다.'
      });
    }

    res.status(500).json({
      success: false,
      message: '유저 삭제 중 오류가 발생했습니다.'
    });
  }
};

// 이메일로 유저 검색
const getUserByEmail = async (req, res) => {
  try {
    // 이메일을 소문자로 변환
    const normalizedEmail = req.params.email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '해당 이메일의 유저를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('유저 이메일 검색 오류:', error);
    res.status(500).json({
      success: false,
      message: '유저 검색 중 오류가 발생했습니다.'
    });
  }
};

// 유저 로그인
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 필수 필드 검증
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '이메일과 비밀번호는 필수입니다.'
      });
    }

    // 이메일을 소문자로 변환
    const normalizedEmail = email.toLowerCase();

    // 이메일로 유저 찾기 (비밀번호 포함)
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.'
      });
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.'
      });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        user_type: user.user_type 
      },
      config.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 비밀번호 제외하고 유저 정보 반환
    const userResponse = await User.findById(user._id).select('-password');

    res.json({
      success: true,
      message: '로그인이 성공했습니다.',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({
      success: false,
      message: '로그인 중 오류가 발생했습니다.'
    });
  }
};

// 토큰으로 현재 유저 정보 조회
const getCurrentUser = async (req, res) => {
  try {
    // 미들웨어에서 이미 검증된 사용자 정보 사용
    const user = req.user;

    res.json({
      success: true,
      message: '사용자 정보를 성공적으로 조회했습니다.',
      data: user
    });
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '사용자 정보를 불러오는 중 오류가 발생했습니다.'
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  loginUser,
  getCurrentUser
};
