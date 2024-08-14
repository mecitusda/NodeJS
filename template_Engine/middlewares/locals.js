module.exports= function(req,res,next) {
    res.locals.isAuth =  req.session.isAuth;
    res.locals.username =  req.session.username;
    res.locals.iscreated= req.session.iscreated;
    res.locals.message= req.session.message;
    next();
}