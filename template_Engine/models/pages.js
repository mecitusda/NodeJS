const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Page = db.define('pages', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  page_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  }

}, {
  tableName: 'pages', // Veritabanında mevcut olan tablo adı
  freezeTableName: true, // Tablonun adının otomatik olarak çoğul yapılmasını engeller
  timestamps: true // createdAt ve updatedAt alanlarını devre dışı bırakır
});

module.exports = Page;
