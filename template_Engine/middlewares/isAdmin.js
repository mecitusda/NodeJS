module.exports = (req, res, next) => {
    if(!req.session.isAuth){
        return res.redirect("/account/login?returnUrl="+req.originalUrl);
    }
    if(!req.session.roles.includes("admin")){
        req.session.message={text:"Bu sayfayı görüntülemek için yetkili bir giriş yapınız.",type:"warning"};
        return res.redirect("/account/logout?returnUrl="+req.originalUrl);
    }
    next();
};
