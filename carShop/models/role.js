const mongoose = require('mongoose');

const schema = mongoose.Schema({
    
    roleName: {
        type: String,
        required: true,
        minlength: 3
    }
    
});

const roleValidate = (role) => {
    const schema = Joi.object( {
        roleName: Joi.string().min(3).required()
      });

      return schema.validate(role,{ abortEarly: false });//abortEarly: false to show all errors
}
const role = mongoose.model('Roles', schema);

module.exports ={role, roleValidate}; ;