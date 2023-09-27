const { DataTypes } = require('sequelize')
const sequelize = require('../db/database');

const Order = sequelize.define('Order', {
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

module.exports = Order;
