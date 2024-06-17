const express=require("express");
const router =express.Router();
var i=1;

const data={
    title:"Anasayfa",
    categories:["Web Geliştirme","Mobil Uygulamalar","Veri Analizi","Programlamaw"]
}


router.use("/kullanicilar/:kullaniciid/detaylar/:isim",(req,res,next) => {
    console.log("Giriş ",(i++),req.params);
  
    
    res.render("users/user-details",data)
})

router.use("/kullanicilar",(req,res,next) => {

 
    res.render("users/users",data)
})
    
router.use("/",(req,res,next) => {
  

    res.render("users/index",data)
})

module.exports=router;