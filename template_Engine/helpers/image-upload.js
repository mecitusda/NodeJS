const multer = require("multer");
path = require("path");
const storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"./public/images");
    },
    filename: function(req,file,cb){
        cb(null,path.parse(file.originalname)+"-"+Date.now()+path.extname(file.originalname));
    }
})

const upload=multer({
    storage:storage,
});

module.exports.upload = upload;