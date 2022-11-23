const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    userId: String,
    productId: [{
        type: String,
        ref: 'products'
    }]
})

module.exports = mongoose.model('wishlist',wishlistSchema);