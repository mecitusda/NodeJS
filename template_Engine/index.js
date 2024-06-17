const express=require("express");
const user_routers=require("./routes/user")
const admin_routers=require("./routes/admin")

var app=express();
const path=require("path");
app.set("view engine","ejs");//vies engine oluşturduk.html uzantıları ejs uzantısına çevirdik.
                            //pathleri kaldırıp direk views'in altında aradığı için uzantıyı düzelttik.


app.use("/libs",express.static(path.join(__dirname,"node_modules")));
app.use("/static",express.static(path.join(__dirname,"public")));

app.use(admin_routers)
app.use(user_routers)


   

    
app.listen(322,console.log("dinlendi."))