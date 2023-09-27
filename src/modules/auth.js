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
        return next(new AppError('No bearer', 401))
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