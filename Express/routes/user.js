
const express=require("express");
const router =express.Router();
const path=require("path");
router.use("/kullanicilar/:kullaniciid/detaylar/:isim",(req,res,next) => {
    console.log(req.params);
   console.log(__dirname);
    
    res.sendFile(path.join(__dirname,"../views/users","user-details.html"))
})

router.use("/kullanicilar",(req,res,next) => {

 
    res.sendFile(path.join(__dirname,"../views/users","users.html"))
})
    
router.use("/",(req,res,next) => {
  

    res.sendFile(path.join(__dirname,"../views/users","index.html"))
})

module.exports=router;