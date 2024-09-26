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
const category_Router= require('./Routers/category');
const car = require('./models/car');
const comment_Router = require('./Routers/comment');
const user_Router = require('./Routers/user');


app.use(express.json());

//Middleware
app.use(cors(
    {
      origin: '*',
      methods: 'GET,POST,PUT,DELETE'
    }
  ))

app.use('/',home_Router);
app.use('/api/categorys',category_Router);
app.use('/api/comments',comment_Router);
app.use('/api/users',user_Router);
app.use('/api/cars',cars_Router);


app.listen(300, () => {
  console.log('Server is running on port 300');
});