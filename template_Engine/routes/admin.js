
const express=require("express");
const router =express.Router();
var i=1;

const data={
    title:"Anasayfa",
    categories:["Web Geliştirme","Mobil Uygulamalar","Veri Analizi","Programlama"],
    active_page:""
}

router.use("/admin/:adminid/edit/:isim",(req,res,next) => {
    console.log("Giriş ",(i++),req.params);
    
    res.render("admins/admin-edit",data)//Burada view engin kullandığımız için render otomatik olarak 
                                                               //views adlı klasör altında arama yapıyor.o yüzden views'i eklemeye
})                                                            //gerek yok.Dosya uzantılarınıda bilmesine gerek yok çünkü ejs uzantılı dosya istiyor zaten.

router.use("/admin/list",(req,res,next) => {


    res.render("admins/admin-list",data)
})
    
router.use("/admin",(req,res,next) => {
  
    
    res.render("admins/admin",data)
})

module.exports=router;