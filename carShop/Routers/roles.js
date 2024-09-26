const Router = require('express').Router();

const role_Controller = require('../controller/role');

Router.get('/',role_Controller.slash);

Router.post('/',role_Controller.add_role);

Router.get('/:roleId',role_Controller.getRole);

Router.put('/:roleId',role_Controller.updateRole);


Router.delete('/:roleId',role_Controller.deleteRole);


module.exports = Router;