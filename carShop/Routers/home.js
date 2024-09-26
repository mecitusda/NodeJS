const Router = require('express').Router();

Router.get('/home', (req, res) => {
    res.send('WELCOME TO OUR CAR SHOP');
});

Router.get('/', (req, res) => {
    res.send('WELCOME TO OUR CAR SHOP');
});

module.exports = Router;