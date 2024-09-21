const express = require("express");
const path = require("path");
const app=express();

app.set("view engine","ejs");

app.use(express.urlencoded({extended:true}));

const Router = require("./Routers/Router");

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

app.use("/",Router);

app.listen(2500,() => {
    console.log("Server is running on port 2500");
});
