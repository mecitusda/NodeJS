const express=require("express");
const router =express.Router();
const controllerAdmin = require("../controllers/admin");
const isAdmin = require("../middlewares/isAdmin");
const checkcsrf_token = require("../middlewares/csrf");
const isModerator = require("../middlewares/isModerator");
const isUser = require("../middlewares/isUser");
const { upload } = require("../helpers/image-upload");
const upload_image = require("../helpers/image-upload").upload;

router.get("/blogs",isModerator,controllerAdmin.blogs)

router.get("/blog/category/:slug",checkcsrf_token,controllerAdmin.blogcategory_with_id)
    


router.get("/blog/create",isModerator,checkcsrf_token,controllerAdmin.create_blog_get);

router.get("/blog/delete/:blogid",isModerator,checkcsrf_token,controllerAdmin.delete_blog);

router.get("/category/delete/:categoryid",isAdmin,checkcsrf_token,controllerAdmin.delete_category);

router.get("/category/create",isAdmin,checkcsrf_token,controllerAdmin.create_category_get);

router.post("/category/create",isAdmin,controllerAdmin.create_category_post);

router.post("/blog/create",isModerator,upload_image.single("resim"),controllerAdmin.create_blog_post);


router.get("/blog/edit/:slug",isModerator,checkcsrf_token,controllerAdmin.edit_blog_get);  

router.get("/category/edit/:slug",isAdmin,checkcsrf_token,controllerAdmin.edit_category_get);

router.post("/category/edit/:slug",isAdmin,controllerAdmin.edit_category_post);

router.post("/blog/edit/:slug",isModerator,upload_image.single("resim"),controllerAdmin.edit_blog_post); 

router.get("/categories",isAdmin,controllerAdmin.categories);

router.get("/blog/:slug",isUser,controllerAdmin.blog_with_id);

router.get("/users",isAdmin,checkcsrf_token,controllerAdmin.users_get);
router.get("/user/create",isAdmin,checkcsrf_token,controllerAdmin.create_user_get);
router.post("/user/delete",isAdmin,checkcsrf_token,controllerAdmin.delete_user);
router.get("/user/edit/:userid",isAdmin,checkcsrf_token,controllerAdmin.edit_user_get);
router.post("/user/edit/:userid",isAdmin,controllerAdmin.edit_user_post);

router.post("/user/create",isAdmin,controllerAdmin.create_user_post);
    
router.get("/category/remove/:categoryurl/:blogurl",isAdmin,checkcsrf_token,controllerAdmin.remove_category);

router.get("/roles",isAdmin,controllerAdmin.roles);

router.post("/role/remove",isAdmin,checkcsrf_token,controllerAdmin.remove_role);

router.get("/role/edit/:slug",isAdmin,checkcsrf_token,controllerAdmin.edit_role_get);
router.post("/role/edit/:slug",isAdmin,controllerAdmin.edit_role_post);

router.get("/role/delete/:roleid",isAdmin,checkcsrf_token,controllerAdmin.delete_role);

router.get("/role/create",isAdmin,checkcsrf_token,controllerAdmin.create_role_get);
router.post("/role/create",isAdmin,controllerAdmin.create_role_post);
router.use("/",isUser,controllerAdmin.home);


module.exports=router;