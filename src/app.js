const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path')

const Admin = require('./models/Admin');
const FoodCategory = require('./models/Food-Category');
const SubFood = require('./models/Sub-Food');
const User = require('./models/User');
const adminRoute = require('./routes/admin');
const { protect, protectUser } = require('./modules/auth');
const { createUser, loginUser } = require('./handlers/user/auth');
const { createAdmin, loginAdmin, } = require('./handlers/admin/auth');
const { subscribe } = require('./routes/admin');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


app.use('/images', express.static(path.join(__dirname, 'images')));

app.post('/admin/signup', createAdmin);
app.post('/admin/signin', loginAdmin);
app.post('/user/signup', createUser);
app.post('/user/signin', loginUser);

app.use('/api', protect, adminRoute);

app.use((error, req, res, next) => {
    const code = error.code || 500;
    const status = error.status || 'error'
    const message = error.message || 'Server side error';
    const data = error.data || null;
    return res.status(200).json({
        status,
        code,
        message,
        data
    });
})

FoodCategory.hasMany(SubFood);

SubFood.belongsTo(FoodCategory, {
    constraints: true,
    onDelete: 'CASCADE'
});

const createTables = async () => {
    await Admin.sync();
    await FoodCategory.sync();
    await SubFood.sync();
    await User.sync()
}

// createTables()


module.exports = app;