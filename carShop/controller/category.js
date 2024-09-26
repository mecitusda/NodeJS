const {category,categoryValiate} = require('../models/category');
const Joi = require('joi');

module.exports.slash = async (req, res) => {
    try{
        const categories = await category.find();
        res.send(categories);
    }catch(err){
        return res.status(500).send('Internal Server Error');
    }
  
   };

module.exports.getById = async (req, res) => {

    try{
    const categories = await category.findById({_id: req.params.id});//Warning id is not a integer.
    if (!categories) return res.status(404).send('The car with the given ID was not found');
    res.send(car);
    }catch(err){
        return res.status(500).send('Internal Server Error');
    }
    
}

module.exports.addCategory = async (req, res) => {
  
    
  
    const {error} = categoryValiate(req.body);//abortEarly: false to show all errors
  
    if(error){
      console.log(error);
      let errorMessage = '';
      for(let i=0; i<error.details.length; i++){
        errorMessage += error.details[i].message + '\n';
      }
      return res.status(400).send(errorMessage);
    }
  
    try{
      const newCategory = new category({
          name: req.body.name
      })
      
      await newCategory.save();
      console.log('Category added successfully');
    }catch(err){
      console.log(err);
      return res.status(500).send('Internal Server Error');
    }
    res.send(req.body);
  
  }

module.exports.updateCategory = async (req, res) => {

  
    const localcategory = await category.findById({_id: req.params.id});//Warning id is not a integer.
 

    if(!localcategory) return res.status(404).send('The car with the given ID was not found');


  const {error} = categoryValiate(req.body);//abortEarly: false to show all errors

  if(error){
    let errorMessage = '';
    for(let i=0; i<error.details.length; i++){
      errorMessage += error.details[i].message + '\n';
    }
    return res.status(400).send(errorMessage);
  }

  try{
    const update = await category.findByIdAndUpdate(req.params.id,{
        $set: {
            name: req.body.name ? req.body.name : category.name,
            }});

        return res.send(update);
  }catch(err){
    return res.status(500).send('Internal Server Error');
  }
 
  res.status(500).send('Internal Server Error');
}

module.exports.deleteCategory = async (req, res) => {
    try{
    const localcategory = await category.findByIdAndDelete({_id: req.params.id});
    if (!localcategory) return res.status(404).send('The car with the given ID was not found');
    res.send(localcategory);
}catch(err){
    return res.status(500).send('Internal Server Error');
}
  }