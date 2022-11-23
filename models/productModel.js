const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');

const productSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        trim: true
    },

    Category: {
        type: String,
        required: true,
        trim: true
    },

    originalPrice: {
        type: Number,
        required: true,
        trim: true
    },

    Price: {
        type: Number,
        required: true,
        trim: true
    },

    RAM: {
        type: Number,
        required: true,
        trim: true
    },

    ROM: {
        type: Number,
        required: true,
        trim: true
    },

    Display_size: {
        type: String,
        required: true,
        trim: true
    },

    Display_type: {
        type: String,
        required: true,
        trim: true
    },

    Rear_camera: {
        type: String,
        required: true,
        trim: true
    },

    Front_camera: {
        type: String,
        required: true,
        trim: true
    },

    Battery: {
        type: Number,
        required: true,
        trim: true
    },

    Processor: {
        type: String,
        required: true,
        trim: true
    },

    Image: {
        type: Buffer,
        data: Buffer,
        contentType: String
    },

    imageurl: {
        type: String
    },

    categoryDisable: {
        type: Boolean,
        default: false
    },

    productDisable: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('products', productSchema);