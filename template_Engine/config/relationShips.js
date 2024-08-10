const Category = require('../models/category');
const blog = require('../models/blog');
const Page = require('../models/pages');
const users=require('../models/users');
async function populate () {
    Category.belongsToMany(blog, {through: 'blog_category'});
    blog.belongsToMany(Category, {through: 'blog_category'});
    users.hasMany(blog);
    blog.belongsTo(users);
    
}

module.exports = populate;