const nodemailer = require('nodemailer');
const  db  = require('../config/db');

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secureConnection: false,
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
    },
    service: 'hotmail',
    auth: {
        user:db.options.email.username,
        pass:db.options.email.password
    }
});

module.exports = transporter;