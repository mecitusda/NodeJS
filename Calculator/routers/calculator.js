const express = require('express');
const router = express.Router();
const controller = require('../controllers/calculator');
router.get('/',controller.calculate);


module.exports = router;