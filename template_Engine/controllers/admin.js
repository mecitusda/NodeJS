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

    const nav_items = await tables.navbaritems.findAll({where:{page_id:Admin_id}});
        
     

    res.render("admins/blog-list",{
        blogs:blogs,    
        title:"Blog List",
        nav_items:nav_items,
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
    const Admin_id=await tables.pages.findOne({where:{page_name:"Home_Admin"}}).then((pages) => {return pages.getDataValue("id")});
    const nav_items = await tables.navbaritems.findAll({where:{page_id:Admin_id}});
   
    res.render("admins/admin-category",{
        blogs:rows,
        title:"Admin",
        nav_items:nav_items,
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
     
    
    const Admin_id=await tables.pages.findOne({where:{page_name:"admin_Create_Blog"}}).then((pages) => {return pages.getDataValue("id")});
   console.log(Admin_id);
    const nav_items = await tables.navbaritems.findAll({where:{page_id:Admin_id}});
    

    res.render("admins/create-blog",{   
        title:"Create Blog",
        who_active:"Create Blog",
        nav_items:nav_items,
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
    const Admin_id=await tables.pages.findOne({where:{page_name:"admin_Create_Blog"}}).then((pages) => {return pages.getDataValue("id")});
    const nav_items = await tables.navbaritems.findAll({where:{page_id:Admin_id}});
  
    

    return res.render("admins/blog-list",{
        blogs:blogs,    
        title:"Blog List",
        nav_items:nav_items,
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
    const Admin_id=await tables.pages.findOne({where:{page_name:"admin_categories"}}).then((pages) => {return pages.getDataValue("id")});
    const nav_items = await tables.navbaritems.findAll({where:{page_id:Admin_id}});
  
    console.log("girdi")

    return res.render("admins/category-list",{
        categories:categories,    
        title:"Blog List",
        nav_items:nav_items,
        who_active:"All Blogs",
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
   
       
    const kullanicilar_id=await tables.pages.findOne({where:{page_name:"admin_edit"}}).then((pages) => {return pages.getDataValue("id")});

    const nav_items = await tables.navbaritems.findAll({where:{page_id:kullanicilar_id}});
   
    const categories= await tables.category.findAll({});
   

    if(!blog){
        return console.log("Blog bulunamadı.");
    }

    res.render("admins/edit-blog",{
        blog:blog,
        title:"Edit Blog",
        who_active:"Blog List",
        main_Page:"admin",
        nav_items:nav_items,
        categories:categories,
        iscreated:null
    
    });


}

exports.edit_category_get = async(req,res,next) => {
    const category = await tables.category.findOne({url:req.params.slug});
    
    const kullanicilar_id=await tables.pages.findOne({where:{page_name:"admin_edit"}}).then((pages) => {return pages.getDataValue("id")});
    const blogs= await category.getBlogs();
   
    const nav_items = await tables.navbaritems.findAll({where:{page_id:kullanicilar_id}});
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
        nav_items:nav_items
    });

};

exports.edit_category_post = async(req,res,next) => {
    const {name}=req.body;
    console.log("category_name",name);
    const update_category=await tables.category.update({name:name},{where:{id:req.params.categoryid}});
    const category = await tables.category.findByPk(req.params.categoryid);
    const blogs = await category.getBlogs();
    const kullanicilar_id=await tables.pages.findOne({where:{page_name:"admin_edit"}}).then((pages) => {return pages.getDataValue("id")});
    const nav_items = await tables.navbaritems.findAll({where:{page_id:kullanicilar_id}});
    if(!update_category){
        console.log("Kategori güncellenemedi.");
        return res.render("admins/edit-category",{
            blogs:blogs,
            category:category,
            title:"Edit Category",
            who_active:"Edit Category",
            main_Page:"admin",
            nav_items:nav_items,
            iscreated:true
        });
    }
    res.render("admins/edit-category",{
        blogs:blogs,
        category:category,
        title:"Edit Category",
        who_active:"Edit Category",
        main_Page:"admin",
        nav_items:nav_items,
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



    //site ayarları
    const kullanicilar_id=await tables.pages.findOne({where:{page_name:"admin_edit"}}).then((pages) => {return pages.getDataValue("id")});
    const nav_items = await tables.navbaritems.findAll({where:{page_id:kullanicilar_id}});
    const categories= await tables.category.findAll({});
    }
    res.redirect("/admin/blogs"    
);
    
   
   


}

exports.blog_with_id = async (req,res,next) => {
    
    const blog = await tables.blog.findAll({where:{url:req.params.slug}});
    const kullanicilar_id=await tables.pages.findOne({where:{page_name:"admin_blog"}}).then((pages) => {return pages.getDataValue("id")});
    const nav_items = await tables.navbaritems.findAll({where:{page_id:kullanicilar_id}});
    if (blog[0]) {
        return res.status(200).render("admins/admin-blog", {
            blog: blog,
            who_active: "Admin Blog",
            nav_items: nav_items,
            SelectedCategory:null,
            main_Page:"admin"
        });
    }
    
    res.status(200).redirect("/");
}

exports.add_admin_get = async(req,res,next) => {
   
    const Admin_id=await tables.pages.findOne({where:{page_name:"admin_add_admin"}}).then((pages) => {return pages.getDataValue("id")});
  
    const nav_items = await tables.navbaritems.findAll({where:{page_id:Admin_id}});
    
    res.render("admins/add-admin",{
        title:"Add Admin",
        nav_items:nav_items,
        who_active:"Add Admin",
        main_Page:"admin",
        eklendi:false
    })
}

exports.add_admin_post = async(req,res,next) => {
    console.log("Giriş ",(i++));
    const {username,email:temp_email,email_option,password}=req.body;
    email=temp_email+email_option;
    const Admin_id=await tables.pages.findOne({where:{page_name:"admin_add_admin"}}).then((pages) => {return pages.getDataValue("id")});
  
    const nav_items = await tables.navbaritems.findAll({where:{page_id:Admin_id}});

    const isExist=await tables.users.findOne({where:
          { [Op.or]: [{username:username},{e_mail:email}]}});
    
    console.log("isExist",isExist);
    if(isExist !== null){
        return res.render("admins/add-admin",{  
                     title:"Add Admin",
                     nav_items:nav_items,
                     who_active:"Add Admin",
                     main_Page:"admin",
                     eklendi:[true,message="kullanıcı adı veya email zaten var."]
                            })
    }
    const insert_user=await tables.users.create({username:username,e_mail:email,password:password,position:"Admin"});
    
    res.render("admins/add-admin",{
        title:"Add Admin",
        nav_items:nav_items,
        who_active:"add_admin",
        main_Page:"admin",
        eklendi:[true,message="Kullanıcı başarıyla eklendi."]

    })
}

exports.home = async (req,res,next) => {
    const {page = 0} = req.query;
    const {count,rows} = await tables.blog.findAndCountAll({where:{verify:1,home:1,isvisible:1},limit:parseInt(process.env.PAGE_SIZE),offset:parseInt(process.env.PAGE_SIZE)*page});
    const categories = await tables.category.findAll({});
    const Admin_id=await tables.pages.findOne({where:{page_name:"Home_Admin"}}).then((pages) => {return pages.getDataValue("id")});
    const nav_items = await tables.navbaritems.findAll({where:{page_id:Admin_id}});
    //res.cookie("test",1);
    //res.clearCookie("test");
   console.log(req.signedCookies);
    
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
}

exports.categories = async (req,res,next) => {
    const categories = await tables.category.findAll({});
    const Admin_id=await tables.pages.findOne({where:{page_name:"admin_categories"}}).then((pages) => {return pages.getDataValue("id")});
    const nav_items = await tables.navbaritems.findAll({where:{page_id:Admin_id}});
    res.render("admins/category-list",{
        categories:categories,
        title:"Admin",
        nav_items:nav_items,
        who_active:"Category List",
        main_Page:"admin"
    })
}

exports.create_category_get = async (req,res,next) => {
    const Admin_id=await tables.pages.findOne({where:{page_name:"admin_create_category"}}).then((pages) => {return pages.getDataValue("id")});
    const nav_items = await tables.navbaritems.findAll({where:{page_id:Admin_id}});
    res.render("admins/create-category",{
        title:"Create Category",
        nav_items:nav_items,
        who_active:"Create Category",
        main_Page:"admin",
        iscreated:null
    })
}

exports.create_category_post = async (req,res,next) => {
    const {name}=req.body;
    const url=slug(name);
    const insert_category=await tables.category.create({name:name,url:url});
    const Admin_id=await tables.pages.findOne({where:{page_name:"admin_create_category"}}).then((pages) => {return pages.getDataValue("id")});
    const nav_items = await tables.navbaritems.findAll({where:{page_id:Admin_id}});
    
    if(!insert_category){
        return res.render("admins/create-category",{
            title:"Create Category",
            nav_items:nav_items,
            who_active:"Create Category",
            main_Page:"admin",
            iscreated:false
        });
    }
    res.render("admins/create-category",{
        title:"Create Category",
        nav_items:nav_items,
        who_active:"Create Category",
        main_Page:"admin",
        iscreated:true
    })
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
    const blog = await tables.blog.findOne({where:{id:req.params.blogid},include:{model:tables.category}});
    await blog.removeCategories(req.params.categoryid);
    res.redirect("/admin/category/edit/"+req.params.categoryid);
}