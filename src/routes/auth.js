const express = require('express');

const adminRoute = require('./admin');
const userRoute = require('./user');
const { protect, protectUser } = require('../modules/auth');
const { createUser, loginUser } = require('../handlers/user/auth');
const { createAdmin, loginAdmin, } = require('../handlers/admin/auth');

const router = express.Router()

router.post('/admin/signup', createAdmin);

router.post('/admin/signin', loginAdmin);

router.post('/user/signup', createUser);

router.post('/user/signin', loginUser);

router.use('/admin', protect, adminRoute);

router.use('/user', protectUser, userRoute)

module.exports = router;