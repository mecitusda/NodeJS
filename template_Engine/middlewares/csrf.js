module.exports = (req,res,next) => {
    res.locals.csurfToken = req.csrfToken();
    next();
}