const Category = require('../models/category');
const blog = require('../models/blog');
const Page = require('../models/pages');
async function populate () {
   /*
    //Category
    Category.hasMany(blog, {    
       foreignKey:{name:'categoryId', allowNull: false},
       AllowNull: false
     });

      //Blog
    blog.belongsTo(Category);
    */

    Category.belongsToMany(blog, {through: 'blog_category'});
    blog.belongsToMany(Category, {through: 'blog_category'});
}

module.exports = populate;