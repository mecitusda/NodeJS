const { DataTypes } = require('sequelize');
const db = require('../config/db');


  const role = db.define('role', {
    rolename: {
      type: DataTypes.STRING,
      allowNull: false
    }

  }, {
  tableName: 'role', // Veritabanında mevcut olan tablo adı
  freezeTableName: true, // Tablonun adının otomatik olarak çoğul yapılmasını engeller
  timestamps: true // createdAt ve updatedAt alanlarını devre dışı bırakır
});


module.exports = role;