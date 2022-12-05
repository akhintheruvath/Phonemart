const banners = require('../models/bannerModel');
const uploadToCloudinary = require('../middlewares/cloudinary');

let bannerDetails;
let bannerId;

module.exports = {
    bannerGet: async (req, res) => {
        bannerDetails = await banners.find({}).lean();
        res.render('admin/bannerManagement', { admin: true, bannerDetails });
    },

    bannerPost: async (req, res) => {
        let locaFilePath = req.file.path;
        let result = await uploadToCloudinary(locaFilePath);
        try {
            let bannerImage = new banners({
                Image: req.file.filename,
                imageurl: result.url
            });
            await bannerImage.save();
            bannerDetails = await banners.find({}).lean();
            res.redirect('/admin/banners');
        } catch (error) {
            console.log(error.message);
        }
    },

    bannerEditGet: (req, res) => {
        bannerId = req.params.id;
        res.render('admin/bannerEdit');
    },

    bannerEditPost: async (req, res) => {
        let locaFilePath = req.file.path;
        let result = await uploadToCloudinary(locaFilePath);
        await banners.updateOne({ _id: bannerId }, {
            $set: {
                Image: req.file.filename,
                imageurl: result.url
            }
        });
        res.redirect('/admin/banners');
    }
}