const express = require('express');

const adminHandler = require('../handlers/admin/food-category')

const router = express.Router();

/**
 * Main Category
 */

router.get('/category', adminHandler.getAdmin);

router.post('/add-category', adminHandler.createFoodCategory);

router.put('/update-category/:id', adminHandler.updateFoodCategory);

router.delete('/delete-category/:id', adminHandler.deleteFoodCategory)

/**
 * Sub Food
 */
router.get('/sub-food', adminHandler.getAdmin);

router.post('/subfood/add-sub', adminHandler.createFoodCategory);

router.put('/sub-food/update-sub/:id', adminHandler.updateFoodCategory);

router.delete('/sub-food/delete-sub/:id', adminHandler.deleteFoodCategory)

module.exports = router;