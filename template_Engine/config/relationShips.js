const Category = require('../models/category');
const blog = require('../models/blog');
const Page = require('../models/pages');
const users=require('../models/users');
const role = require('../models/role');
async function populate () {
    Category.belongsToMany(blog, {through: 'blog_category'});
    blog.belongsToMany(Category, {through: 'blog_category'});
    users.hasMany(blog);
    blog.belongsTo(users);
    
    users.belongsToMany(role, {through: 'user_roles'});
    role.belongsToMany(users, {through: 'user_roles'});
}

module.exports = populate;