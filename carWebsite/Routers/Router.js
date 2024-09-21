const Router =  require('express').Router();
const controller = require('../controllers/Controller');

Router.get("/",controller.home);

module.exports = Router;