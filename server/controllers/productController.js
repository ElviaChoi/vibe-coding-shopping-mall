const Product = require('../models/Product');



// 모든 상품 조회
const getAllProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      mainCategory, 
      subCategory, 
      minPrice, 
      maxPrice,
      search,
      isActive,
      isFeatured
    } = req.query;
    
    // 필터 조건 생성
    const filter = {};
    
    if (mainCategory) {
      filter.mainCategory = mainCategory;
    }
    
    if (subCategory) {
      filter.subCategory = subCategory;
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    
    // isActive 필터는 명시적으로 전달된 경우에만 적용
    if (isActive !== undefined && isActive !== '') {
      filter.isActive = isActive === 'true';
    }
    // 기본값 제거: 어드민에서는 모든 상품을 보여줘야 함
    
    if (isFeatured !== undefined && isFeatured !== '') {
      filter.isFeatured = isFeatured === 'true';
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }

    // 페이지네이션 설정
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 }
    };
    
    // 상품 목록 조회
    const products = await Product.find(filter)
      .sort(options.sort)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit);

    // 전체 개수 조회
    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: options.page,
        totalPages: Math.ceil(total / options.limit),
        totalProducts: total,
        hasNext: options.page < Math.ceil(total / options.limit),
        hasPrev: options.page > 1
      }
    });
  } catch (error) {
    console.error('상품 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '상품 목록을 불러오는 중 오류가 발생했습니다.'
    });
  }
};

// 특정 상품 조회
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('상품 조회 오류:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: '유효하지 않은 상품 ID입니다.'
      });
    }

    res.status(500).json({
      success: false,
      message: '상품 정보를 불러오는 중 오류가 발생했습니다.'
    });
  }
};

// SKU로 상품 조회
const getProductBySku = async (req, res) => {
  try {
    const sku = req.params.sku.toUpperCase();
    const product = await Product.findOne({ sku });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '해당 SKU의 상품을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('SKU로 상품 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '상품 검색 중 오류가 발생했습니다.'
    });
  }
};

// 새 상품 생성
const createProduct = async (req, res) => {
  try {
    const {
      sku,
      name,
      description,
      price,
      mainCategory,
      subCategory,
      images,
      sizes,
      brand,
      tags,
      isFeatured
    } = req.body;

    // 필수 필드 검증
    if (!sku || !name || !price || !mainCategory || !subCategory) {
      return res.status(400).json({
        success: false,
        message: 'SKU, 상품명, 가격, 메인카테고리, 서브카테고리는 필수입니다.'
      });
    }

    // SKU 중복 검사
    const existingProduct = await Product.findOne({ sku: sku.toUpperCase() });
    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: '이미 존재하는 SKU입니다.'
      });
    }

    // 이미지 배열 검증 (최소 1개 필요)
    if (!images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: '최소 1개의 이미지가 필요합니다.'
      });
    }

    // 사이즈 배열 검증 (최소 1개 필요)
    if (!sizes || sizes.length === 0) {
      return res.status(400).json({
        success: false,
        message: '최소 1개의 사이즈 정보가 필요합니다.'
      });
    }

    // 새 상품 생성
    const newProduct = new Product({
      sku: sku.toUpperCase(),
      name,
      description,
      price,
      mainCategory,
      subCategory,
      images,
      sizes,
      brand: brand || undefined,
      tags: tags || undefined,
      isFeatured: isFeatured || false
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: '상품이 성공적으로 등록되었습니다.',
      data: savedProduct
    });
  } catch (error) {
    console.error('상품 생성 오류:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: '유효성 검사 실패',
        errors
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: '이미 존재하는 SKU입니다.'
      });
    }

    res.status(500).json({
      success: false,
      message: '상품 등록 중 오류가 발생했습니다.'
    });
  }
};

// 상품 정보 수정
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      mainCategory,
      subCategory,
      images,
      sizes,
      brand,
      tags,
      isActive,
      isFeatured
    } = req.body;
    
    // 업데이트할 필드만 포함
    const updateFields = {};
    if (name) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (price) updateFields.price = price;
    if (mainCategory) updateFields.mainCategory = mainCategory;
    if (subCategory) updateFields.subCategory = subCategory;
    if (images) updateFields.images = images;
    if (sizes) updateFields.sizes = sizes;
    if (brand !== undefined) updateFields.brand = brand;
    if (tags) updateFields.tags = tags;
    if (isActive !== undefined) updateFields.isActive = isActive;
    if (isFeatured !== undefined) updateFields.isFeatured = isFeatured;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      message: '상품 정보가 성공적으로 수정되었습니다.',
      data: updatedProduct
    });
  } catch (error) {
    console.error('상품 수정 오류:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: '유효하지 않은 상품 ID입니다.'
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
      message: '상품 정보 수정 중 오류가 발생했습니다.'
    });
  }
};

// 상품 삭제
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      message: '상품이 성공적으로 삭제되었습니다.',
      data: deletedProduct
    });
  } catch (error) {
    console.error('상품 삭제 오류:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: '유효하지 않은 상품 ID입니다.'
      });
    }

    res.status(500).json({
      success: false,
      message: '상품 삭제 중 오류가 발생했습니다.'
    });
  }
};

