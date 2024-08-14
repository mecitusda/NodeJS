const { Op } = require("sequelize");
const slug = require("../helpers/slugfield");
var i=1;
var a=1;
const tables = {
    blog : require("../models/blog"),
    category : require("../models/category"),
    navbaritems : require("../models/navbaritems"),
    pages : require("../models/pages"),
    users : require("../models/users")
};

exports.blogs = async (req,res,next) => {
   
    const blogs= await tables.blog.findAll(
        {include:{
            model:tables.category,
            attributes:["name"]
        }});
    

    const Admin_id=await tables.pages.findOne({where:{page_name:"admin_Create_Blog"}}).then((pages) => {return pages.getDataValue("id")});
        
     

    res.render("admins/blog-list",{
        blogs:blogs,    
        title:"Blog List",
        who_active:"Blog List",
        main_Page:"admin",
        SelectedCategory:null
    })

}

exports.blogcategory_with_id = async (req,res,next) => {   
    const { page = 0 } = req.query; 
    const slug = req.params.slug;
    const {rows,count} = (await tables.blog.findAndCountAll({include:{model:tables.category,where:{url:slug}},limit:parseInt(process.env.PAGE_SIZE),offset:parseInt(process.env.PAGE_SIZE)*page}));
    
    const categories = await tables.category.findAll({});

   
    res.render("admins/admin-category",{
        blogs:rows,
        title:"Admin",
        who_active:"",
        main_Page:"admin",
        categories:categories,
        SelectedCategory:req.params.slug,
        currentPage:page,
        item_count:count,
        countPage:Math.ceil(count/parseInt(process.env.PAGE_SIZE))
    })
    }

exports.create_blog_get = async (req,res,next) => {
    const categories= await tables.category.findAll({});

    res.render("admins/create-blog",{   
        title:"Create Blog",
        who_active:"Create Blog",
        categories:categories,
        iscreated:req.query.variable,
        main_Page:"admin"
    })
}

exports.delete_blog = async(req,res,next) => {
    
    if(req.params.blogid === undefined){
        return res.status(404).send("Blog id bulunamadı.");
    }
    
    const delete_blog=await tables.blog.destroy({where:{id:req.params.blogid}});
    const blogs= await tables.blog.findAll({include:{model:tables.category}});

    return res.render("admins/blog-list",{
        blogs:blogs,    
        title:"Blog List",
        who_active:"All Blogs",
        main_Page:"admin",
        SelectedCategory:null
    })
    
    
}

exports.delete_category = async(req,res,next) => {

    if(req.params.categoryid === undefined){
        return res.status(404).send("Blog id bulunamadı.");
    }
    
    const delete_category=await tables.category.destroy({where:{id:req.params.categoryid}});
    const categories= await tables.category.findAll({});
 

    return res.render("admins/category-list",{
        categories:categories,    
        title:"Blog List",
        who_active:"Blog List",
        main_Page:"admin",
    })
    
};

exports.create_blog_post = async (req,res,next) => {
 
    const {baslik,aciklama,resim,category,altyazi}=req.body;
    const verify=req.body.verify == "on" ? true : false;
    const home=req.body.home == "on" ? true : false;
    const isvisible=req.body.isvisible == "on" ? true : false;
    const url=slug(baslik);
    const categoriler=req.body.categories;

    const insert_blog=await tables.blog.create({title:baslik,explanation:aciklama,picture:resim,categoryId:category,home:home,verify:verify,isvisible:isvisible,url:url,subtitle:altyazi});

    if(categoriler !== undefined){
    const selectedCategories = await tables.category.findAll({where:{
        id: {[Op.in]:categoriler}
  }});
   insert_blog.addCategories(selectedCategories);
}
   
    res.redirect("/admin/blog/create?variable=${true}");
}   

exports.edit_blog_get = async(req,res,next) => {
    const blog = await tables.blog.findOne({where:{
        url:req.params.slug},
        include:{
        model:tables.category,  //burada bloğun kategorilerini çekiyoruz.
        attributes:["id"]
        }});
   
    const categories= await tables.category.findAll({});
   

    if(!blog){
        return console.log("Blog bulunamadı.");
    }

    res.render("admins/edit-blog",{
        blog:blog,
        title:"Edit Blog",
        who_active:"Blog List",
        main_Page:"admin",
        categories:categories,
        iscreated:null
    
    });


}

exports.edit_category_get = async(req,res,next) => {
    const category = await tables.category.findOne({where:{url:req.params.slug}});

    const blogs = await category.getBlogs();
    if(!category){
        return console.log("Kategori bulunamadı.");
    }
  
    res.render("admins/edit-category",{
        blogs:blogs,
        category:category,
        iscreated:null,
        title:"Edit Category",
        who_active:"Category List",
        main_Page:"admin",
    });

};

exports.edit_category_post = async(req,res,next) => {
    const {name}=req.body;
    console.log("category_name",name);
    const update_category=await tables.category.update({name:name},{where:{id:req.params.categoryid}});
    const category = await tables.category.findByPk(req.params.categoryid);
    const blogs = await category.getBlogs();
    if(!update_category){
        console.log("Kategori güncellenemedi.");
        return res.render("admins/edit-category",{
            blogs:blogs,
            category:category,
            title:"Edit Category",
            who_active:"Edit Category",
            main_Page:"admin",
            iscreated:true
        });
    }
    res.render("admins/edit-category",{
        blogs:blogs,
        category:category,
        title:"Edit Category",
        who_active:"Edit Category",
        main_Page:"admin",
        iscreated:true
    });
    
};

