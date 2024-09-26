const Router = require('express').Router();
const user_Controller = require('../controller/user');

Router.get('/',user_Controller.slash);

Router.post('/',user_Controller.add_user);

Router.get('/:userId',user_Controller.getUser);

Router.put('/:userId',user_Controller.updateUser);

Router.delete('/:userId',user_Controller.deleteUser);





module.exports = Router;