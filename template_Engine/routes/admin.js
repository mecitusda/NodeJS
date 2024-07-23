
const express=require("express");
const router =express.Router();
const db = require("../config/db");
const { INTEGER } = require("sequelize");
const tables = {
    blog : require("../models/blog"),
    category : require("../models/category"),
    navbaritems : require("../models/navbaritems"),
    pages : require("../models/pages"),
    users : require("../models/users")
};
var i=1;



const data={
    title:"Anasayfa",
    categories:["Web Geliştirme","Mobil Uygulamalar","Veri Analizi","Programlama"],
    active_page:""
}



router.get("/blogs",async (req,res,next) => {
   
    const blogs= await db.query("SELECT * FROM blog", { type: db.QueryTypes.SELECT });

    const Admin_id=await db.query("SELECT id FROM pages WHERE page_name='admin_Create_Blog'", { type: db.QueryTypes.SELECT });

        const nav_items = await db.query(`SELECT * FROM navbaritems WHERE page_id=${Admin_id[0].id}`, { type: db.QueryTypes.SELECT });

    res.render("admins/blog-list",{
        blogs:blogs,    
        title:"Blog List",
        nav_items:nav_items,
        who_active:"All Blogs",
        main_Page:"admin",
        SelectedCategory:null
    })

})

router.use("/blog/category/:categoryid",async (req,res,next) => {   

    const blogs = await db.query("SELECT * FROM blog WHERE id_category=:id", {
            replacements: { id: req.params.categoryid },
            type: db.QueryTypes.SELECT
        });

    const categories = await db.query("SELECT * FROM categories", { type: db.QueryTypes.SELECT });
    
    const Admin_id=await db.query("SELECT id FROM pages WHERE page_name='Home_Admin'", { type: db.QueryTypes.SELECT });

        const nav_items = await db.query(`SELECT * FROM navbaritems WHERE page_id=${Admin_id[0].id}`, { type: db.QueryTypes.SELECT });

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
    const categories= await db.query("SELECT * FROM categories", { type: db.QueryTypes.SELECT });
    
    const Admin_id=await db.query("SELECT id FROM pages WHERE page_name='admin_Create_Blog'", { type: db.QueryTypes.SELECT });

        const nav_items = await db.query(`SELECT * FROM navbaritems WHERE page_id=${Admin_id[0].id}`, { type: db.QueryTypes.SELECT });
        
        

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
    
    const delete_blog=await db.query(`DELETE FROM blog WHERE id=${req.params.blogid}`);

    const blogs= await db.query("SELECT * FROM blog", { type: db.QueryTypes.SELECT });

    const Admin_id=await db.query("SELECT id FROM pages WHERE page_name='admin_Create_Blog'", { type: db.QueryTypes.SELECT });

        const nav_items = await db.query(`SELECT * FROM navbaritems WHERE page_id=${Admin_id[0].id}`, { type: db.QueryTypes.SELECT });
    
    

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
    
    
   const insert_blog=await db.query(`INSERT INTO blog (title, explanation, picture, id_category, home, verify, isvisible) VALUES ("${baslik}","${aciklama}","${resim}",${category},${home}, ${verify}, ${isvisible});`);
   
    res.redirect("/admin/blog/create?variable=${true}");
})

