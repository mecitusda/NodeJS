const slugify = require('slugify');
const { trim } = require('validator');

const options = {
    replacement: '-',
    remove: undefined,
    lower: true,
    strict: true,
    locale: 'tr',
    trim: true
};


module.exports = function slugField(value) {
    return slugify(value, options);
}