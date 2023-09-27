const { DataTypes } = require('sequelize')
const sequelize = require('../db/database');

const FoodCategory = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    food_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    food_class: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    secure_image_url: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    image_public_id: {
        type: DataTypes.STRING,
        defaultValue: null
    }
});

module.exports = FoodCategory;
