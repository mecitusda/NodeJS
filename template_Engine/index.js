const express=require("express");
const user_routers= require("./routes/user")
const admin_routers=require("./routes/admin")

var app=express();
app.use(express.urlencoded({extended:false}));

const path=require("path");
app.set("view engine","ejs");//vies engine oluşturduk.html uzantıları ejs uzantısına çevirdik.
                            //pathleri kaldırıp direk views'in altında aradığı için uzantıyı düzelttik.


app.use("/libs",(req,res,next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();},express.static(path.join(__dirname,"node_modules")));
    
app.use("/static",(req,res,next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
},express.static(path.join(__dirname,"public")));

app.use("/admin",admin_routers)
app.use(user_routers)



   

    
app.listen(200,console.log("dinlendi."))