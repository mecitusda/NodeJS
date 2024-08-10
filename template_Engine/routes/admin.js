const express=require("express");
const router =express.Router();
const controllerAdmin = require("../controllers/admin");



router.get("/blogs",controllerAdmin.blogs)

router.get("/blog/category/:slug",controllerAdmin.blogcategory_with_id)
    


router.get("/blog/create",controllerAdmin.create_blog_get);

router.get("/blog/delete/:blogid",controllerAdmin.delete_blog);

router.get("/category/delete/:categoryid",controllerAdmin.delete_category);

router.get("/category/create",controllerAdmin.create_category_get);

router.post("/category/create",controllerAdmin.create_category_post);

router.post("/blog/create",controllerAdmin.create_blog_post);


router.get("/blog/edit/:slug",controllerAdmin.edit_blog_get);  

router.get("/category/edit/:slug",controllerAdmin.edit_category_get);

router.post("/category/edit/:slug",controllerAdmin.edit_category_post);

router.post("/blog/edit/:slug",controllerAdmin.edit_blog_post)  

router.get("/categories",controllerAdmin.categories)

router.get("/blog/:slug",controllerAdmin.blog_with_id)


router.get("/add_admin",controllerAdmin.add_admin_get);


router.post("/add_admin",controllerAdmin.add_admin_post);

router.get("/category/delete/:categoryid",controllerAdmin.delete_category)
    
router.get("/category/remove/:categoryid/:blogid",controllerAdmin.remove_category)
router.use("/",controllerAdmin.home)


module.exports=router;