const { DataTypes } = require('sequelize')
const sequelize = require('../db/database');

const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING
    }
});

module.exports = Admin;
