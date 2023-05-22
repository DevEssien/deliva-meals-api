const express = require('express');

const foodCategoryHandler = require('../handlers/admin/food-category');
const subFoodHandler = require('../handlers/admin/sub-food')

const router = express.Router();

/**
 * Main Category
 */

router.get('/category', foodCategoryHandler.getAdmin);

router.post('/add-category', foodCategoryHandler.createFoodCategory);

router.put('/update-category/:id', foodCategoryHandler.updateFoodCategory);

router.delete('/delete-category/:id', foodCategoryHandler.deleteFoodCategory)

/**
 * Sub Food
 */
router.get('/sub-food', subFoodHandler.getSubFood);

router.post('/sub-food/add-sub', subFoodHandler.createSubFood);

// router.put('/sub-food/update-sub/:id', subFoodHandler.updateFoodCategory);

// router.delete('/sub-food/delete-sub/:id', subFoodHandler.deleteFoodCategory)

module.exports = router;