const { DataTypes } = require('sequelize');
const db = require('../config/db');


  const blog = db.define('blog', {
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
    subtitle: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
  tableName: 'blog', // Veritabanında mevcut olan tablo adı
  freezeTableName: true, // Tablonun adının otomatik olarak çoğul yapılmasını engeller
  timestamps: true // createdAt ve updatedAt alanlarını devre dışı bırakır
});


module.exports = blog;