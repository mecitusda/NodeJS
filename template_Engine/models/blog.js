const { DataTypes } = require('sequelize');
const db = require('../config/db');


const blog = db.define('blog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  explanation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  picture: {
    type: DataTypes.STRING,
    allowNull: false
  },
  home:{
    type:DataTypes.BOOLEAN,
    allowNull:false
  },
  verify:{
    type:DataTypes.BOOLEAN,
    allowNull:false
  },
  isvisible:{
    type:DataTypes.BOOLEAN,
    allowNull:false
  }

}, {
  tableName: 'blog', // Veritabanında mevcut olan tablo adı
  freezeTableName: true, // Tablonun adının otomatik olarak çoğul yapılmasını engeller
  timestamps: false // createdAt ve updatedAt alanlarını devre dışı bırakır
});

module.exports = blog;