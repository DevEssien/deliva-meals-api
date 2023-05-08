const Admin = require('../models/admin');

exports.getAdmin = (req, res, next) => {
    return res.json({
        message: 'getting admins'
    });
}
