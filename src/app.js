const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path')

const Admin = require('./models/admin');
const FoodCategory = require('./models/food-category');
const SubFood = require('./models/sub-food');
const adminRoute = require('./routes/admin');
const { protect } = require('./modules/auth')
const { createAdmin, loginAdmin } = require('./handlers/admin/auth');
const { subscribe } = require('./routes/admin');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


app.use('/images', express.static(path.join(__dirname, 'images')));

app.post('/admin/signup', createAdmin);
app.post('/admin/signin', loginAdmin);

app.use('/api', protect, adminRoute);

app.use((error, req, res, next) => {
    const code = error.statusCode || 500;
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
}

// createTables()


module.exports = app;