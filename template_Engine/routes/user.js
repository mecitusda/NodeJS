const express = require("express");
const router = express.Router();
const blog = require("../models/blog");
const db = require("../config/db");

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
        
        const blogs = await db.query("SELECT * FROM blog WHERE id_category=:id", {
            replacements: { id: req.params.categoryid },
            type: db.QueryTypes.SELECT
        });
    
        
        const categories = await db.query("SELECT * FROM categories", { type: db.QueryTypes.SELECT });

        const kullanicilar_id=await db.query("SELECT id FROM pages WHERE page_name='Kullanicilar'", { type: db.QueryTypes.SELECT });

        const nav_items = await db.query(`SELECT * FROM navbaritems WHERE page_id=${kullanicilar_id[0].id}`, { type: db.QueryTypes.SELECT });

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
        const blogs = await db.query("SELECT * FROM blog WHERE id = :id", {
            replacements: { id: req.params.id },
            type: db.QueryTypes.SELECT
        });

        const kullanicilar_id=await db.query("SELECT id FROM pages WHERE page_name='Kullanicilar'", { type: db.QueryTypes.SELECT });

        const nav_items = await db.query(`SELECT * FROM navbaritems WHERE page_id=${kullanicilar_id[0].id}`, { type: db.QueryTypes.SELECT });


        if (blogs[0]) {
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
});

router.use("/kullanicilar", async (req, res, next) => {
    try {
        const blogs = await db.query("SELECT * FROM blog", { type: db.QueryTypes.SELECT });
        const categories = await db.query("SELECT * FROM categories", { type: db.QueryTypes.SELECT });
        
            const kullanicilar_id=await db.query("SELECT id FROM pages WHERE page_name='Kullanicilar'", { type: db.QueryTypes.SELECT });

            const nav_items = await db.query(`SELECT * FROM navbaritems WHERE page_id=${kullanicilar_id[0].id}`, { type: db.QueryTypes.SELECT });

        console.log(nav_items);
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
        const blogs = await db.query("SELECT * FROM blog where verify=1 AND home=1 AND isvisible=1", {
            type: db.QueryTypes.SELECT
        });
        const categories = await db.query("SELECT * FROM categories", { type: db.QueryTypes.SELECT });

        const home_id=await db.query("SELECT id FROM pages WHERE page_name='Home'", { type: db.QueryTypes.SELECT });

        const nav_items = await db.query(`SELECT * FROM navbaritems WHERE page_id=${home_id[0].id}`, { type: db.QueryTypes.SELECT });
     
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
