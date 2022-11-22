const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        trim: true
    },
    
    Email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },

    Password: {
        type: String,
        required: true,
        minLength: 8
    },

    Block: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Users',userSchema);