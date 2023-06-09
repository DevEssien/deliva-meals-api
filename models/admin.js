const { DataTypes } = require('sequelize')
const sequelize = require('../utils/database');

const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING
    }
});

module.exports = Admin;
