const Sequelize = require('sequelize')
const db = require('../config/db.js')
const Bolum = require('./bolum.js')

const Ogrenci =  db.define('ogrencis', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,

    },
    email: {
        type: Sequelize.STRING,

    },
    dept_id: {
        type: Sequelize.INTEGER,
        foreignKeyConstraint: true,

    },
    counter: {
        type: Sequelize.INTEGER,
    },
})

Ogrenci.belongsTo(Bolum, { foreignKey: 'dept_id', onDelete: 'cascade' })

const OgrenciSayac = db.define('Ogrenci_Sayacs', {
    sayac: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }
})

module.exports = {
    Ogrenci,
    OgrenciSayac
};