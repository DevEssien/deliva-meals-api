const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const adminRoute = require('./routes/admin');
const { protect } = require('./modules/auth')
const { createAdmin, loginAdmin } = require('./handlers/auth')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use('/admin/signup', createAdmin);
app.use('/admin/signin', loginAdmin);

app.use('/api', protect, adminRoute);

app.use((error, req, res, next) => {
    console.log('error ', error);
    const code = error.statusCode || 500;
    const message = error.message || 'Server side error';
    const data = error.data || null;
    return res.status(code).json({
        message,
        code,
        data
    })
})

mongoose.connect('mongodb://127.0.0.1:27017/mealsDB');

app.listen(8080, () => {
    console.log('server spinning at port 8080');
});