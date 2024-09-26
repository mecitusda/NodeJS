const mongoose = require('mongoose');

const schema = mongoose.Schema({
    
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        minlength: 5
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    date: {
        type: Date,
        default:Date.now
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Roles'
    }

});

const userValidate = (user) => {
    const schema = Joi.object( {
        name: Joi.string().min(3).required(),
        email: Joi.string().min(5).required(),
        password: Joi.string().min(6).required(),
        role: Joi.ObjectId().required()
      });

      return schema.validate(user,{ abortEarly: false });//abortEarly: false to show all errors
}

const user = mongoose.model('Users', schema);

module.exports = {user, userValidate};