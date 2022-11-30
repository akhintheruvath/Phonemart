const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'users'
    },

    orderDetails: [{
        paymentMethod: String,

        addressId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'addresses'
        },

        cartId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'carts'
        },

        createdAt: {
            type: Date,
            default: Date.now(),
            immutable: true
        },
        status: {
            type: String,
            default: 'Order placed'
        }
    }]
});

module.exports = mongoose.model('orders',orderSchema);