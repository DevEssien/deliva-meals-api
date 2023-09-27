const express = require('express');

const foodCategoryHandler = require('../handlers/admin/food-category');
const subFoodHandler = require('../handlers/admin/sub-food')

const upload = require('../utils/upload');

const router = express.Router();

/**
 * Main Category
 */

router.get('/category', foodCategoryHandler.getFoodCategory);

router.post('/category/add', foodCategoryHandler.createFoodCategory);

router.patch('/category/add-image/:categoryId', upload.single('image'), foodCategoryHandler.addFoodCategoryImage);

router.put('/category/update/:categoryId', foodCategoryHandler.updateFoodCategory);

router.delete('/category/delete/:categoryId', foodCategoryHandler.deleteFoodCategory)

router.delete('/category/delete-image/:categoryId', foodCategoryHandler.delFoodCategoryImage)


/**
 * Sub Food
 */
router.get('/sub-food', subFoodHandler.getSubFood);

router.post('/sub-food/add', subFoodHandler.createSubFood);

router.patch('/sub-food/add-image/:id', upload.single('image'), subFoodHandler.addSubFoodImage);

router.delete('/sub-food/delete-image/:publicId', subFoodHandler.deleteSubFoodImage)

router.put('/sub-food/update/:id', subFoodHandler.updateSubFood);

// router.delete('/sub-food/delete-sub/:id', subFoodHandler.deleteFoodCategory)

module.exports = router;