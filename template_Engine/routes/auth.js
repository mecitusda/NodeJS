const express = require('express');
const router = express.Router();
const controllerAuth = require('../controllers/auth');
const checkcsrf_token = require('../middlewares/csrf');
const csurf = require('csurf');

router.get('/register',checkcsrf_token,controllerAuth.register_get);
router.post('/register', controllerAuth.register_post);

router.get('/login',checkcsrf_token,controllerAuth.login_get);
router.post('/login', controllerAuth.login_post);

router.get('/logout', controllerAuth.logout_get);

router.get('/forgot-password',checkcsrf_token,controllerAuth.forgot_get);
router.post('/forgot-password', controllerAuth.forgot_post);

router.get('/reset-password/:token',checkcsrf_token,controllerAuth.reset_get);
router.post('/reset-password', controllerAuth.reset_post);



module.exports = router;