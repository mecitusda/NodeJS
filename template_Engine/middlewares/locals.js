module.exports= function(req,res,next) {
    res.locals.isAuth =  req.session.isAuth;
    res.locals.username =  req.session.username;
    res.locals.iscreated= req.session.iscreated;
    res.locals.message= req.session.message;
    res.locals.roles = req.session.roles
    res.locals.isAdmin = req.session.roles ? req.session.roles.includes("admin")  : false;
    res.locals.isModerator =req.session.roles ? req.session.roles.includes("moderator") : false;
    next(); 
}