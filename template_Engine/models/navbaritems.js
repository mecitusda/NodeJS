const { DataTypes } = require('sequelize');
const db = require('../config/db');

const NavbarItem = db.define('navbaritems', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  page_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  item_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  item_directory: {
    type: DataTypes.STRING,
    allowNull: false
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: true,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: true,
  }

}, {
  tableName: 'navbaritems', // Veritabanında mevcut olan tablo adı
  freezeTableName: true, // Tablonun adının otomatik olarak çoğul yapılmasını engeller
  timestamps: true // createdAt ve updatedAt alanlarını devre dışı bırakır
  
});
NavbarItem.sync({ alter: true });
module.exports = NavbarItem;
