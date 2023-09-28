const express = require('express');

const foodCategoryHandler = require('../handlers/admin/food-category');
const subFoodHandler = require('../handlers/admin/sub-food')

const router = express.Router();

router.get('/category', foodCategoryHandler.getFoodCategory);

router.get('/sub-food', subFoodHandler.getSubFood);

router.get('/sub-by-category/:categoryId', subFoodHandler.getSubByFoodCategory)

module.exports = router;