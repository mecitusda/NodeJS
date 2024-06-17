
const express=require("express");
const router =express.Router();
const path=require("path");
router.use("/admin/:adminid/edit/:isim",(req,res,next) => {
    console.log(req.params);
   console.log(__dirname);
    
    res.sendFile(path.join(__dirname,"../views/admins","admin-edit.html"))
})

router.use("/admin/list",(req,res,next) => {

 
    res.sendFile(path.join(__dirname,"../views/admins","admin-list.html"))
})
    
router.use("/admin",(req,res,next) => {
  

    res.sendFile(path.join(__dirname,"../views/admins","admin.html"))
})

module.exports=router;