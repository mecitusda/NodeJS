const express=require("express");
const router =express.Router();
var i=1;

const data={
    title:"Anasayfa",
    categories:["Web Geliştirme","Mobil Uygulamalar","Veri Analizi","Programlama"],
    blogs:[{
        id:1,
        title:"Komple Uygulamalı Web Geliştirme",
        content:"Sıfırdan ileri seviyeye 'Web Geliştirme': Html, Css, Sass, Flexbox, Bootstrap, Javascript, Angular, JQuery, Asp.Net Mvc&Core Mvc",
        picture:"1.jpeg",
        isvisible:true,
        verify:true,
    },{
        id:2,
        title:"Python ile Sıfırdan İleri Seviye Python Programlama",
        content:"Sıfırdan İleri Seviye Python Dersleri.Veritabanı,Veri Analizi,Bot Yazımı,Web Geliştirme(Django)",
        picture:"2.jpeg",
        isvisible:true,
        verify:true,
    },{
        id:3,
        title:"Sıfırdan İleri Seviye Modern Javascript Dersleri ES7+",
        content:"Modern javascript dersleri ile (ES6 & ES7+) Nodejs, Angular, React ve VueJs için sağlam bir temel oluşturun.",
        picture:"3.jpeg",
        isvisible:true,
        verify:true,  
    }]
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