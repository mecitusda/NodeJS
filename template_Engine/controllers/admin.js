const { Op } = require("sequelize");
const slug = require("../helpers/slugfield");
const transporter = require("../helpers/mailer");
const db = require("../config/db");
const fs = require("fs");

const tables = {
    blog : require("../models/blog"),
    category : require("../models/category"),
    navbaritems : require("../models/navbaritems"),
    pages : require("../models/pages"),
    users : require("../models/users"),
    roles : require("../models/role")
};

exports.blogs = async (req,res,next) => {
    const message = req.session.message;
    delete req.session.message;
    const isModerator = req.session.roles.includes("moderator");
    const isAdmin = req.session.roles.includes("admin");
    console.log("isModerator",isModerator,"isAdmin",isAdmin);
    const blogs= await tables.blog.findAll(
        {include:{
            model:tables.category,
            attributes:["name"],}
            ,
            where:((isModerator && !isAdmin)|| (!isModerator && !isAdmin) ) ? {userId:req.session.userId} : null // its cancel the line if the condition is false
            });
    
        
     

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
    const message=req.session.message;
    delete req.session.message;
    try{ 
    const categories= await tables.category.findAll({});

    res.render("admins/create-blog",{   
        title:"Create Blog",
        who_active:"Create Blog",
        categories:categories,
        iscreated:req.query.variable,
        main_Page:"admin",
        values:message
    })
}catch(err){
    console.log(err);
}
   
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
    
    const {baslik,aciklama,category,altyazi}=req.body;
    const resim=req.file ? req.file.filename : "default.jpg";
    const verify=req.body.verify == "on" ? true : false;
    const home=req.body.home == "on" ? true : false;
    const isvisible=req.body.isvisible == "on" ? true : false;
    const url=slug(baslik);
    const categoriler=req.body.categories;
    const userId=req.session.userId;

    try{
    if(baslik==""){
        throw new Error("Başlık boş olamaz.");
    }
    if(baslik.length < 5 || baslik.length > 30){
        throw new Error("Başlık 5-30 karakter arasında olmalıdır.");
    }

    if(aciklama==""){
        throw new Error("Açıklama boş olamaz.");
    }
    if(categoriler === undefined){
        throw new Error("Kategori seçmelisiniz.");
    }
    if(resim==""){
        resim="default.jpg";
    }
   


    const insert_blog=await tables.blog.create({title:baslik,explanation:aciklama,picture:resim,categoryId:category,home:home,verify:verify,isvisible:isvisible,url:url,subtitle:altyazi,userId:userId});

    if(categoriler !== undefined){

    const selectedCategories = await tables.category.findAll({where:{
        id: {[Op.in]:categoriler}
  }});
   insert_blog.addCategories(selectedCategories);
   req.session.message={text:"Blog başarıyla oluşturuldu.",type:"success"};
   res.redirect("/admin/blog/create");
}   
}catch(err){
    let errormessage="";
    if(err instanceof Error){
        errormessage+=err.message;
    }
    req.session.message={text:errormessage,type:"danger",subtitle:altyazi,title:baslik,explanation:aciklama,picture:resim,categories:categoriler,home:home,verify:verify,isvisible:isvisible};
    
    res.redirect("/admin/blog/create");
}
    
   
   
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
    const {baslik,aciklama,altyazi}=req.body;
    const verify=req.body.verify == "on" ? true : false;
    const home=req.body.home == "on" ? true : false;
    const isvisible=req.body.isvisible == "on" ? true : false;
    const categoriler=req.body.categories;
    let resim ="";
    if(req.file){
        resim=req.file.filename;
        fs.unlink("./public/images/"+req.body.resim, (err) => {console.log("resim hatası"+err)});
    }
    if(resim === ""){
        resim="default.jpg";
    }
  
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

exports.create_user_get = async(req,res,next) => {
   const message = req.session.message;
   delete req.session.message;
    res.render("admins/create-user",{
        title:"Add Admin",
        who_active:"Add Admin",
        main_Page:"admin",
        message:message
    })
}

exports.create_user_post = async(req,res,next) => {
    
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
    
    res.redirect("/admin/user/create");
 
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

exports.roles = async (req,res,next) => {
    const message=req.session.message;
    delete req.session.message;
    console.log("Message "+message);
    try{
        
        const roles = await tables.roles.findAll({
            attributes:['id','rolename',[db.fn('COUNT',db.col('users.id')),'user_count'],'createdAt','updatedAt'],
            include:{
                model:tables.users,
                attributes:['id']
            },
            group:['role.id'],
            raw:true
        });
        res.render("admins/roles",{
            roles:roles,
            title:"Roles",
            who_active:"Roles",
            main_Page:"admin",
            message:message
        });
    }
    catch(err){
        console.log(err);
    };
};

exports.edit_role_get = async (req,res,next) => {
    const roleid=req.params.slug;
    const message=req.session.message;
    delete req.session.message;
    try{
        const role = await tables.roles.findOne({where:{id:roleid},
            include:{
                model:tables.users,
                attributes:['id','username','e_mail'],
                raw:true
            }
        });
        res.render("admins/edit-role",{
            role:role,
            title:"Edit Role",
            who_active:"Roles",
            main_Page:"admin",
            message:message
        });

    }catch(err){
        console.log(err);
    }
};

exports.edit_role_post = async (req,res,next) => {
    const {_roleid,_rolename}=req.body;
    try{
        const update_role = await tables.roles.update({rolename:_rolename},{where:{id:_roleid}});
        if(!update_role){
            req.session.message={text:"Rol güncellenemedi.",type:"danger"};
            return res.redirect("/admin/role/edit/"+_roleid);
        }
        req.session.message={text:"Rol başarıyla güncellendi.",type:"success"};
        res.redirect("/admin/role/edit/"+_roleid);
    }
    catch(err){
        console.log(err);
    }

    
};

exports.delete_role = async (req,res,next) => {
    const roleid=req.params.roleid;
   
    try{
        const delete_role = await tables.roles.destroy({where:{id:roleid}});
        req.session.message={text:"Rol başarıyla silindi.",type:"success"};
        res.redirect("/admin/roles");
        
    }
    catch(err){
        console.log(err);
    }
   
};

exports.remove_role = async (req,res,next) => {
    const {_roleid,_userid}=req.body;
    const role = await tables.roles.findByPk(_roleid);
    await role.removeUsers(_userid);
    req.session.message={text:"Kullanıcı başarıyla "+role.rolename+" rolünden çıkarıldı.",type:"success"};
    res.redirect("/admin/role/edit/"+_roleid);
};

exports.create_role_get = async (req,res,next) => {
    const message=req.session.message;
    delete req.session.message;
 
    res.render("admins/create-role",{
        title:"Create Role",
        who_active:"Create Role",
        main_Page:"admin",
        message:message
    });

}

exports.create_role_post = async (req,res,next) => {
    const {_rolename}=req.body;
    try{
        const insert_role = await tables.roles.create({rolename:_rolename});
        if(!insert_role){
            req.session.message={text:"Rol oluşturulamadı.",type:"danger"};
            return res.redirect("/admin/role/create");
        }
        req.session.message={text:"Rol başarıyla oluşturuldu.",type:"success"};
        res.redirect("/admin/role/create");
    }catch(err){
        console.log(err);
    }
}

exports.users_get = async (req,res,next) => {
    const message=req.session.message;
    delete req.session.message;
    try{    
        const {rows,count} = await tables.users.findAndCountAll({
            attributes:['id','username','e_mail','createdAt','updatedAt'],
            include:{model:tables.roles,attributes:['id','rolename']},
            
        });

        res.render("admins/user-list",{
            users:rows,
            title:"Users",
            who_active:"Users",
            main_Page:"admin",
            message:message,
            count:count
        });
    }catch(err){
        console.log(err);
    }
}

exports.delete_user = async (req,res,next) => {
    const {_userid}=req.body;
    try{
        const delete_user = await tables.users.destroy({where:{id:_userid}});
        req.session.message={text:"Kullanıcı başarıyla silindi.",type:"success"};
        res.redirect("/admin/users");}
    catch(err){
        console.log(err);
    }

}

exports.edit_user_get = async (req,res,next) => {
    const userid=req.params.userid;
    const message=req.session.message;
    delete req.session.message;
    
    try{
        const user = await tables.users.findOne({where:{id:userid},
            include:{
                model:tables.roles,
                attributes:['id','rolename'],
            }
        });
        const roles = await tables.roles.findAll({raw:true});
        res.render("admins/edit-user",{
            user:user,
            roles:roles,
            title:"Edit User",
            who_active:"Users",
            main_Page:"admin",
            message:message
        });
    }catch(err){
        console.log(err);
    }
}


exports.edit_user_post = async (req,res,next) => {
    const {_userid,_username,_email}=req.body;
    const role = req.body.roles;
   
    try{
        console.log("roles",role);
        const user = await tables.users.findOne(
            {where:{id:_userid},
            include:{
                model:tables.roles,
                attributes:["id","rolename"]
            }
        });
        
        
        if(user){
            user.username=_username;
            user.e_mail=_email;
            console.log("roles",role);
            if(role == undefined){
                await user.removeRoles(user.roles);
                
            }
            else{
                await user.removeRoles(user.roles);
              
                const selectedRoles = await tables.roles.findAll({where:{
                    id: {[Op.in]:role}
                }});

                await user.addRoles(selectedRoles);
            
            }
            
           
            await user.save();
            await user.reload(); 
            delete req.session.roles
            req.session.roles = user.roles.map(role => role["rolename"]);
            req.session.message={text:"Kullanıcı başarıyla güncellendi.",type:"success"};
            return res.redirect("/admin/user/edit/"+_userid);
        }
        req.session.message={text:"Kullanıcı bilgileri değiştirilemedi!",type:"danger"};
        
    }catch(err){
        console.log(err);
    }
    res.redirect("/admin/user/edit/"+_userid);
}