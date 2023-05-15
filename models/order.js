const { DataTypes } = require('sequelize')
const sequelize = require('../utils/database');

const FoodCategory = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

module.exports = FoodCategory;
