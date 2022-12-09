const categories = require('../models/categoryModel');
const products = require('../models/productModel');

let categoryDetails;

module.exports = {
    categoryGet: async (req, res) => {
        categoryDetails = await categories.find({}).lean();
        res.render('admin/categories', { data: categoryDetails, admin: true,category:true });
    },

    disableCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await categories.findById(id);
            const categ = category.category;
            await categories.findByIdAndUpdate(id,{$set:{Disable:true}});
            await products.updateMany({Category:categ},{$set:{categoryDisable:true}});
            res.redirect('/admin/categories');
        } catch (error) {
            res.send(error.message);
        }
    },

    enableCategory: async (req,res) => {
        try {
            const { id } = req.params;
            const category = await categories.findById(id);
            const categ = category.category;
            await categories.findByIdAndUpdate(id,{$set:{Disable:false}});
            await products.updateMany({Category:categ},{$set:{categoryDisable:false}});
            res.redirect('/admin/categories');
        } catch (error) {
            console.log(error.message);
        }
    },

    addCategoryPost: async (req, res) => {
        try {
            let c = new categories({
                category: req.body.newCategory
            });

            const data = await c.save();
            res.redirect('/admin/categories');
        } catch (error) {
            // res.send(error.message);
            console.log(error.message);
        }
    },

    categoryEditGet: async (req,res) => {
        const { id } = req.params;
        const datas = await categories.findById(id).lean();
        res.render('admin/editCategory', { datas });
    },

    categoryEditPost: async (req, res) => {
        try {
            const { id } = req.params;
            const category = req.body;
            await categories.findByIdAndUpdate(id, { $set: category });
            categoryDetails = await categories.find({}).lean();
            res.redirect('/admin/categories');
        } catch (error) {
            res.send(error.message);
        }
    }
}