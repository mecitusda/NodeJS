const { DataTypes } = require('sequelize');
const db = require('../config/db');

  const user = db.define('user', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  e_mail: {
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
  },
  resetToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetTokenExpiration: {
    type: DataTypes.DATE,
    allowNull: true
  }

}, {
  tableName: 'user', // Veritabanında mevcut olan tablo adı
  freezeTableName: true, // Tablonun adının otomatik olarak çoğul yapılmasını engeller
  timestamps: true // createdAt ve updatedAt alanlarını devre dışı bırakır
});

module.exports = user;
