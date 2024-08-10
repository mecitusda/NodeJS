const tables = {
    blog : require("../models/blog"),
    category : require("../models/category"),
    navbaritems : require("../models/navbaritems"),
    pages : require("../models/pages"),
    users : require("../models/users")}
   

exports.register_get = async (req, res, next) => {
    const page=await tables.pages.findOne({where:{page_name:"register"},attributes:["id"]});
    nav_items = await tables.navbaritems.findAll({where:{page_id:page}});
    res.render("../views/auth/register.ejs",{
        title: "Register",
        who_active: "Register",
        main_Page:"register",
        eklendi: false,
    });
}

exports.register_post = async (req, res, next) => {
    const { username, email, password } = req.body;
    await tables.users.create({username:username,position:"kullanici",e_mail:email,password:password});

    res.redirect("/login");
}

exports.login_get = async (req, res, next) => {
    const page=await tables.pages.findOne({where:{page_name:"login"},attributes:["id"]});
    nav_items = await tables.navbaritems.findAll({where:{page_id:page}});
    res.render("../views/auth/login.ejs",{
        title: "Login",
        who_active: "Login",
        main_Page:"login",
        eklendi: false,
    });
}