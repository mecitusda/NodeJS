const Router = require('express').Router();

const commentController = require('../controller/comment');

Router.get('/',commentController.slash);

Router.get('/:id',commentController.getById);

Router.post('/:id',commentController.addComment);

Router.put('/:id',commentController.updateComment);

Router.delete('/:id',commentController.deleteComment);

module.exports = Router;