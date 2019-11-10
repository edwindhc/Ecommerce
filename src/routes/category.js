const { Router } = require('express');
const controller = require('../controllers/category.controller');
const router = Router();

/**
 * Load product when API with productId route parameter is hit
 */
router.param('categoryId', controller.load);

router
  .route('/')

  .get(controller.list)

  .post(controller.create);

router
  .route('/:categoryId')
  .get(controller.get)
  .patch(controller.update)
  .delete(controller.delete);

module.exports = router;