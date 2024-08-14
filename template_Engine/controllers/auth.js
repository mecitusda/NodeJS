const bcrypt = require("bcrypt");
const csurf = require("csurf");
const tables = {
    blog : require("../models/blog"),
    category : require("../models/category"),
    navbaritems : require("../models/navbaritems"),
    pages : require("../models/pages"),
    users : require("../models/users")}
   

exports.register_get = async (req, res, next) => {
   
       res.render("../views/auth/register.ejs",{
        title: "Register",
        who_active: "Register",
        main_Page:"",
        eklendi: false,
       
    });
}

exports.register_post = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await tables.users.create({username:username,position:"kullanici",e_mail:email,password:hashedPassword});

    res.redirect("/account/login");
}

exports.login_get = async (req, res, next) => {
   
    const {iscreated=undefined} = req.session;
   
    
    res.render("../views/auth/login.ejs",{
        title: "Login",
        who_active: "Log In",
        main_Page:"",
        eklendi: false,
        csurfToken: req.csrfToken(),
    })
    delete req.session.iscreated;
   
}

exports.login_post = async (req, res, next) => {
    const { username, password } = req.body;
    const check_name = await tables.users.findOne({where:{username:username}});

    if(check_name){
      
        const check_pass = await bcrypt.compare(password, check_name.getDataValue("password"));
        
        if(check_pass){
            
            req.session.isAuth =  true;
            req.session.username = username;
            console.log("1")
            const url = req.query.returnUrl || "/";
            
            return res.redirect(url);
        }else{
            req.session.iscreated="wrongpass";
            console.log("2")

            const url=  (req.query.returnUrl ?"?returnUrl="+req.query.returnUrl:false) || "";
            return res.redirect("/account/login"+url);
        }
    }
    const url=  (req.query.returnUrl ?"?returnUrl="+req.query.returnUrl:false) || "";
    req.session.iscreated="wrongname";
    console.log("3")
    return res.redirect("/account/login"+url);
}

exports.logout_get = async (req, res, next) => {
    await req.session.destroy();
    return res.redirect("/");
}