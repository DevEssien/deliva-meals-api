const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path')

const Admin = require('./models/Admin');
const FoodCategory = require('./models/Food-Category');
const SubFood = require('./models/Sub-Food');
const User = require('./models/User');
const authRoute = require('./routes/auth');
const { subscribe } = require('./routes/admin');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(authRoute)

app.use((error, req, res, next) => {
    const code = error.code || 500;
    const status = error.status || 'error'
    const message = error.message || 'Server side error';
    const data = error.data || null;
    return res.status(200).json({ status, code, message, data });
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