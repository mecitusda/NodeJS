const { DataTypes } = require('sequelize');
const db = require('../config/db');
const bcrypt = require("bcrypt");
  const user = db.define('user', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {msg: 'Şifre alanı boş bırakılamaz.'}
    }
  },
  e_mail: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:{
      args: true,
      msg: 'Bu e-mail adresi zaten kullanılmaktadır.'},
      validate: {
        isEmail: {
          msg: 'Lütfen geçerli bir e-mail adresi giriniz.'
        },
        notEmpty: {
          msg: 'E-mail alanı boş bırakılamaz.'
        },
        
      } 
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

user.afterValidate((user) => {
  user.password = bcrypt.hashSync(user.password, 10);
});

module.exports = user;
