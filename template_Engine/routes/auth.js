const express = require('express');
const router = express.Router();
const controllerAuth = require('../controllers/auth');
const checkcsrf_token = require('../middlewares/csrf');

router.get('/register',checkcsrf_token,controllerAuth.register_get);
router.post('/register', controllerAuth.register_post);
router.get('/login',checkcsrf_token,controllerAuth.login_get);
router.post('/login', controllerAuth.login_post);
router.get('/logout', controllerAuth.logout_get);


module.exports = router;