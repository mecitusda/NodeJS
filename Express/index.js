const express=require("express");
const user_routers=require("./routes/user")
const admin_routers=require("./routes/admin")
var app=express();
const path=require("path");


app.use("/libs",express.static(path.join(__dirname,"node_modules")));
app.use("/static",express.static(path.join(__dirname,"public")));

app.use(admin_routers)
app.use(user_routers)


   

    
app.listen(322,console.log("dinlendi."))