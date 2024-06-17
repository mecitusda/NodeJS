const { Sequelize } = require('sequelize');

module.exports = new Sequelize('OgrenciDb', 'postgres', 'Kardelen123', {
    host: 'localhost',
    dialect: 'postgres',
    port: 3000,
});

