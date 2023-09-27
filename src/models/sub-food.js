const { DataTypes } = require('sequelize')
const sequelize = require('../db/database');

const SubFood = sequelize.define('SubFood', {
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
    rating: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    preparation_duration: {
        type: DataTypes.STRING,
        allowNull: false
    },
    calory_amount: {
        type: DataTypes.FLOAT,
        allowNull: true
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

module.exports = SubFood;
