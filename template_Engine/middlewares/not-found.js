module.exports = (req,res) => {
    res.status(404).render("error/not-found.ejs",{
        title: "404",
        who_active: "404",
        main_Page:""
    });
    
}