const express = require('express');

const adminHandler = require('../handlers/admin')

const router = express.Router();

router.get('/', adminHandler.getAdmin);

module.exports = router;