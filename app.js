require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');

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

app.listen(8080, () => {
    console.log('server spinning at port 8080');
});