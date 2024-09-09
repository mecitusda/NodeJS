const Router = require('express').Router();
const Joi = require('joi');

const product= require('../models/products');
const category = require('../models/category');

const carController = require('../controller/cars');

Router.get('/',carController.slash)
   
Router.get('/:id',carController.getById);

Router.post('/add_car',carController.addCar);

Router.put('/:id',carController.updateCar);

Router.delete('/:id',carController.deleteCar);


module.exports = Router;