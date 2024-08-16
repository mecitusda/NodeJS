const { Op } = require("sequelize");
const slug = require("../helpers/slugfield");
const transporter = require("../helpers/mailer");
const { text } = require("stream/consumers");
const { type } = require("os");
const tables = {
    blog : require("../models/blog"),
    category : require("../models/category"),
    navbaritems : require("../models/navbaritems"),
    pages : require("../models/pages"),
    users : require("../models/users")
};

exports.blogs = async (req,res,next) => {
    const message = req.session.message;
    delete req.session.message;
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
    req.message=req.session.message;
    delete req.session.message;
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
    req.session.message={text:"#"+req.params.blogid+" numaralı blog başarıyla silindi.",type:"success"};
    return res.redirect("/admin/blogs")
    
    
}

exports.delete_category = async(req,res,next) => {

    if(req.params.categoryid === undefined){
        return res.status(404).send("Blog id bulunamadı.");
    }
    
    const delete_category=await tables.category.destroy({where:{id:req.params.categoryid}});
    const categories= await tables.category.findAll({});
    
    req.session.message={text:"Kategori başarıyla silindi.",type:"success"};
    return res.redirect("/admin/categories")
    
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
    req.session.message={text:"Blog başarıyla oluşturuldu.",type:"success"};
   
    res.redirect("/admin/blog/create");
}   

exports.edit_blog_get = async(req,res,next) => {
    const message=req.session.message;
    delete req.session.message;
    const blog = await tables.blog.findOne({where:{
        url:req.params.slug},
        include:{
        model:tables.category,  //burada bloğun kategorilerini çekiyoruz.
        attributes:["id"]
        }});
   
    const categories= await tables.category.findAll({});
   

    if(!blog){
        req.session.message={text:"Blog bulunamadı.",type:"danger"};
        return req.redirect("/admin/blogs");
    }

    res.render("admins/edit-blog",{
        blog:blog,
        title:"Edit Blog",
        who_active:"Blog List",
        main_Page:"admin",
        categories:categories,
        message:message
    });


}

exports.edit_category_get = async(req,res,next) => {
    const message=req.session.message;
    delete req.session.message;
    const category = await tables.category.findOne({where:{url:req.params.slug}});

    const blogs = await category.getBlogs();
    if(!category){
        req.session.message={text:"Kategori bulunamadı.",type:"danger"};
        return redirect("/admin/categories");
    }
    res.render("admins/edit-category",{
        blogs:blogs,
        category:category,
        title:"Edit Category",
        who_active:"Category List",
        main_Page:"admin",
        message:message
    });

};

exports.edit_category_post = async(req,res,next) => {
    const {name}=req.body;
    const update_category=await tables.category.update({name:name},{where:{url:req.params.slug}});
   
    if(!update_category){
        req.session.message={text:"Kategori güncellenemedi.",type:"danger"};
        return res.redirect("/admin/categories");
    }
    req.session.message={text:"Kategori başarıyla güncellendi.",type:"success"};
    res.redirect("/admin/categories");
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
    req.session.message={text:"#"+blog.id+" numaralı blog başarıyla güncellendi.",type:"success"};
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
   const message = req.session.message;
   delete req.session.message;
    res.render("admins/add-admin",{
        title:"Add Admin",
        who_active:"Add Admin",
        main_Page:"admin",
        message:message
    })
}

exports.add_admin_post = async(req,res,next) => {
    
    const {username,email:temp_email,email_option,password}=req.body;
    email=temp_email+email_option;
    const isExist=await tables.users.findOne({where:
          {[Op.or]: [{username:username},{e_mail:email}]}});
    
    if(isExist !== null){
        req.session.message={text:"Kullanıcı adı veya email zaten var.",type:"danger"};
        return res.redirect("/admin/add_admin");
    }   
    const insert_user=await tables.users.create({username:username,e_mail:email,password:password,position:"Admin"});
    transporter.sendMail({
        from:transporter.options.auth.user,
        to:email,
        subject:"Admin kaydı eklendi.",
        text:"Merhaba "+username+" admin olarak kaydınız yapıldı."
    });
    req.session.message={text:"Kullanıcı başarıyla eklendi.",type:"success"};
    
    res.redirect("/admin/add_admin");
 
}

exports.home = async (req,res,next) => {
 
    res.redirect("/");
    
}

exports.categories = async (req,res,next) => {
    const message=req.session.message;
    delete req.session.message;
    const categories = await tables.category.findAll({});
    res.render("admins/category-list",{
        categories:categories,
        title:"Admin",
        who_active:"Category List",
        main_Page:"admin",
        message:message
    })
}

exports.create_category_get = async (req,res,next) => {
    const message = req.session.message
    delete req.session.message;
    
    res.render("admins/create-category",{
        title:"Create Category",
        who_active:"Create Category",
        main_Page:"admin",
        message:message
    })
}

exports.create_category_post = async (req,res,next) => {
    const {name}=req.body;
    const url=slug(name);
    const insert_category=await tables.category.create({name:name,url:url});
    if(!insert_category){
        req.session.message={text:"Kategori oluşturulamadı.",type:"danger"};
        return res.redirect("/admin/category/create");
    }
    req.session.message={text:"Kategori başarıyla oluşturuldu.",type:"success"};
    res.redirect("/admin/category/create");
};

exports.delete_category = async(req,res,next) => {
    if(req.params.categoryid === undefined){
        return res.status(404).send("cannot find the category.");
    }
    
    const delete_category=await tables.category.destroy({where:{id:req.params.categoryid}});
    req.session.message={text:req.params.categoryid+" numaralı kategori başarıyla silindi.",type:"success"};
    res.redirect("/admin/categories");
}

exports.remove_category = async(req,res,next) => {
    const blog = await tables.blog.findOne({where:{url:req.params.blogurl},include:{model:tables.category}});
    const categoryid=await tables.category.findOne({where:{url:req.params.categoryurl},attributes:["id"]});
    await blog.removeCategories(categoryid);
  
    res.redirect("/admin/category/edit/"+{slug:req.params.categoryurl}.slug);
}