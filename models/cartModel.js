const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Users'
    },

    cartItems: [{
        productId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Product'
        },

        price: {
            type: Number
        },

        quantity: {
            type: Number,
            required: true
        }
    }]
})

module.exports = mongoose.model('Cart', cartSchema);