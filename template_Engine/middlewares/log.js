module.exports = (err,req,res,next) => {
    next(err+"Log edildi.");
    next(err);
}
