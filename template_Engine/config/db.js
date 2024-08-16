const { format } = require('path');
const { Sequelize } = require('sequelize');

require('dotenv').config();
const db =new Sequelize({
    database: process.env.DB_Name,
    username: process.env.DB_User,
    password: process.env.DB_Password,
    host: process.env.DB_Host,
    port: process.env.port1,
    dialect: process.env.DB_Dialect,
    storage: "./session.mysql",
    email:{
            username:process.env.EMAIL_USER,
            password:process.env.EMAIL_PASSWORD,
            from:process.env.EMAIL_USER,
        }
   } );

function connectDB(){
    db.authenticate()
    .then(()=>{
        console.log("Connection has been established successfully.");
    })
    .catch((err)=>{
        console.error("Unable to connect to the database:", err);
    });
}

module.exports = db;