const bcrypt = require('bcryptjs');

const  { createJWT } = require('../modules/auth') 
const Admin = require('../models/admin');

exports.createAdmin = async (req, res, next) => {
    try {
        const admin = await Admin.findOne({ username: req.body.username});
        if (admin) {
            return res.status(422).json({
                message: 'Admin already exist'
            });
        }
        const newAdmin = new Admin({
            username: req.body.username,
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
            status: 'Successful',
            message: 'Admin created',
            data: {
                newAdmin,
                token
            }
        })
    } catch(error) {
        console.log(error);
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.loginAdmin = async (req, res, next) => {
    try {
        const admin = await Admin.findOne({ username: req.body.username});
        if (!admin) {
            const error = new Error('No admin found!');
            error.statusCode = 404;
            error.message = 'No admin found!';
            throw error; 
        }
        try {
            const matchedPassword = await bcrypt.compare(req.body.password, admin?.password);
            if (!matchedPassword) {
                const error = new Error('Incorrect Password!');
                error.statusCode = 422;
                error.message = 'Incorrect Password!';
                throw error; 
            }
            return res.status(200).json({
                status: 'Successful',
                message: 'Admin Logged in',
                admin
            });
        } catch(error) {
            console.log(error);
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
        }
    } catch(error) {
        console.log(error);
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}