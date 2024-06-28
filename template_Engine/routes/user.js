const express=require("express");
const router =express.Router();
const blog=require("../models/blog");
const db = require("../config/db");

var i=1;

const data={
    title:"Anasayfa",

}


router.use("/kullanicilar/:kullaniciid/detaylar/:isim",async (req,res,next) => {

    try{
    
    const blogs=await db.query("SELECT * FROM blog",{type:db.QueryTypes.SELECT})
    const categories=await db.query("SELECT name FROM categories",{type:db.QueryTypes.SELECT})
    
    
    res.render("users/user-details",{
        title:data.title,
        categories:categories,
        blogs:blogs
     })}

        catch(err){ console.log(err)}   

})

router.use("/blog/:id",async (req,res,next) => {
    
        try{
            const blogs = await db.query("SELECT * FROM blog WHERE id = :id", {
                replacements: { id: req.params.id },
                type: db.QueryTypes.SELECT
            });
            //const categories=await db.query("SELECT name FROM categories",{type:db.QueryTypes.SELECT})
            res.render("users/blog",{
                blog:blogs,
                who_active:"blog"
            })
        }catch(err){console.log(err)}
        
    })



router.use("/kullanicilar",async(req,res,next) => {

    try{
        const blogs= await db.query("SELECT * FROM blog",{type:db.QueryTypes.SELECT})
        const categories= await db.query("SELECT name FROM categories",{type:db.QueryTypes.SELECT})
        res.render("users/users",{
            title:data.title,
            categories:categories,
            blogs:blogs,
            who_active:"users"
         })

    }catch(err){
        console.log(err)}
    
})
    
router.use("/",async (req,res,next) => {

    try{
        const blogs=await db.query("SELECT * FROM blog where verify=1 AND home=1 AND isvisible=1 ",{type:db.QueryTypes.SELECT});
        const categories=await db.query("SELECT name FROM categories",{type:db.QueryTypes.SELECT})

        res.render("users/index",{
            title:data.title,
            categories:categories,
            blogs:blogs,
            who_active:"index"  
         })
    }
    catch(err){
        console.log(err)}



})

module.exports=router;