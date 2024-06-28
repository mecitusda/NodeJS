const { Sequelize } = require('sequelize');

require('dotenv').config();
module.exports = new Sequelize({
    database: process.env.DB_Name,
    username: process.env.DB_User,
    password: process.env.DB_Password,
    host: process.env.DB_Host,
    port: process.env.port1,
    dialect: process.env.DB_Dialect
});