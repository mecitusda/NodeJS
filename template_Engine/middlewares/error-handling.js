module.exports = (err,req,res,next) => {
    res.status(500).render("error/500.ejs",{
        title: "500",
        who_active: "500",
        main_Page:"",
        message: err
    });
}