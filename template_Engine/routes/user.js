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
        res.status(200).render("users/users", {
            title: "Kategoriye Göre Bloglar",
            categories: categories,
            blogs: blogs,
            who_active: "index",
            SelectedCategory: req.params.categoryid
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
        if (blogs[0]) {
            return res.status(200).render("users/blog", {
                blog: blogs,
                who_active: "blog",
                SelectedCategory:null
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
            SelectedCategory:null
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
        if(blogs)
        res.status(200).render("users/users", {
            title: data.title,
            categories: categories,
            blogs: blogs,
            who_active: "users",
            SelectedCategory:null
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

        res.status(200).render("users/index", {
            title: data.title,
            categories: categories,
            blogs: blogs,
            who_active: "index",
            SelectedCategory:null
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: "Bir hata oluştu." });
    }
});

module.exports = router;
