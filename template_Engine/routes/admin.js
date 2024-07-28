
const express=require("express");
const router =express.Router();
const db = require("../config/db");
const { Op } = require("sequelize");
const { table } = require("console");

const tables = {
    blog : require("../models/blog"),
    category : require("../models/category"),
    navbaritems : require("../models/navbaritems"),
    pages : require("../models/pages"),
    users : require("../models/users")
};
var i=1;



router.get("/blogs",async (req,res,next) => {
   
    const blogs= await tables.blog.findAll({});

    const Admin_id=await tables.pages.findOne({where:{page_name:"admin_Create_Blog"}}).then((pages) => {return pages.getDataValue("id")});

    const nav_items = await tables.navbaritems.findAll({where:{page_id:Admin_id}});
        
     

    res.render("admins/blog-list",{
        blogs:blogs,    
        title:"Blog List",
        nav_items:nav_items,
        who_active:"All Blogs",
        main_Page:"admin",
        SelectedCategory:null
    })

})

router.get("/blog/category/:categoryid",async (req,res,next) => {   

    const blogs = (await tables.blog.findAll({where:{id_category:req.params.categoryid}}))
    const categories = await tables.category.findAll({});
    const Admin_id=await tables.pages.findOne({where:{page_name:"Home_Admin"}}).then((pages) => {return pages.getDataValue("id")});
    const nav_items = await tables.navbaritems.findAll({where:{page_id:Admin_id}});
   
    res.render("admins/admin-category",{
        blogs:blogs,
        title:"Admin",
        nav_items:nav_items,
        who_active:"",
        main_Page:"admin",
        categories:categories,
        SelectedCategory:req.params.categoryid
    })
    })


/*router.get("/blog/edit",async(req,res,next) => {
    const categories= await db.query("SELECT * FROM categories", { type: db.QueryTypes.SELECT });
    
    const Admin_id=await db.query("SELECT id FROM pages WHERE page_name='admin_Create_Blog'", { type: db.QueryTypes.SELECT });

        const nav_items = await db.query(`SELECT * FROM navbaritems WHERE page_id=${Admin_id[0].id}`, { type: db.QueryTypes.SELECT });

    res.render("admins/edit-blog",{   
        title:"Edit Blog",
        who_active:"Edit Blog",
        nav_items:nav_items,
        categories:categories,
        iscreated:false,
        main_Page:"admin"
    })

});*/
router.get("/blog/create",async (req,res,next) => {
    const categories= await tables.category.findAll({});
     
    
    const Admin_id=await tables.pages.findOne({where:{page_name:"admin_Create_Blog"}}).then((pages) => {return pages.getDataValue("id")});
   
    const nav_items = await tables.navbaritems.findAll({where:{page_id:Admin_id}});
    

    res.render("admins/create-blog",{   
        title:"Create Blog",
        who_active:"Create Blog",
        nav_items:nav_items,
        categories:categories,
        iscreated:req.query.variable,
        main_Page:"admin"
    })
});

router.get("/blog/delete/:blogid",async(req,res,next) => {
    
    if(req.params.blogid === undefined){
        return res.status(404).send("Blog id bulunamadı.");
    }
    
    const delete_blog=await tables.blog.destroy({where:{id:req.params.blogid}});
    const blogs= await tables.blog.findAll({});
    const Admin_id=await tables.pages.findOne({where:{page_name:"admin_Create_Blog"}}).then((pages) => {return pages.getDataValue("id")});
    const nav_items = await tables.navbaritems.findAll({where:{page_id:Admin_id}});
  
    

    return res.render("admins/blog-list",{
        blogs:blogs,    
        title:"Blog List",
        nav_items:nav_items,
        who_active:"All Blogs",
        main_Page:"admin",
        SelectedCategory:null
    })
    
    
})


router.post("/blog/create",async (req,res,next) => {
 
    const {baslik,aciklama,resim,category}=req.body;
    const verify=req.body.verify == "on" ? true : false;
    const home=req.body.home == "on" ? true : false;
    const isvisible=req.body.isvisible == "on" ? true : false;
    
    
   const insert_blog=await tables.blog.create({title:baslik,explanation:aciklama,picture:resim,id_category:category,home:home,verify:verify,isvisible:isvisible});
  
   
    res.redirect("/admin/blog/create?variable=${true}");
})

router.get("/blog/edit/:blogid",async(req,res,next) => {
    const blog = await tables.blog.findAll({where:{id:req.params.blogid}});
   

    const kullanicilar_id=await tables.pages.findOne({where:{page_name:"admin_edit"}}).then((pages) => {return pages.getDataValue("id")});

    const nav_items = await tables.navbaritems.findAll({where:{page_id:kullanicilar_id}});
   
    const categories= await tables.category.findAll({});
   

    if(!blog[0]){
        return console.log("Blog bulunamadı.");
    }

    res.render("admins/edit-blog",{
        blog:blog[0],
        title:"Edit Blog",
        who_active:"Edit Blog",
        main_Page:"admin",
        nav_items:nav_items,
        categories:categories,
        iscreated:null
    
    });


})  


