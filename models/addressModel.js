const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    Name:{
        type: String,
        required: true
    },

    Email:{
        type: String,
    },

    Mobile:{
        type: Number,
        required: true
    },

    HouseName:{
        type: String,
        required: true
    },

    PostOffice:{
        type: String,
        required: true
    },

    City:{
        type: String
    },

    District:{
        type: String,
        required: true
    },

    State:{
        type: String,
        required: true
    },

    PIN:{
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('adress',addressSchema);