exports.edit_blog_post = async(req,res,next) => {
    const {baslik,aciklama,resim,altyazi}=req.body;
    const verify=req.body.verify == "on" ? true : false;
    const home=req.body.home == "on" ? true : false;
    const isvisible=req.body.isvisible == "on" ? true : false;
    const categoriler=req.body.categories;
    
    
 

    const blog = await tables.blog.findOne({where:{url:req.params.slug},include:{
        model:tables.category,  //burada bloğun kategorilerini çekiyoruz.
        attributes:["id"]
        }
    });
    
    if(blog){
        blog.title=baslik;
        blog.explanation=aciklama;
        blog.picture=resim;
        blog.home=home;
        blog.verify=verify;
        blog.isvisible=isvisible;
        blog.subtitle=altyazi;
        
 
            if(categoriler === undefined){
            await blog.removeCategories(blog.categories)
           
        }
        else{
            await blog.removeCategories(blog.categories);
            
            const selectedCategories = await tables.category.findAll({where:{
                id: {[Op.in]:categoriler}
          }});
          
            await blog.addCategories(selectedCategories);
            
        }   

        await blog.save();
    const categories= await tables.category.findAll({});
    }
    res.redirect("/admin/blogs"    
);
    
   
   


}

exports.blog_with_id = async (req,res,next) => {
    
    const blog = await tables.blog.findAll({where:{url:req.params.slug}});
    if (blog[0]) {
        return res.status(200).render("admins/admin-blog", {
            blog: blog,
            who_active: "Admin Blog",
            SelectedCategory:null,
            main_Page:"admin"
        });
    }
    
    res.status(200).redirect("/");
}

exports.add_admin_get = async(req,res,next) => {
   const iscreated = req.session.iscreated || undefined;
   const message = req.session.message || undefined;
   if(req.session.iscreated || req.session.message){
       delete req.session.iscreated;
       delete req.session.message;}

    res.render("admins/add-admin",{
        title:"Add Admin",
        who_active:"Add Admin",
        main_Page:"admin",
        iscreatedt:iscreated,
        messaget:message
    })
}

exports.add_admin_post = async(req,res,next) => {
    
    const {username,email:temp_email,email_option,password}=req.body;
    email=temp_email+email_option;
    const isExist=await tables.users.findOne({where:
          { [Op.or]: [{username:username},{e_mail:email}]}});
    
    if(isExist !== null){
        req.session.message="kullanıcı adı veya email zaten var.";
        req.session.iscreated=false
        return res.redirect("/admin/add_admin");
       /* return res.render("admins/add-admin",{  
                     title:"Add Admin",
                     who_active:"Add Admin",
                     main_Page:"admin",
                     eklendi:[true,message="kullanıcı adı veya email zaten var."]
                            })*/
    }   
    const insert_user=await tables.users.create({username:username,e_mail:email,password:password,position:"Admin"});
    req.session.message="Kullanıcı başarıyla eklendi.";
    req.session.iscreated=true;
    res.redirect("/admin/add_admin");
    /*
    res.render("admins/add-admin",{
        title:"Add Admin",
        who_active:"add_admin",
        main_Page:"admin",
        eklendi:[true,message="Kullanıcı başarıyla eklendi."]

    })*/
}

exports.home = async (req,res,next) => {
   /* const {page = 0} = req.query;
    const {count,rows} = await tables.blog.findAndCountAll({where:{verify:1,home:1,isvisible:1},limit:parseInt(process.env.PAGE_SIZE),offset:parseInt(process.env.PAGE_SIZE)*page});
    const categories = await tables.category.findAll({});
    const Admin_id=await tables.pages.findOne({where:{page_name:"Home_Admin"}}).then((pages) => {return pages.getDataValue("id")});
    const nav_items = await tables.navbaritems.findAll({where:{page_id:Admin_id}});
    //res.cookie("test",1);
    //res.clearCookie("test");
   
    
    res.render("admins/admin",{
        blogs:rows,
        title:"Admin",
        nav_items:nav_items,
        who_active:"",
        main_Page:"admin",
        categories:categories,
        SelectedCategory:null,
        currentPage:page,
        item_count:count,
        countPage:Math.ceil(count/parseInt(process.env.PAGE_SIZE))
    })
        */
    res.redirect("/");
    
}

exports.categories = async (req,res,next) => {
    const categories = await tables.category.findAll({});
    res.render("admins/category-list",{
        categories:categories,
        title:"Admin",
        who_active:"Category List",
        main_Page:"admin"
    })
}

exports.create_category_get = async (req,res,next) => {
    const {iscreated = null } = req.session.package || {};
    if(iscreated !== null){
        delete req.session.package;
    }
    res.render("admins/create-category",{
        title:"Create Category",
        who_active:"Create Category",
        main_Page:"admin",
        iscreated:iscreated
    })
}

exports.create_category_post = async (req,res,next) => {
    const {name}=req.body;
    const url=slug(name);
    const insert_category=await tables.category.create({name:name,url:url});
    if(!insert_category){
        req.session.package={iscreated:false};
        return res.redirect("/admin/category/create");
    }
    req.session.package={iscreated:true};
    res.redirect("/admin/category/create");
};

exports.delete_category = async(req,res,next) => {
    if(req.params.categoryid === undefined){
        return res.status(404).send("cannot find the category.");
    }
    console.log("id:",req.params.categoryid);
    const delete_category=await tables.category.destroy({where:{id:req.params.categoryid}});
    res.redirect("/admin/categories");
}

exports.remove_category = async(req,res,next) => {
    const blog = await tables.blog.findOne({where:{url:req.params.blogurl},include:{model:tables.category}});
    const categoryid=await tables.category.findOne({where:{url:req.params.categoryurl},attributes:["id"]});
    await blog.removeCategories(categoryid);
  
    res.redirect("/admin/category/edit/"+{slug:req.params.categoryurl}.slug);
}