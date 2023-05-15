const express = require('express');

const adminHandler = require('../handlers/admin')

const router = express.Router();

router.get('/', adminHandler.getAdmin);

router.post('/add-category', adminHandler.createFoodCategory);

module.exports = router;