router.get("/blog/edit/:blogid",async(req,res,next) => {
    const blog = await db.query("SELECT * FROM blog WHERE id = :id", {type: db.QueryTypes.SELECT, replacements: { id: req.params.blogid }});

    const kullanicilar_id=await db.query("SELECT id FROM pages WHERE page_name='admin_edit'", { type: db.QueryTypes.SELECT });

    const nav_items = await db.query(`SELECT * FROM navbaritems WHERE page_id=${kullanicilar_id[0].id}`, { type: db.QueryTypes.SELECT });

    const categories= await db.query("SELECT * FROM categories", { type: db.QueryTypes.SELECT });

    if(!blog[0]){
        return alert("Blog bulunamadı.");
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

    const update_blog=await db.query(`UPDATE blog SET title="${baslik}", explanation="${aciklama}", picture="${resim}", id_category="${category}", home=${home}, verify=${verify}, isvisible=${isvisible} WHERE id=${req.params.blogid}`);

    const blog = await db.query("SELECT * FROM blog WHERE id = :id", {type: db.QueryTypes.SELECT, replacements: { id: req.params.blogid }});

    const kullanicilar_id=await db.query("SELECT id FROM pages WHERE page_name='admin_edit'", { type: db.QueryTypes.SELECT });

    const nav_items = await db.query(`SELECT * FROM navbaritems WHERE page_id=${kullanicilar_id[0].id}`, { type: db.QueryTypes.SELECT });

    const categories= await db.query("SELECT * FROM categories", { type: db.QueryTypes.SELECT });

    if(!update_blog[0]){
        return alert("Blog editlenirken bir hata oluştu.");
    }

    res.render("admins/edit-blog",{
        blog:blog[0],
        title:"Edit Blog",
        who_active:"Edit Blog",
        main_Page:"admin",
        nav_items:nav_items,
        categories:categories,
        iscreated:true
    
    });


})  



router.get("/blog/:blogid",async (req,res,next) => {
    
    const blogs = await db.query("SELECT * FROM blog WHERE id = :id", {
        replacements: { id: req.params.blogid },
        type: db.QueryTypes.SELECT
    });
    console.log("girdi")
    const kullanicilar_id=await db.query("SELECT id FROM pages WHERE page_name='admin_blog'", { type: db.QueryTypes.SELECT });

    const nav_items = await db.query(`SELECT * FROM navbaritems WHERE page_id=${kullanicilar_id[0].id}`, { type: db.QueryTypes.SELECT });


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
   
    const Admin_id=await db.query("SELECT id FROM pages WHERE page_name='admin_add_admin'", { type: db.QueryTypes.SELECT });

    const nav_items = await db.query(`SELECT * FROM navbaritems WHERE page_id=${Admin_id[0].id}`, { type: db.QueryTypes.SELECT });
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
    const Admin_id=await db.query("SELECT id FROM pages WHERE page_name='admin_add_admin'", { type: db.QueryTypes.SELECT });

    const nav_items = await db.query(`SELECT * FROM navbaritems WHERE page_id=${Admin_id[0].id}`, { type: db.QueryTypes.SELECT });
    
    const isExist=await db.query(`SELECT id FROM users WHERE username='${username}' OR e_mail='${email}'`, { type: db.QueryTypes.SELECT });

    if(isExist.length>0){
        return res.render("admins/add-admin",{
                     title:"Add Admin",
                     nav_items:nav_items,
                     who_active:"Add Admin",
                     main_Page:"admin",
                     eklendi:[true,message="kullanıcı adı veya email zaten var."]
                            })
    }
    const insert_user=await db.query(`INSERT INTO users (username,e_mail,password,position) VALUES ("${username}","${email}","${password}","Admin")`);

    res.render("admins/add-admin",{
        title:"Add Admin",
        nav_items:nav_items,
        who_active:"add_admin",
        main_Page:"admin",
        eklendi:[true,message="Kullanıcı başarıyla eklendi."]

    })
})


    
router.use("/",async (req,res,next) => {

    const blogs = await db.query("SELECT * FROM blog where verify=1 AND home=1 AND isvisible=1", {
        type: db.QueryTypes.SELECT
    });
    const categories = await db.query("SELECT * FROM categories", { type: db.QueryTypes.SELECT });
    
    const Admin_id=await db.query("SELECT id FROM pages WHERE page_name='Home_Admin'", { type: db.QueryTypes.SELECT });

        const nav_items = await db.query(`SELECT * FROM navbaritems WHERE page_id=${Admin_id[0].id}`, { type: db.QueryTypes.SELECT });

   

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