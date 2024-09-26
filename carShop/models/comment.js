const mongoose = require('mongoose');

const schema = mongoose.Schema({
    
    text:{
        type: String,
        required: true,
        minlength: 10
    },
    date: {
        type: Date,
        default:Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }
    

});

const commentValidate = (comment) => {
    const schema = Joi.object( {
        text: Joi.string().min(10).required(),
        user: Joi.string().required()
    });

      return schema.validate(comment,{ abortEarly: false });//abortEarly: false to show all errors
}

const comment = mongoose.model('Comments', schema);

module.exports = {comment, commentValidate};