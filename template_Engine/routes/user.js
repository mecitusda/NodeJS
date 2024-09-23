const express = require("express");
const router = express.Router();
const controllerUser = require("../controllers/user");


// Önbellek kontrol başlıkları eklemek için bir middleware
router.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
});

router.get("/blog/category/:slug",controllerUser.blog_category );

router.get("/blog/:slug",controllerUser.blog_with_id);

router.get("/kullanicilar",controllerUser.blogs);

router.get("/", controllerUser.home);

module.exports = router;
