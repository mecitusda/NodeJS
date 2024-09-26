const Router = require('express').Router();
const categoryController = require('../controller/category');


Router.get('/',categoryController.slash);
Router.get('/:id',categoryController.getById);

Router.post('/',categoryController.addCategory);

Router.put('/:id',categoryController.updateCategory);

Router.delete('/:id',categoryController.deleteCategory);

module.exports = Router;