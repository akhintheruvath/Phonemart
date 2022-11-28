const session = require('express-session');
const Users = require('../models/userModel');
const products = require('../models/productModel');
const categories = require('../models/categoryModel');
const carts = require('../models/cartModel');
const wishlists = require('../models/wishlistModel');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
// const { resolve } = require('path');

let msg = '';
let msg2 = '';
let customerId;
let otpmsg = '';
let userName, Email, Password;

let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "akhintheruvath2827@gmail.com",
        pass: "mutcxknugedxvkxk",
    },
});

const OTP = `${Math.floor(1000 + Math.random() * 9000)}`;

module.exports = {
    homeGet: async (req, res) => {
        if (req.session.customer) {
            let productDetails = await products.find({ $and: [{ categoryDisable: false }, { productDisable: false }] }).lean();
            res.render('user/userHome', { signedin: true, products: productDetails, productDetails });
        } else {
            let productDetails = await products.find({ $and: [{ categoryDisable: false }, { productDisable: false }] }).lean();
            let categoryDetails = await categories.find({}).lean();
            res.render('user/userHome', { signedin: false, products: productDetails, categories: categoryDetails, productDetails });
        }
    },

    loginGet: (req, res) => {
        if (req.session.customer) {
            res.redirect('/');
        } else {
            res.render('user/userLogin', { message: msg });
            msg = '';
        }
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

                res.redirect('/');
            } else {
                msg = 'Invalid username or password';
                res.redirect('/login');
            }
        } catch (error) {
            // res.send(error.message);
            msg = 'Invalid username or password';
            res.redirect('/login');
        }
    },

    signupGet: (req, res) => {
        res.render('user/userSignup', { message: msg2 });
        msg2 = '';
    },

    signupPost: async (req, res) => {

        ({ userName, Email, Password } = req.body);
        let mailDetails = {
            from: "akhintheruvath2827@gmail.com",
            to: Email,
            subject: "PHONEMART REGISTRATION",
            html: `<p>YOUR OTP FOR REGISTERING IN PHONEMART IS ${OTP}</p>`,
        };

        mailTransporter.sendMail(mailDetails, function (err, data) {
            if (err) {
                console.log("Error Occurs");
            } else {
                console.log("Email sent successfully");
            }
        });

        try {
            const userMail = await Users.findOne({ Email: Email });
            if (req.body.Password.length >= 8 && (!userMail)) {
                Password = await bcrypt.hash(req.body.Password, 10);
                res.redirect('/otpPage');
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

    otpPageGet: (req, res) => {
        res.render('user/otpPage', { message: otpmsg })
        otpmsg = '';
    },

    otpPost: async (req, res) => {
        const { otp } = req.body;
        if (otp === OTP) {
            const user = new Users({
                Name: userName,
                Email: Email,
                Password: Password,
            });
            await user.save();

            req.session.customer = Email;
            res.cookie('userId', Email, {
                maxAge: 2 * 60 * 60 * 1000,
                httpOnly: true
            });

            res.redirect("/");
        } else {
            otpmsg = 'Invalid OTP.. Try again';
            res.redirect('/otpPage');
        }
    },

    shopGet: async (req, res) => {
        let productDetails = await products.find({ $and: [{ categoryDisable: false }, { productDisable: false }] }).lean();
        res.render('user/shop', { products: productDetails });
    },

    singleProduct: async (req, res) => {
        const { id } = req.params;
        let productData = await products.findById(id).lean();
        res.render('user/singleProduct', { productData });
    },

    cartPage: async (req, res) => {
        try {
            if (req.session.customer) {
                const userEmail = req.session.customer;
                const user = await Users.findOne({ Email: userEmail });
                const userId = user._id;
                const userCart = await carts.findOne({ userId: userId }).populate('cartItems.productId').lean();
                let subTotal = 0;
                let shippingCost = 0;
                let total = 0;
                if (!userCart) {
                    res.render('user/cart', { message: 'Cart is empty... Continue shopping...' });
                } else {
                    const cart_Items = userCart.cartItems;
                    cart_Items.forEach((x) => {
                        subTotal = subTotal + (x.productId.Price * x.quantity);
                    })
                    if(subTotal>20000) shippingCost = 0;
                    else shippingCost = 50;
                    total = subTotal + shippingCost;
                    const productDetails = userCart.cartItems;
                    if (productDetails.length != 0) {
                        res.render('user/cart', { cartProducts: productDetails,subTotal:subTotal, shippingCost:shippingCost, total:total });
                    } else if (productDetails.length == 0) {
                        shippingCost = 0;
                        total = 0;
                        res.render('user/cart', { message: 'Cart is empty... Continue shopping...',subTotal:subTotal, shippingCost:shippingCost, total:total });
                    }
                }
            } else {
                res.redirect('/login');
            }
        } catch (error) {
            res.redirect('/login');
        }
    },

    addToCart: async (req, res) => {
        try {
            if (req.session.customer) {
                const userEmail = req.session.customer;
                const user = await Users.findOne({ Email: userEmail });
                let userId = user._id;
                const userCart = await carts.findOne({ userId: userId });
                const { productId } = req.body;
                const product = await products.findOne({ _id: productId });
                const productPrice = product.Price;
                if (userCart) {
                    const productExist = await carts.findOne({ "cartItems.productId": productId });
                    if (productExist == null) {
                        await carts.updateOne({ userId: userId }, { $push: { cartItems: { productId: productId } } });
                    } else {
                        res.json();
                    }
                } else {
                    const cart = new carts({
                        userId: userId,
                        cartItems: { productId: productId },
                    })
                    cart.save();
                }
            } else {
                res.redirect('/login');
            }
        } catch (error) {
            console.log(error.message);
        }
    },

    changeQuantity: async (req, res, next) => {
        try {
            let { product, count } = req.body;
            count = parseInt(count);
            product = mongoose.Types.ObjectId(product);
            const userEmail = req.session.customer;
            const user = await Users.findOne({ Email: userEmail });
            const userId = user._id;
            const currentQuantity = await carts.findOne({ userId: userId, 'cartItems.productId': product }, { cartItems: { $elemMatch: { productId: product } } });
            const value = currentQuantity.cartItems[0].quantity;
            if (!(value == 1 && count == -1)) {
                await carts.updateOne({ userId: userId, 'cartItems.productId': product }, { $inc: { 'cartItems.$.quantity': count } }).then((response) => {
                    res.json(response);
                }).catch((err) => console.log(err));
            } else {
                next();
            }
        } catch (error) {
            console.log(error.message);
        }
    },

    removeFromCart: async (req, res) => {
        try {
            const userEmail = req.session.customer;
            const user = await Users.findOne({ Email: userEmail });
            const userId = user._id;
            const { productId } = req.body;
            await carts.updateOne({ userId: userId }, { $pull: { cartItems: { productId: productId } } }).then((response) => {
                res.json(response);
            });
        } catch (error) {
            console.log(error.message);
        }
    },

    wishlistPage: async (req, res) => {
        if (req.session.customer) {
            const userEmail = req.session.customer;
            const user = await Users.findOne({ Email: userEmail });
            const userId = user._id;
            const userWishList = await wishlists.findOne({ userId: userId }).populate('productId').lean();
            if (!userWishList) {
                res.render('user/wishlist', { message: 'Wishlist is empty... Continue shopping...' });
            } else {
                const productArray = userWishList.productId;
                if (productArray.length != 0) {
                    res.render('user/wishlist', { wishlistProducts: productArray });
                } else {
                    res.render('user/wishlist', { message: 'Wishlist is empty... Continue shopping...' });
                }
            }
        } else {
            res.redirect('/login');
        }
    },

    addToWishlist: async (req, res) => {
        if (req.session.customer) {
            const userEmail = req.session.customer;
            const user = await Users.findOne({ Email: userEmail });
            let userId = user._id;
            const userWishList = await wishlists.findOne({ userId: userId });
            const { productId } = req.body;
            const product_id = mongoose.Types.ObjectId(productId);
            if (userWishList) {
                const products = userWishList.productId;
                const existStatus = await products.includes(product_id, 0);
                const user_id = mongoose.Types.ObjectId(userId).toString();
                if (!existStatus) {
                    await wishlists.updateOne({ userId: user_id }, { $push: { productId: product_id } });
                } else {
                    await wishlists.updateOne({ userId: user_id }, { $pull: { productId: product_id } }).then((response) => {
                        res.json(response);
                    })
                }
            } else {
                try {
                    const wishlist = new wishlists({
                        userId: userId,
                        productId: product_id
                    })
                    await wishlist.save();
                } catch (error) {
                    console.log(error.message);
                }
            }
        } else {
            res.redirect('/login');
        }
    },

    checkoutPage: (req, res) => {
        res.render('user/checkout');
    },

    placeOrder: (req,res) => {
        console.log(req.body);
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