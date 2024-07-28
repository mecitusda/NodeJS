const { DataTypes } = require('sequelize');
const db = require('../config/db');

const NavbarItem = db.define('navbaritems', {
 
  page_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    
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
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  }

}, {
  tableName: 'navbaritems', // Veritabanında mevcut olan tablo adı
  freezeTableName: true, // Tablonun adının otomatik olarak çoğul yapılmasını engeller
  timestamps: true // createdAt ve updatedAt alanlarını devre dışı bırakır
  
});
NavbarItem.sync({ alter: true });
module.exports = NavbarItem;
