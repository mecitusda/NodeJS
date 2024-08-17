const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const csurf = require("csurf");
const transporter = require("../helpers/mailer");
const crypto = require("crypto");
const { raw } = require("mysql2");
const tables = {
    blog : require("../models/blog"),
    category : require("../models/category"),
    navbaritems : require("../models/navbaritems"),
    pages : require("../models/pages"),
    users : require("../models/users")}
   

exports.register_get = async (req, res, next) => {
        const message= req.session.message;
        delete req.session.message;
       res.render("../views/auth/register.ejs",{
        title: "Register",
        who_active: "Register",
        main_Page:"",
        message: message,
    });
}

exports.register_post = async (req, res, next) => {
    const { username,email:temp_email,email_option, password } = req.body;
    email=temp_email+email_option;  
    const hashedPassword = await bcrypt.hash(password, 10);
    

    
    const isExist=await tables.users.findOne({where:
        { [Op.or]: [{username:username},{e_mail:email}]}});

    if(isExist !== null){
        req.session.message={text:"Bu kullanıcı adı veya e-mail adresi zaten kullanılmaktadır.",type:"danger"};
        return res.redirect("/account/register");
    }

    const user=await tables.users.create({username:username,position:"kullanici",e_mail:email,password:hashedPassword});
    req.session.message={text:"Başarıyla kayıt olunmuştur.",type:"success"};
    transporter.sendMail({
        from:transporter.options.auth.user,
        to:email,
        subject:"Kullanıcı kaydı",
        text:"Merhaba "+username+" kullanıcı kaydınız başarılı bir şekilde gerçekleştirilmiştir.\n\n  İyi günler dileriz."
    });
    res.redirect("/account/login");
}

exports.login_get = async (req, res, next) => {
   
    const message = req.session.message;
    delete req.session.message;
   
    
    res.render("../views/auth/login.ejs",{
        title: "Login",
        who_active: "Log In",
        main_Page:"",
        message: message,
    })
    
   
}

exports.login_post = async (req, res, next) => {
    const { username, password } = req.body;
    const check_name = await tables.users.findOne({where:{username:username}});

    if(check_name){
      
        const check_pass = await bcrypt.compare(password, check_name.getDataValue("password"));
        
        if(check_pass){
            const roles = await check_name.getRoles({attributes:["rolename"],raw:true});
           
            req.session.roles = roles.map(role => role["rolename"]);
            console.log("başlangıç",req.session.roles);
            req.session.userId = check_name.id;
            req.session.isAuth =  true;
            req.session.username = username;
          
            const url = req.query.returnUrl || "/";
            
            return res.redirect(url);
        }else{
            req.session.message={text:"Şifre hatalı",type:"danger"};
      

            const url=  (req.query.returnUrl ?"?returnUrl="+req.query.returnUrl:false) || "";
            return res.redirect("/account/login"+url);
        }
    }
    const url=  (req.query.returnUrl ?"?returnUrl="+req.query.returnUrl:false) || "";
    req.session.message={text:"Kullanıcı adı hatalı",type:"danger"};
    
    return res.redirect("/account/login"+url);
}

exports.logout_get = async (req, res, next) => {
    await req.session.destroy();
    return res.redirect("/");
}

exports.forgot_get = async (req, res, next) => {
    const message = req.session.message;
    delete req.session.message;
    res.render("../views/auth/forgot.ejs",{
        title: "Forgot Password",
        who_active: "Forgot Password",
        main_Page:"",
        message: message,
    });
}

exports.forgot_post = async (req, res, next) => {  
    const { email } = req.body;
    const isExist=await tables.users.findOne({where:{e_mail:email}});
    if(!isExist){
        req.session.message={text:"Bu e-mail adresi ile kayıtlı bir kullanıcı bulunamadı.",type:"danger"};
    
        return res.redirect("/account/forgot-password");
    }
    const token = crypto.randomBytes(32).toString("hex");
    isExist.resetToken = token;
    isExist.resetTokenExpiration = Date.now() + (1000*60*60*24);//1 day
    await isExist.save();
    transporter.sendMail({
        from:transporter.options.auth.user,
        to:email,
        subject:"Şifre Sıfırlama",
        html:`<h1>Şifre Sıfırlama</h1>
        <p>Şifrenizi sıfırlamak için tıklayınız</p><a href="http://127.0.0.1:200/account/reset-password/${token}"></a>`
    });
    req.session.message={text:"Şifrenizi sıfırlamak için eposta adresinize kontrol ediniz.",type:"success"};
    
    res.redirect("/account/login");
}

exports.reset_get = async (req, res, next) => {
    const token = req.params.token;
    const user = await tables.users.findOne({where:{resetToken:token,resetTokenExpiration:{[Op.gt]:Date.now()}}});


    if(!user){
        req.session.message={text:"This action has expired!",type:"danger"};
        return res.redirect("/account/login");
    }
    req.session.message={text:"Please enter your new password",type:"warning"};
    res.render("../views/auth/reset.ejs",{
        title: "Reset Password",
        who_active: "Reset Password",
        main_Page:"",
        username: user.username,
        
    });
}


exports.reset_post = async (req, res, next) => {
    const { password, username,token } = req.body;
    const user = await tables.users.findOne({where:{username:username}});
    if(!user){
        req.session.message={text:"An error occurred.",type:"danger"};
        return res.redirect("/account/login");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();
    req.session.message={text:"Your password has been changed successfully.",type:"success"};
    res.redirect("/account/login");
}