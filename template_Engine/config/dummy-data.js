const Category = require('../models/category');
const blog = require('../models/blog');
const Page = require('../models/pages');
async function populate () {
    //Blog
    blog.belongsTo(Category);
      
    
    //Category
    Category.hasMany(blog, {    
       foreignKey:{name:'id_category'}
     });
    

    //Syncs the models with the database
    Page.sync({ alter: true });
    blog.sync({ alter: true });
    Category.sync({ alter: true });
}

module.exports = populate;