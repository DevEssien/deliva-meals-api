const express = require('express');

const adminHandler = require('../handlers/admin')

const router = express.Router();

router.get('/', adminHandler.getAdmin);

router.post('/add-category', adminHandler.createFoodCategory);

router.put('/update-category/:id', adminHandler.updateFoodCategory);

router.delete('/delete-category/:id', adminHandler.deleteFoodCategory)

module.exports = router;