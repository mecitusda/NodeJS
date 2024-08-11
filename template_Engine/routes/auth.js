const express = require('express');
const router = express.Router();
const controllerAuth = require('../controllers/auth');

router.get('/register', controllerAuth.register_get);
router.post('/register', controllerAuth.register_post);
router.get('/login', controllerAuth.login_get);
router.post('/login', controllerAuth.login_post);

module.exports = router;