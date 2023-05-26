const express = require('express');

const foodCategoryHandler = require('../handlers/admin/food-category');
const subFoodHandler = require('../handlers/admin/sub-food')

const upload = require('../utils/upload');

const router = express.Router();

/**
 * Main Category
 */

router.get('/category', foodCategoryHandler.getAdmin);

router.post('/category/add-category', foodCategoryHandler.createFoodCategory);

router.post('/category/add-image/:categoryId', upload.single('image'), foodCategoryHandler.addFoodCategoryImage);

router.put('/category/update-category/:id', foodCategoryHandler.updateFoodCategory);

router.delete('/category/delete-category/:id', foodCategoryHandler.deleteFoodCategory)


/**
 * Sub Food
 */
router.get('/sub-food', subFoodHandler.getSubFood);

router.post('/sub-food/add-sub', subFoodHandler.createSubFood);

router.post('/sub-food/add-image/:id', upload.single('image'), subFoodHandler.addSubFoodImage);

// router.put('/sub-food/update-sub/:id', subFoodHandler.updateFoodCategory);

// router.delete('/sub-food/delete-sub/:id', subFoodHandler.deleteFoodCategory)

module.exports = router;