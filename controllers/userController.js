const session = require('express-session');
const Users = require('../models/userModel');
const products = require('../models/productModel');
const categories = require('../models/categoryModel');
const carts = require('../models/cartModel');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

let msg = '';
let msg2 = '';
let customerId;

module.exports = {
    homeGet: async (req, res) => {
        if (req.session.customer) {
            let productDetails = await products.find({$and:[{categoryDisable:false},{productDisable:false}]}).lean();
            console.log('Hello'+productDetails);
            res.render('user/userHome', { signedin: true, products: productDetails, productDetails });
        } else {
            let productDetails = await products.find({$and:[{categoryDisable:false},{productDisable:false}]}).lean();
            console.log('Hello',productDetails);
            let categoryDetails = await categories.find({}).lean();
            res.render('user/userHome', { signedin: false, products: productDetails, categories:categoryDetails, productDetails });
        }
    },

    loginGet: (req, res) => {
        res.render('user/userLogin', { message: msg });
        msg = '';
    },

    loginPost: async (req, res) => {

        const { Email, Password } = req.body;
        const customer = await Users.findOne({ Email });
        try {
            if (Email == customer.Email && await bcrypt.compare(Password, customer.Password) && (!customer.Block)) {
                req.session.customer = Email;
                res.cookie('userId', Email, {
                    maxAge: 2 * 60 * 60 * 1000,
                    httpOnly: true
                });
                customerId = customer._id;
                console.log(customerId);

                res.redirect('/');
            } else {
                msg = 'Invalid username or password';
                res.redirect('/login');
            }
        } catch (error) {
            // res.send(error.message);
            msg = 'Invalid username or password';
            res.redirect('/');
        }
    },

    signupGet: (req, res) => {
        res.render('user/userSignup', { message: msg2 });
        msg2 = '';
    },

    signupPost: async (req, res) => {

        try {
            if (req.body.Password.length >= 8) {
                req.body.Password = await bcrypt.hash(req.body.Password, 10);

                const user = new Users({
                    Name: req.body.userName,
                    Email: req.body.Email,
                    Password: req.body.Password
                });
                await user.save();

                const Email = req.body.Email;
                req.session.customer = Email;
                res.cookie('userId', Email, {
                    maxAge: 2 * 60 * 60 * 1000,
                    httpOnly: true
                });

                res.redirect("/");
            } else {
                msg2 = 'Password must be at least 8 characters';
                res.redirect('/signup');
            }
        } catch (error) {
            // res.status(500).send(error.message);
            res.redirect('/signup');
            console.log(error.message);
        }
    },

    shopGet: async (req, res) => {
        let productDetails = await products.find({$and:[{categoryDisable:false},{productDisable:false}]}).lean();
        res.render('user/shop', { products: productDetails });
    },

    singleProduct: async (req, res) => {
        const { id } = req.params;
        let productData = await products.findById(id).lean();
        res.render('user/singleProduct', { productData });
    },

    cartPage: async (req, res) => {
        if (req.session.customer) {
            console.log(customerId);
            
            

            res.render('user/cart'/*, { products: datas }*/);
        } else {
            res.redirect('/login');
        }
    },

    addToCart: (req, res) => {
        if (req.session.customer) {
            
            

        } else {
            res.redirect('/login');
        }
    },

    wishlistPage: (req,res) => {
        res.render('user/wishlist');
    },

    checkoutPage: (req, res) => {
        res.render('user/checkout');
    },

    userLogout: (req, res) => {
        try {
            res.clearCookie('userId');
            res.clearCookie('session-1');
            res.redirect('/');
        } catch (error) {
            // res.send(error.message);
            console.log(error.message);
        }
    }
}