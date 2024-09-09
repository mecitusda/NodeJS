module.exports.slash = async (req, res) => {
    try{
        const cars = await product.find();
        res.send(cars);
    }catch(err){
        return res.status(500).send('Internal Server Error');
    }
  
   };

module.exports.getById = async (req, res) => {

    try{
    const car = await product.findById({_id: req.params.id});//Warning id is not a integer.
    if (!car) return res.status(404).send('The car with the given ID was not found');
    res.send(car);
    }catch(err){
        return res.status(500).send('Internal Server Error');
    }
    
}

module.exports.addCar = async (req, res) => {
  
    const schema = Joi.object( {
      name: Joi.string().min(3).required(),
      brand: Joi.string().min(3).required(),
      model: Joi.string().min(2).required(),
      price: Joi.string().min(3).required(),
      description: Joi.string().min(10),
      imageURL: Joi.string(),
      isActive: Joi.boolean()
    });
  
    const {error} = schema.validate(req.body,{ abortEarly: false });//abortEarly: false to show all errors
  
    if(error){
      console.log(error);
      let errorMessage = '';
      for(let i=0; i<error.details.length; i++){
        errorMessage += error.details[i].message + '\n';
      }
      return res.status(400).send(errorMessage);
    }
  
    try{
      const newprocut = new product({
          name: req.body.name,
          brand: req.body.brand,
          model: req.body.model,
          price: req.body.price,
          description: req.body.description,
          imageURL: req.body.imageURL,
          isActive: req.body.isActive
      })
      
      await newprocut.save();
      console.log('Product added successfully');
    }catch(err){
      console.log(err);
      return res.status(500).send('Internal Server Error');
    }
    res.send(req.body);
  
  }

module.exports.updateCar = async (req, res) => {

  
    const car = await product.findById({_id: req.params.id});//Warning id is not a integer.
 

    if(!car) return res.status(404).send('The car with the given ID was not found');

    const schema = Joi.object( {
        name: Joi.string().min(3).required(),
        brand: Joi.string().min(3).required(),
        model: Joi.string().min(2).required(),
        price: Joi.string().min(3).required(),
        description: Joi.string().min(10),
        imageURL: Joi.string(),
        isActive: Joi.boolean()
      });

  const {error} = schema.validate(req.body,{ abortEarly: false });//abortEarly: false to show all errors

  if(error){
    let errorMessage = '';
    for(let i=0; i<error.details.length; i++){
      errorMessage += error.details[i].message + '\n';
    }
    return res.status(400).send(errorMessage);
  }

  try{
    const update = await product.findByIdAndUpdate(req.params.id,{
        $set: {
            name: req.body.name ? req.body.name : car.name,
            brand: req.body.brand ? req.body.brand : car.brand,
            model: req.body.model ? req.body.model : car.model,
            price: req.body.price ? req.body.price : car.price,
            description: req.body.description ? req.body.description : car.description,
            imageURL: req.body.imageURL ? req.body.imageURL : car.imageURL,
            isActive: req.body.isActive ? req.body.isActive : car.isActive

        }});

        return res.send(update);
  }catch(err){
    return res.status(500).send('Internal Server Error');
  }
 
  res.status(500).send('Internal Server Error');
}

module.exports.deleteCar = async (req, res) => {
    try{
    const car = await product.findByIdAndDelete({_id: req.params.id});
    if (!car) return res.status(404).send('The car with the given ID was not found');
    res.send(car);
}catch(err){
    return res.status(500).send('Internal Server Error');
}
  }