const mongoose = require('mongoose');

const schema = mongoose.Schema({
    
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    description: {
        type: String,
        required: false,
        minlength: 10
    },
    imageURL:{
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
    ,
    brand: {
        type: String,
        required: true,
        minlength: 3
    },
    model: {
        type: String,
        required: true,
        minlength: 2
    },
    price: {
        type: String,
        required: true,
        minlength: 3
    },
    isActive: {
        type: Boolean,
        default: false
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comments'
        }
    ]

});

const Product = mongoose.model('Product', schema);

module.exports = Product;