const express = require('express');
const app = express();
const Joi = require('joi');
const cors = require('cors');
require('dotenv').config();
//Database
const db = require('./config/mongoose');

//Routers
const cars_Router= require('./Routers/cars');
const home_Router= require('./Routers/home');

app.use(express.json());

//Middleware
app.use(cors(
    {
      origin: '*',
      methods: 'GET,POST,PUT,DELETE'
    }
  ))

app.use('/',home_Router);
app.use('/api/cars',cars_Router);


app.listen(300, () => {
  console.log('Server is running on port 300');
});