const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
});

const category = mongoose.model('Category', categorySchema);

module.exports = category;