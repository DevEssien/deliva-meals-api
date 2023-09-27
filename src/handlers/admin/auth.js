const bcrypt = require('bcryptjs');

const  { createJWT } = require('../../modules/auth');
const Admin = require('../../models/admin');
const AppError = require('../error/error');

exports.createAdmin = async (req, res, next) => {
    try {
        const admin = await Admin.findOne({ where: { email: req.body?.email.toLowerCase()}});
        if (admin) {
            return res.status(200).json({
                status: 'success',
                message: 'Admin already exist'
            });
        }
        const newAdmin = new Admin({
            email: req.body.email.toLowerCase(),
            password: await bcrypt.hash(req.body.password, 12)
        });
        const savedAdmin = await newAdmin.save();
        if (!savedAdmin) {
            return res.status(500).json({
                message: 'Unable to save user'
            });
        }
        const token = createJWT(newAdmin);
        return res.status(201).json({
            status: 'success',
            message: 'Admin created',
            data: {
                newAdmin,
                token
            }
        })
    } catch(error) {
        next(error);
    }
}

exports.loginAdmin = async (req, res, next) => {
    try {
        const admin = await Admin.findOne({ where:  {email: req.body.email.toLowerCase()}});
        if (!admin) return next(new AppError('No admin found!', 404))
      
        try {
            const matchedPassword = await bcrypt.compare(req.body?.password, admin?.password);
            if (!matchedPassword) return next(new AppError('Incorrect Password!', 401));
    
            const token = createJWT(admin);
            return res.status(200).json({
                status: 'succes',
                message: 'Admin Logged in',
                data: {
                    admin,
                    token
                }
            });
        } catch(error) {
            next(error);
        }
    } catch(error) {
        next(error);
    }
}