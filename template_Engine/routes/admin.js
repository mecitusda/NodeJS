
const express=require("express");
const router =express.Router();
const db = require("../config/db");
const { INTEGER } = require("sequelize");
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

router.get("/blog/create",async (req,res,next) => {
    const categories= await db.query("SELECT * FROM categories", { type: db.QueryTypes.SELECT });
    
    const Admin_id=await db.query("SELECT id FROM pages WHERE page_name='admin_Create_Blog'", { type: db.QueryTypes.SELECT });

        const nav_items = await db.query(`SELECT * FROM navbaritems WHERE page_id=${Admin_id[0].id}`, { type: db.QueryTypes.SELECT });


    res.render("admins/create-blog",{   
        title:"Create Blog",
        who_active:"Create Blog",
        nav_items:nav_items,
        categories:categories,
        iscreated:false,
        main_Page:"admin"
    })
});

router.post("/blog/create",async (req,res,next) => {
 
    const {baslik,aciklama,resim,category}=req.body;
    const verify=req.body.verify == "on" ? true : false;
    const home=req.body.home == "on" ? true : false;
    const isvisible=req.body.isvisible == "on" ? true : false;
    
    
   const insert_blog=await db.query(`INSERT INTO blog (title, explanation, picture, id_category, home, verify, isvisible) VALUES ('${baslik}','${aciklama}', '${resim}',${category},${home}, ${verify}, ${isvisible});`);
   
    res.redirect("/");
})

router.use("/:adminid/edit/:isim",(req,res,next) => {
    console.log("Giriş ",(i++),req.params);
    
    res.render("admins/admin-edit",data)//Burada view engin kullandığımız için render otomatik olarak 
                                                               //views adlı klasör altında arama yapıyor.o yüzden views'i eklemeye
})                                                            //gerek yok.Dosya uzantılarınıda bilmesine gerek yok çünkü ejs uzantılı dosya istiyor zaten.

router.use("/list",(req,res,next) => {


    res.render("admins/admin-list",data)
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