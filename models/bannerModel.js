const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    Image: {
        type: Buffer,
        data: Buffer,
        contentType: String
    },

    imageurl: {
        type: String
    }
})

module.exports = mongoose.model('banners',bannerSchema);