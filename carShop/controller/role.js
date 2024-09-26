module.exports.slash = async (req, res) => {
    try{
        const localrole = await role.find();
        res.send(localrole);
    }catch(err){
        res.status(400).send(err);
    }
  
};

module.exports.add_role = async (req, res) => {
    const  {error} = roleValidate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);//can only send one error message
    }
    try{
        const newrole = new role(req.body);
        await newrole.save();
        res.send(newrole);
    }catch(err){
        res.status(400).send(err);
    }
}

module.exports.getRole = async (req, res) => {
    try{
        const localrole = await role.findById(req.params.roleId);
        res.send(localrole);
    }catch(err){
        res.status(400).send(err);
}
}

module.exports.updateRole =  async (req, res) => {
    try{
        const object = await role.findById(req.params.roleId);
        
        const shema = {roleName:object.roleName};
        const  {error} = roleValidate(shema);
        if(error){
            return res.status(400).send(error.details[0].message);//can only send one error message
        }
        const updatedrole = await role.updateOne({_id: req.params.roleId},{$set:{name:req.body.name}});
        res.send(updatedrole);
    }catch(err){
        res.status(400).send(err);}
}


module.exports.deleteRole = async (req, res) => {
    try{
        const localrole = await role.findByIdAndDelete(req.params.roleId);
        if(!localrole) return res.status(404).send('The role with the given ID was not found');
        res.send(localrole);
    }catch(err){
        res.status(400).send(err);
}
}