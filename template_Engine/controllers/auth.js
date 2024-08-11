const bcrypt = require("bcrypt");
const tables = {
    blog : require("../models/blog"),
    category : require("../models/category"),
    navbaritems : require("../models/navbaritems"),
    pages : require("../models/pages"),
    users : require("../models/users")}
   

exports.register_get = async (req, res, next) => {
    const page=await tables.pages.findOne({where:{page_name:"register"},attributes:["id"]}).then((pages) => {return pages.getDataValue("id")});;
    const nav_items = await tables.navbaritems.findAll({where:{page_id:page}});
   
    res.render("../views/auth/register.ejs",{
        title: "Register",
        who_active: "Register",
        main_Page:"",
        eklendi: false,
        nav_items:nav_items,
    });
}

exports.register_post = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await tables.users.create({username:username,position:"kullanici",e_mail:email,password:hashedPassword});

    res.redirect("/account/login");
}

exports.login_get = async (req, res, next) => {
    const {iscreated=undefined} = req.query;

    const page=await tables.pages.findOne({where:{page_name:"login"},attributes:["id"]}).then((pages) => {return pages.getDataValue("id")});;
    const nav_items = await tables.navbaritems.findAll({where:{page_id:page}});
    res.render("../views/auth/login.ejs",{
        title: "Login",
        who_active: "Log In",
        main_Page:"",
        eklendi: false,
        nav_items:nav_items,
        iscreated:iscreated
    });
}

exports.login_post = async (req, res, next) => {
    const { username, password } = req.body;
    const check_name = await tables.users.findOne({where:{username:username}});

    if(check_name){
      
        const check_pass = await bcrypt.compare(password, check_name.getDataValue("password"));
        if(check_pass){
            
            return res.redirect("/admin");
        }else{
            return res.redirect("/account/login?iscreated=wrongpass");
        }
    }
    return res.redirect("/account/login?iscreated=wrongname");
}