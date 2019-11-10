const express = require('express');
const productsRoutes = require('./products')
const categoryRoutes = require('./category')
const router = express.Router();

router.use('/products', productsRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;