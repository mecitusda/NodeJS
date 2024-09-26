module.exports.slash = async (req, res) => {
    try{
        const users = await user.find();
        res.send(users);
    }
    catch(err){
        res.status(400).send(err);
    }
    
}

module.exports.add_user = async (req, res) => {

    const users = new user({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    });
    try{
        const savedUser = await users.save();
        res.send(savedUser);
    }catch(err){
        res.status(400).send(err);
    }
}

module.exports.getUser =  async (req, res) => {
    try{
        const users = await user.findById(req.params.userId);
        res.send(users);
    }catch(err){
        res.status(400).send(err);}
}


module.exports.updateUser = async (req, res) => {
    try{
        const users = await user.updateOne({_id: req.params.userId},{$set:{name:req.body.name}});
        res.send(users);
    }catch(err){
        res.status(400).send(err);}
}

module.exports.deleteUser =  async (req, res) => {
    try{
        const localuser = await user.findByIdAndDelete(req.params.userId);
        if(!localuser) return res.status(404).send('The user with the given ID was not found');
        res.send(localuser);
    }catch(err){
        res.status(400).send(err);
    }
}
