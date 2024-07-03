
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

router.get("/blog/create",async (req,res,next) => {
    const categories= await db.query("SELECT * FROM categories", { type: db.QueryTypes.SELECT });
    res.render("admins/create-blog",{
        title:"Create Blog",
        who_active:"create-blog",
        categories:categories,
        iscreated:false
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


    
router.use("/",(req,res,next) => {
  
    
    res.render("admins/admin",data)
})

module.exports=router;