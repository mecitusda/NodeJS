//express modules
const express=require("express");
var app=express();

const cookie = require("cookie-parser");
const session = require("express-session");
var SequelizeStore = require('connect-session-sequelize')(session.Store);
const csurf = require("csurf");

//node modules
const path=require("path");

// routers
const auth = require("./routes/auth");
const user_routers= require("./routes/user")
const admin_routers=require("./routes/admin")


//custom modules
const locals = require("./middlewares/locals");
const db=require("./config/db")



//view engine
app.set("view engine","ejs");//vies engine oluşturduk.html uzantıları ejs uzantısına çevirdik.
                            //pathleri kaldırıp direk views'in altında aradığı için uzantıyı düzelttik.



//models
const update_relationShips = require("./config/relationShips");

     
//middleware
app.use(express.urlencoded({extended:true}));
app.use(cookie());
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:true,
    saveUninitialized:true,
    cookie:{
        maxAge:1000*60*60*24//As long as 1 day
    },
    store:new SequelizeStore({
        db:db
    })
}))
app.use(csurf());//csurf ya session yada cookie kullandığı için onlardan sonra kullanılmalı


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





                       

(async () => {
    await update_relationShips();
    await db.sync({alter:true});
})()


app.use(locals)
app.use("/admin",admin_routers)
app.use(user_routers)
app.use("/account",auth)

    
  
app.listen(200,console.log("dinlendi."))