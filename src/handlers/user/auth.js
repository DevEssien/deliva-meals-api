const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const AppError = require('../error/error');
const { createUserJwt } = require('../../modules/auth');


exports.createUser = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ where: { email: email.toLowerCase() } });
        if (user) return next(new AppError('User already exist', 422));

        const newUser = new User({
            username: req.body?.username || '',
            email: email.toLowerCase(),
            password: await bcrypt.hash(password, Number(process.env.SALT_ROUND))
        });
        const savedUser = await newUser.save();
        if (!savedUser) return next(new AppError('Unable to save user', 500));

        return res.status(201).json({
            status: 'success',
            message: 'User sign up successful',
            data: { user: newUser, }
        })
    } catch (error) {
        next(error)
    }
}

exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email: email.toLowerCase()}});
        if (!user) return next(new AppError('User email do not exist', 404));

        const isPassword = await bcrypt.compare(password, user?.password);
        if (!isPassword) return next(new AppError('Incorrect Password', 401));

        const token = createUserJwt(user)

        return res.status(200).json({
            status: 'success',
            message: 'login successful!',
            data: { user, token }
        })

    } catch (error) {
        next(error)
    }
}