const Sequelize = require('sequelize')
const db = require('../config/db.js')

const Bolum = db.define('bolums', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,

    },
    dept_id:{
        type: Sequelize.INTEGER,
    }
})

module.exports = Bolum