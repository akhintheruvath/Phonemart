const products = require('../models/productModel');
const categories = require('../models/categoryModel');
const uploadToCloudinary = require('../middlewares/cloudinary');

let productDetails;
let categoryDetails;

module.exports = {
    productsGet: async (req, res) => {
        let pageNumber = req.query.page;
        let productCount = await products.countDocuments();
        let perPage = 4;
        let pageCount = Math.ceil(productCount/perPage);
        let productDetails = await products.find().skip((pageNumber-1)*perPage).limit(perPage).lean();
        let categoryDetails = await categories.find().lean();
        res.render('admin/products', { data: productDetails, categoryData: categoryDetails, pageCount, admin: true,product:true });
    },

    addProductPost: async (req, res) => {

        let locaFilePath = req.file.path;
        let result = await uploadToCloudinary(locaFilePath);

        try {
            let c = new products({
                Name: req.body.Name,
                Category: req.body.Category,
                originalPrice: req.body.originalPrice,
                Price: req.body.Price,
                RAM: req.body.RAM,
                ROM: req.body.ROM,
                Display_size: req.body.displaysize,
                Display_type: req.body.displaytype,
                Rear_camera: req.body.rear,
                Front_camera: req.body.front,
                Battery: req.body.battery,
                Processor: req.body.processor,
                Image: req.file.filename,
                imageurl: result.url
            });

            const data = await c.save();
            productDetails = await products.find({}).lean();
            res.redirect('/admin/products');
        } catch (error) {
            console.log(error.message);
            res.redirect('/admin/products');
        }
    },

    productEditGet: async (req, res) => {
        try {
            const { id } = req.params;
            const datas = await products.findById(id).lean();
            const categoryData = await categories.find({}).lean();
            res.render('admin/editProduct', { datas, categoryData });
        } catch (error) {
            console.log(error.message);
        }
    },

    productEditPost: async (req, res) => {
        try {
            const { id } = req.params;
            let imageEdit;
            if (req.file === undefined) imageEdit = false;
            else imageEdit = true;
            if (imageEdit) {
                let locaFilePath = req.file.path;
                let result = await uploadToCloudinary(locaFilePath);
                await products.updateOne({ _id: id }, {
                    $set: {
                        Image: req.file.filename,
                        imageurl: result.url
                    }
                });
            }
            const editedData = req.body;
            await products.findByIdAndUpdate(id, { $set: editedData });
            productDetails = await products.find({}).lean();
            res.redirect('/admin/products');
        } catch (error) {
            console.log(error.message);
        }
    },

    disableProduct: async (req, res) => {
        try {
            const { id } = req.params;
            await products.findByIdAndUpdate(id, { $set: { productDisable: true } });
            res.redirect('/admin/products');
        } catch (error) {
            res.send(error.message);
        }
    },

    enableProduct: async (req, res) => {
        try {
            const { id } = req.params;
            await products.findByIdAndUpdate(id, { $set: { productDisable: false } });
            res.redirect('/admin/products');
        } catch (error) {
            console.log(error.message);
        }
    }
}