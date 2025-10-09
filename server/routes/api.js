const express = require('express');
const router = express.Router();
const userRoutes = require('./users');
const productRoutes = require('./products');
const cartRoutes = require('./carts');
const orderRoutes = require('./orders');
const newsletterRoutes = require('./newsletters');

router.get('/status', (req, res) => {
  res.json({
    success: true,
    message: 'API가 정상적으로 작동 중입니다.',
    timestamp: new Date().toISOString()
  });
});

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/carts', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/newsletters', newsletterRoutes);

module.exports = router;
