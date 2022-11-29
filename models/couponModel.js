const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    couponCode: {
        type: String,
        uppercase:true,
        required: true,
        unique: true
    },

    discountPercentage: {
        type: Number,
        required: true
    },

    Disable: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('coupons',couponSchema);