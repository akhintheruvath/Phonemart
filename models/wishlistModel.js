const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    userId: ObjectId,
    productId: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'product'
    }]
})

module.exports = mongoose.model('wishlist',wishlistSchema);