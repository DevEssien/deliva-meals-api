const jwt = require('jsonwebtoken');
const AppError = require('../handlers/error/error');

exports.createJWT = (admin) => {
    const token = jwt.sign({
        id: admin?.id,
        email: admin?.email.toLowerCase()
    }, process.env.ADMIN_TOKEN_SECRET);
    return token
}

exports.protect = (req, res, next) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        req.isAuth = false;
        return next(new AppError('No bearer', 401))
    }
    const [, token] = bearer.split(' ');
    if (!token) {
        req.isAuth = false;
        return next(new AppError('No token', 401))
    }
    try {
        const admin = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET);
        req.admin = admin;
        req.isAuth = true;
        next();
    } catch(error) {
        next(error);
    }
}

exports.createUserJwt = (user) => {
    try {
        const token = jwt.sign({
            id: user?.id,
            email: user?.email.toLowerCase(),
        }, process.env.USER_TOKEN_SECRET);
        return token
    } catch (error) {
        next(error)
    }
}

exports.protectUser = async (req, res, next) => {
    try {
        const bearer = req.headers.authorization;
        if (!bearer) {
            req.isAuth = false;
            return next(new AppError('No bearer', 401));
        }
        const [, token] = bearer.split(' ');
        if (!token) {
            req.isAuth = false;
            return next(new AppError('No token', 401));
        }
        const user = jwt.verify(token, process.env.USER_TOKEN_SECRET);
        req.user = user;
        req.isAuth = true;
        next()
    } catch (error) {
        next(error)
    }
}