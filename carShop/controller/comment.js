const {comment, commentValidate} = require('../models/comment');
const {product, productValidate} = require('../models/products');

module.exports.slash = async (req, res) => {
    try{
        const comments = await comment.find().populate('user','name email -_id');
        if(!comments) return res.status(404).send('No comments found');
        res.send(comments);
    }catch(err){        
        res.status(500).send('Internal Server Error');}
};

module.exports.getById = async (req, res) => {
    try{
        const comments = await comment.findById({_id: req.params.id}).populate('users');
        if(!comments) return res.status(404).send('The comment with the given ID was not found');
        res.send(comments);
    }catch(err){
        res.status(500).send('Internal Server Error');
    }
};

module.exports.addComment = async (req, res) => {
    const {error} = commentValidate(req.body);
    if(error){
        let errorMessage = '';
        for(let i=0; i<error.details.length; i++){
            errorMessage += error.details[i].message + '\n';
        }
        return res.status(400).send(errorMessage);
    }
    try{
        const newComment = new comment(req.body);
        await newComment.save();
        await product.findByIdAndUpdate({_id: req.params.id}, {$push: {comments: newComment._id}});
    }catch(err){
        return res.status(500).send('Internal Server Error');
    }
    res.send(req.body);
};

module.exports.updateComment = async (req, res) => {
    const {error} = commentValidate(req.body);
    if(error){
        let errorMessage = '';
        for(let i=0; i<error.details.length; i++){
            errorMessage += error.details[i].message + '\n';
        }
        return res.status(400).send(errorMessage);
    }
    try{
        const updatedComment = await comment.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true});
        if(!updatedComment) return res.status(404).send('The comment with the given ID was not found');
    }catch(err){
        return res.status(500).send('Internal Server Error');
    }
    res.send(req.body);
};

module.exports.deleteComment = async (req, res) => {
    try{
        const deletedComment = await comment.findByIdAndDelete({_id: req.params.id});
        if(!deletedComment) return res.status(404).send('The comment with the given ID was not found');
    }catch(err){
        return res.status(500).send('Internal Server Error');
    }
    res.send('Comment deleted successfully');
};

