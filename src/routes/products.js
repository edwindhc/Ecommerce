const { Router } = require('express');
const controller = require('../controllers/product.controller');
const { createProduct, updateProduct } = require('../utils/validations/product');
const router = Router();
/**
 * Load product when API with productId route parameter is hit
 */
router.param('productId', controller.load);

router
  .route('/')

  .get(controller.list)

  .post(controller.create);

router
  .route('/pdf')

  .post(controller.pdf);

router
  .route('/:productId')
  .get(controller.get)
  .patch(controller.update)
  .delete(controller.delete);
module.exports = router;