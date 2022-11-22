const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: String,
    productDetails: [
        {
            productId: String
        }
    ]
});

module.exports = mongoose.model('Cart',cartSchema);