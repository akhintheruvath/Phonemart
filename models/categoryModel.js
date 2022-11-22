const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');

const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },

    Disable: {
        type: Boolean,
        default: false
    }
})

categorySchema.plugin(validator);
module.exports = mongoose.model('Category',categorySchema);