// 재고 업데이트
const updateStock = async (req, res) => {
  try {
    const { sizes } = req.body;
    
    if (!sizes || !Array.isArray(sizes)) {
      return res.status(400).json({
        success: false,
        message: '사이즈별 재고 정보가 필요합니다.'
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { sizes },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      message: '재고가 성공적으로 업데이트되었습니다.',
      data: updatedProduct
    });
  } catch (error) {
    console.error('재고 업데이트 오류:', error);
    res.status(500).json({
      success: false,
      message: '재고 업데이트 중 오류가 발생했습니다.'
    });
  }
};

// 카테고리별 상품 조회
const getProductsByCategory = async (req, res) => {
  try {
    const { mainCategory, subCategory } = req.params;
    const { page = 1, limit = 12 } = req.query;
    
    const filter = { mainCategory, isActive: true };
    if (subCategory && subCategory !== 'all') {
      filter.subCategory = subCategory;
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('카테고리별 상품 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '상품 목록을 불러오는 중 오류가 발생했습니다.'
    });
  }
};

// 대량 상품 삭제
const deleteMultipleProducts = async (req, res) => {
  try {
    const { productIds } = req.body;
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: '삭제할 상품 ID 배열이 필요합니다.'
      });
    }

    const result = await Product.deleteMany({ _id: { $in: productIds } });
    
    res.json({
      success: true,
      message: `${result.deletedCount}개의 상품이 성공적으로 삭제되었습니다.`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('대량 상품 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: '상품 삭제 중 오류가 발생했습니다.'
    });
  }
};

// 상품 복사 (새 SKU로 복사)
const duplicateProduct = async (req, res) => {
  try {
    const { newSku } = req.body;
    
    if (!newSku) {
      return res.status(400).json({
        success: false,
        message: '새 SKU가 필요합니다.'
      });
    }

    const originalProduct = await Product.findById(req.params.id);
    
    if (!originalProduct) {
      return res.status(404).json({
        success: false,
        message: '원본 상품을 찾을 수 없습니다.'
      });
    }

    // SKU 중복 검사
    const existingProduct = await Product.findOne({ sku: newSku.toUpperCase() });
    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: '이미 존재하는 SKU입니다.'
      });
    }

    // 상품 복사 (새 SKU로)
    const duplicatedProduct = new Product({
      ...originalProduct.toObject(),
      _id: undefined,
      sku: newSku.toUpperCase(),
      name: `${originalProduct.name} (복사본)`,
      createdAt: undefined,
      updatedAt: undefined
    });

    const savedProduct = await duplicatedProduct.save();

    res.status(201).json({
      success: true,
      message: '상품이 성공적으로 복사되었습니다.',
      data: savedProduct
    });
  } catch (error) {
    console.error('상품 복사 오류:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: '이미 존재하는 SKU입니다.'
      });
    }

    res.status(500).json({
      success: false,
      message: '상품 복사 중 오류가 발생했습니다.'
    });
  }
};

// 상품 통계 조회
const getProductStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          },
          inactiveProducts: {
            $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] }
          },
          featuredProducts: {
            $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] }
          },
          averagePrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    // 카테고리별 통계
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$mainCategory',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // 서브카테고리별 통계
    const subCategoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$subCategory',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalProducts: 0,
          activeProducts: 0,
          inactiveProducts: 0,
          featuredProducts: 0,
          averagePrice: 0,
          minPrice: 0,
          maxPrice: 0
        },
        categoryStats,
        subCategoryStats
      }
    });
  } catch (error) {
    console.error('상품 통계 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '상품 통계를 불러오는 중 오류가 발생했습니다.'
    });
  }
};

// 상품 검색 (고급 검색)
const searchProducts = async (req, res) => {
  try {
    const {
      query,
      mainCategory,
      subCategory,
      minPrice,
      maxPrice,
      brand,
      tags,
      isActive,
      isFeatured,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // 검색 조건 구성
    const searchConditions = [];

    // 텍스트 검색
    if (query) {
      searchConditions.push({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { sku: { $regex: query, $options: 'i' } },
          { brand: { $regex: query, $options: 'i' } }
        ]
      });
    }

    // 카테고리 필터
    if (mainCategory) {
      searchConditions.push({ mainCategory });
    }
    if (subCategory) {
      searchConditions.push({ subCategory });
    }

    // 가격 범위 필터
    if (minPrice || maxPrice) {
      const priceFilter = {};
      if (minPrice) priceFilter.$gte = parseInt(minPrice);
      if (maxPrice) priceFilter.$lte = parseInt(maxPrice);
      searchConditions.push({ price: priceFilter });
    }

    // 브랜드 필터
    if (brand) {
      searchConditions.push({ brand: { $regex: brand, $options: 'i' } });
    }

    // 태그 필터
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      searchConditions.push({ tags: { $in: tagArray } });
    }

    // 상태 필터
    if (isActive !== undefined) {
      searchConditions.push({ isActive: isActive === 'true' });
    }
    if (isFeatured !== undefined) {
      searchConditions.push({ isFeatured: isFeatured === 'true' });
    }

    // 최종 필터 조건
    const filter = searchConditions.length > 0 ? { $and: searchConditions } : {};

    // 정렬 설정
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // 페이지네이션
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 검색 실행
    const products = await Product.find(filter)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total,
        hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrev: parseInt(page) > 1
      },
      searchParams: {
        query,
        mainCategory,
        subCategory,
        minPrice,
        maxPrice,
        brand,
        tags,
        isActive,
        isFeatured,
        sortBy,
        sortOrder
      }
    });
  } catch (error) {
    console.error('상품 검색 오류:', error);
    res.status(500).json({
      success: false,
      message: '상품 검색 중 오류가 발생했습니다.'
    });
  }
};

module.exports = {
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
};
