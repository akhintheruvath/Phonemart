const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');

const adminSchema = new mongoose.Schema({
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
    }
});

module.exports = mongoose.model('admin',adminSchema);