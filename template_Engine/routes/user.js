const express = require("express");
const router = express.Router();
const db = require("../config/db");

const tables = {
 blog : require("../models/blog"),
 category : require("../models/category"),
 navbaritems : require("../models/navbaritems"),
 pages : require("../models/pages"),
 users : require("../models/users")}


const data = {
    title: "Anasayfa",
};

// Önbellek kontrol başlıkları eklemek için bir middleware
router.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
});

router.use("/blog/category/:categoryid", async (req, res) => {
    try {
        
   
        const blogs =await tables.blog.findAll({where:{id_category:req.params.categoryid}})
        const categories = await tables.category.findAll({});
        const kullanicilar_id=await tables.pages.findOne({where:{page_name:"kullanicilar"}});
        const nav_items = await tables.navbaritems.findAll({where:{page_id:kullanicilar_id.getDataValue("id")}});
        
        res.status(200).render("users/users", {
            title: "Kategoriye Göre Bloglar",
            categories: categories,
            blogs: blogs,
            nav_items: nav_items,
            who_active: "Home",
            SelectedCategory: req.params.categoryid,
            main_Page:"",
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ err: "Bir hata oluştu." });
    }
});

router.use("/blog/:id", async (req, res, next) => {
    try {
        const blogs = await tables.blog.findOne({where:{id:req.params.id}}).then((blog) => {return blog});
        
        const kullanicilar_id=await tables.pages.findOne({where:{page_name:"Kullanicilar"}}).then((pages) => {return pages.getDataValue("id")});

        const nav_items = await tables.navbaritems.findAll({where:{page_id:kullanicilar_id}});

        if (blogs) {
            return res.status(200).render("users/blog", {
                blog: blogs,
                who_active: "Home",
                nav_items: nav_items,
                SelectedCategory:null,
                main_Page:""
            });
        }
        
        res.status(200).redirect("/");
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: "Bir hata oluştu." });
    }
});


/*
router.use("/kullanicilar/:kullaniciid/detaylar/:isim", async (req, res, next) => {
    
    try {
        
        const blogs = await db.query("SELECT * FROM blog", { type: db.QueryTypes.SELECT });
        const categories = await db.query("SELECT * FROM categories", { type: db.QueryTypes.SELECT });

        res.status(200).render("users/user-details", {
            title: data.title,
            categories: categories,
            blogs: blogs,
            SelectedCategory:null,
            main_Page:""
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ err: "Bir hata oluştu." });
    }
});*/


router.use("/kullanicilar", async (req, res, next) => {
    try {
      
        const blogs = await tables.blog.findAll({where:{verify:1,isvisible:1}});
     
        const categories = await tables.category.findAll({});
       
        const kullanicilar_id=await tables.pages.findOne({where:{page_name:"kullanicilar"}}).then((pages) => {return pages.getDataValue("id")});
        console.log(kullanicilar_id);
        
        const nav_items = await tables.navbaritems.findAll({where:{page_id:kullanicilar_id}});
       
        if(blogs)
        res.status(200).render("users/users", {
            title: data.title,
            categories: categories,
            blogs: blogs,
            nav_items: nav_items,
            who_active: "All Blogs",
            SelectedCategory:null,
            main_Page:""
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: "Bir hata oluştu." });
    }
});

router.use("/", async (req, res, next) => {
    try {

        const blogs = await tables.blog.findAll({where:{verify:1,home:1,isvisible:1}});
        const categories = await tables.category.findAll({});
        const home_id=await tables.pages.findOne({where:{page_name:"Home"}}).then((pages) => {return pages.getDataValue("id")});
        const nav_items = await tables.navbaritems.findAll({where:{page_id:home_id}});
     
        res.status(200).render("users/index", {
            title: data.title,
            categories: categories,
            blogs: blogs,
            nav_items: nav_items,
            who_active: "index",
            SelectedCategory:null,
            main_Page:""
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: "Bir hata oluştu." });
    }
});

module.exports = router;
