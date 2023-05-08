const jwt = require('jsonwebtoken');

exports.createJWT = (admin) => {
    const token = jwt.sign({
        id: admin.id,
        username: admin.username
    }, 'this3isMy083Secrett');
    return token
}

exports.protect = (req, res, next) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        req.isAuth = false;
        const error = new Error('No bearer');
        error.statusCode = 401;
        error.message = 'No bearer';
        throw error;
    }
    const [, token] = bearer.split(' ');
    if (!token) {
        req.isAuth = false;
        const error = new Error('No token');
        error.statusCode = 401;
        error.message = 'No token';
        throw error;
    }
    try {
        const admin = jwt.verify(token, 'this3isMy083Secrett');
        req.admin = admin;
        req.isAuth = true;
        next();
    } catch(error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}