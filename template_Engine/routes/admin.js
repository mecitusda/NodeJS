const express=require("express");
const router =express.Router();
const controllerAdmin = require("../controllers/admin");
const isAuth = require("../middlewares/isAuth");
const checkcsrf_token = require("../middlewares/csrf");


router.get("/blogs",isAuth,controllerAdmin.blogs)

router.get("/blog/category/:slug",isAuth,checkcsrf_token,controllerAdmin.blogcategory_with_id)
    


router.get("/blog/create",isAuth,checkcsrf_token,controllerAdmin.create_blog_get);

router.get("/blog/delete/:blogid",isAuth,checkcsrf_token,controllerAdmin.delete_blog);

router.get("/category/delete/:categoryid",isAuth,checkcsrf_token,controllerAdmin.delete_category);

router.get("/category/create",isAuth,checkcsrf_token,controllerAdmin.create_category_get);

router.post("/category/create",isAuth,controllerAdmin.create_category_post);

router.post("/blog/create",isAuth,controllerAdmin.create_blog_post);


router.get("/blog/edit/:slug",isAuth,checkcsrf_token,controllerAdmin.edit_blog_get);  

router.get("/category/edit/:slug",isAuth,checkcsrf_token,controllerAdmin.edit_category_get);

router.post("/category/edit/:slug",isAuth,controllerAdmin.edit_category_post);

router.post("/blog/edit/:slug",isAuth,controllerAdmin.edit_blog_post)  

router.get("/categories",isAuth,controllerAdmin.categories)

router.get("/blog/:slug",isAuth,controllerAdmin.blog_with_id)


router.get("/add_admin",isAuth,checkcsrf_token,controllerAdmin.add_admin_get);


router.post("/add_admin",isAuth,controllerAdmin.add_admin_post);
    
router.get("/category/remove/:categoryurl/:blogurl",isAuth,checkcsrf_token,controllerAdmin.remove_category)
router.use("/",controllerAdmin.home)


module.exports=router;