router.post("/blog/edit/:blogid",async(req,res,next) => {
    const {baslik,aciklama,resim,category}=req.body;
    const verify=req.body.verify == "on" ? true : false;
    const home=req.body.home == "on" ? true : false;
    const isvisible=req.body.isvisible == "on" ? true : false;

    const update_blog=await tables.blog.update({title:baslik,explanation:aciklama,picture:resim,id_category:category,home:home,verify:verify,isvisible:isvisible},{where:{id:req.params.blogid}});
    
    
    const blog = await tables.blog.findOne({where:{id:req.params.blogid}}).then((blog) => {return blog});
 

    const kullanicilar_id=await tables.pages.findOne({where:{page_name:"admin_edit"}}).then((pages) => {return pages.getDataValue("id")});


    const nav_items = await tables.navbaritems.findAll({where:{page_id:kullanicilar_id}});
  

    const categories= await tables.category.findAll({});
  

    if(!update_blog){
        console.log("Blog güncellenemedi.");
        return  res.render("admins/edit-blog",{
            blog:blog,
            title:"Edit Blog",
            who_active:"Edit Blog",
            main_Page:"admin",
            nav_items:nav_items,
            categories:categories,
            iscreated:true
        
        });
    }

    res.render("admins/edit-blog",{
        blog:blog,
        title:"Edit Blog",
        who_active:"Edit Blog",
        main_Page:"admin",
        nav_items:nav_items,
        categories:categories,
        iscreated:true
    
    });


})  



router.get("/blog/:blogid",async (req,res,next) => {
    
    const blogs = await tables.blog.findAll({where:{id:req.params.blogid}});
    const kullanicilar_id=await tables.pages.findOne({where:{page_name:"admin_blog"}}).then((pages) => {return pages.getDataValue("id")});
    const nav_items = await tables.navbaritems.findAll({where:{page_id:kullanicilar_id}});
    if (blogs[0]) {
        return res.status(200).render("admins/admin-blog", {
            blog: blogs,
            who_active: "Admin Blog",
            nav_items: nav_items,
            SelectedCategory:null,
            main_Page:"admin",
            SelectedCategory:null
        });
    }
    
    res.status(200).redirect("/");
})



router.use("/list",(req,res,next) => {


    res.render("admins/admin-list",data)
})




router.get("/add_admin",async(req,res,next) => {
   
    const Admin_id=await tables.pages.findOne({where:{page_name:"admin_add_admin"}}).then((pages) => {return pages.getDataValue("id")});
  
    const nav_items = await tables.navbaritems.findAll({where:{page_id:Admin_id}});
    
    res.render("admins/add-admin",{
        title:"Add Admin",
        nav_items:nav_items,
        who_active:"Add Admin",
        main_Page:"admin",
        eklendi:false
    })
})


router.post("/add_admin",async(req,res,next) => {
    console.log("Giriş ",(i++));
    const {username,email:temp_email,email_option,password}=req.body;
    email=temp_email+email_option;
    const Admin_id=await tables.pages.findOne({where:{page_name:"admin_add_admin"}}).then((pages) => {return pages.getDataValue("id")});
  
    const nav_items = await tables.navbaritems.findAll({where:{page_id:Admin_id}});

    const isExist=await tables.users.findOne({where:
          { [Op.or]: [{username:username},{e_mail:email}]}});
    
    console.log("isExist",isExist);
    if(isExist !== null){
        return res.render("admins/add-admin",{  
                     title:"Add Admin",
                     nav_items:nav_items,
                     who_active:"Add Admin",
                     main_Page:"admin",
                     eklendi:[true,message="kullanıcı adı veya email zaten var."]
                            })
    }
    const insert_user=await tables.users.create({username:username,e_mail:email,password:password,position:"Admin"});
    
    res.render("admins/add-admin",{
        title:"Add Admin",
        nav_items:nav_items,
        who_active:"add_admin",
        main_Page:"admin",
        eklendi:[true,message="Kullanıcı başarıyla eklendi."]

    })
})


    
router.use("/",async (req,res,next) => {

    const blogs = await tables.blog.findAll({where:{verify:1,home:1,isvisible:1}});
    const categories = await tables.category.findAll({});
    const Admin_id=await tables.pages.findOne({where:{page_name:"Home_Admin"}}).then((pages) => {return pages.getDataValue("id")});
    const nav_items = await tables.navbaritems.findAll({where:{page_id:Admin_id}});
   console.log(blogs);

    res.render("admins/admin",{
        blogs:blogs,
        title:"Admin",
        nav_items:nav_items,
        who_active:"",
        main_Page:"admin",
        categories:categories,
        SelectedCategory:null
    })
})


module.exports=router;