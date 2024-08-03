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

router.use("/blog/category/:categoryid",controllerUser.blog_category );

router.use("/blog/:id",controllerUser.blog_with_id);

router.use("/kullanicilar",controllerUser.blogs);

router.use("/", controllerUser.home);

module.exports = router;
