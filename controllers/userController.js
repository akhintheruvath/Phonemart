const session = require('express-session');
const Users = require('../models/userModel');
const products = require('../models/productModel');
const categories = require('../models/categoryModel');
const carts = require('../models/cartModel');
const wishlists = require('../models/wishlistModel');
const coupons = require('../models/couponModel');
const orders = require('../models/orderModel');
const banners = require('../models/bannerModel');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Razorpay = require('razorpay');
const addresses = require('../models/addressModel');

let msg = '';
let msg2 = '';
let otpmsg = '';
let userName, Email, Password;
let totalPrice;
let addressFromAnotherFunction;
let paymentMethodAnotherFunction;
let totalFromAnotherFunction;

let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "akhintheruvath2827@gmail.com",
        pass: "mutcxknugedxvkxk",
    },
});
const OTP = `${Math.floor(1000 + Math.random() * 9000)}`;

const razorpayInstance = new Razorpay({
    key_id: 'rzp_test_eXHeIXDXI5A5em',
    key_secret: 'FTzFyk2RIsK7R92rZ0zkCW7X'
});

module.exports = {
    homeGet: async (req, res) => {
        let productDetails = await products.find({ $and: [{ categoryDisable: false }, { productDisable: false }] }).lean();
        let productCount = productDetails.length;
        let latestProducts;
        if (productCount >= 4) {
            latestProducts = productDetails.slice(-4);
            productDetails = productDetails.slice(0, 8);
        } else {
            latestProducts = productDetails;
        }
        let categoryDetails = await categories.find({Disable:false}).lean();
        let bannerDetails = await banners.find({}).lean();
        if (req.session.customer) {
            let userEmail = req.session.customer;
            let userDetails = await Users.findOne({ Email: userEmail }).lean();
            res.render('user/userHome', { signedin: true, userDetails, products: productDetails, latestProducts, categories: categoryDetails, productDetails, bannerDetails });
        } else {
            res.render('user/userHome', { signedin: false, products: productDetails, latestProducts, categories: categoryDetails, productDetails, bannerDetails });
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

    userProfile: async (req, res) => {
        const userEmail = req.session.customer;
        const user = await Users.findOne({ Email: userEmail });
        const userId = user._id;
        const userDetails = await Users.findOne({ Email: userEmail }).lean();
        const userAddress = await addresses.findOne({ userId: userId }).lean();
        if (userAddress) {
            const address = userAddress.addresses;
            res.render('user/userProfile', { userDetails, address });
        } else {
            res.render('user/userProfile', { userDetails });
        }
    },

    editName: async (req, res) => {
        await Users.updateOne({ _id: req.body.userId }, { Name: req.body.Name });
        res.json({ status: true });
    },

    deleteAddress: async (req, res) => {
        const userEmail = req.session.customer;
        const user = await Users.findOne({ Email: userEmail });
        const userId = user._id;
        const addressId = req.params.id;
        await addresses.updateOne({ userId: userId }, { $pull: { addresses: { _id: addressId } } });
        res.redirect('/profile');
    },

    shopGet: async (req, res) => {
        let sort = {};
        let categoryDetails = await categories.find({Disable:false}).lean();
        let query = {$and: [{ categoryDisable: false }, { productDisable: false }]};
        if (req.query.searchText) {
            query.$or = [
                { Name: { $regex: '.*' + req.query.searchText + '.*', $options: 'i' } }
            ]
        }
        if(req.query.category){
            query.Category = req.query.category;
        }
        if(req.query.price){
            if(req.query.price == -1){
                sort.Price = -1;
            }else{
                sort.Price = 1;
            }
        }
        let productDetails = await products.find(query).sort(sort).lean();
        res.render('user/shop', { products: productDetails,categoryDetails });
    },

    singleProduct: async (req, res) => {
        const { id } = req.params;
        let productData = await products.findById(id).lean();
        res.render('user/singleProduct', { productData });
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
        try {
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
                        res.json({wishlistStatus:true});
                    } else {
                        await wishlists.updateOne({ userId: user_id }, { $pull: { productId: product_id } }).then((response) => {
                            res.json({wishlistStatus:false});
                        })
                    }
                } else {
                    try {
                        const wishlist = new wishlists({
                            userId: userId,
                            productId: product_id
                        })
                        await wishlist.save();
                        res.json({wishlistStatus:true});
                    } catch (error) {
                        console.log(error.message);
                    }
                }
            } else {
                res.redirect('/login');
            }
        } catch (error) {
            console.log(error.message);
        }
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
                    if (subTotal > 20000) shippingCost = 0;
                    else shippingCost = 50;
                    total = subTotal + shippingCost;
                    const productDetails = userCart.cartItems;
                    if (productDetails.length != 0) {
                        res.render('user/cart', { cartProducts: productDetails, subTotal: subTotal, shippingCost: shippingCost, total: total });
                    } else if (productDetails.length == 0) {
                        shippingCost = 0;
                        total = 0;
                        res.render('user/cart', { message: 'Cart is empty... Continue shopping...', subTotal: subTotal, shippingCost: shippingCost, total: total });
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
                if (userCart) {
                    const productExist = await carts.findOne({ "cartItems.productId": productId });
                    if (productExist == null) {
                        await carts.updateOne({ userId: userId }, { $push: { cartItems: { productId: productId } } });
                        res.json({cartState:true});
                    } else {
                        res.json({cartState:false});
                    }
                } else {
                    const cart = new carts({
                        userId: userId,
                        cartItems: { productId: productId },
                    })
                    await cart.save();
                    res.json({cartState:true});
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
                }).catch((err) => console.log(err.message));
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

    applyCoupon: async (req, res) => {
        let { couponCode } = req.body;
        couponCode = couponCode.toUpperCase();
        await coupons.findOne({ couponCode: couponCode, Disable: false }).then((result) => {
            res.json(result);
        });
    },

    proceedtoCheckout: (req, res) => {
        const { total } = req.body;
        totalPrice = parseInt(total.replace(/^\D+/g, ''));
        res.json({ status: true });
    },

    checkoutPage: async (req, res) => {
        try {
            const userEmail = req.session.customer;
            const user = await Users.findOne({ Email: userEmail });
            const userId = user._id;
            const userAddress = await addresses.findOne({ userId: userId }).lean();
            if (userAddress) {
                const address = userAddress.addresses;
                res.render('user/checkout', { total: totalPrice, userAddresses: address, status: true });
            } else {
                res.render('user/checkout', { total: totalPrice, status: false });
            }
        } catch (error) {
            console.log(error.message);
        }
    },

    newAddress: async (req, res) => {
        try {
            const { Name, Email, Mobile, HouseName, PostOffice, City, District, State, PIN } = req.body;
            const userEmail = req.session.customer;
            const user = await Users.findOne({ Email: userEmail });
            const userId = user._id;
            const adr = await addresses.findOne({ userId: userId });
            if (adr) {
                await addresses.updateOne({ userId: userId }, { $push: { addresses: { Name, Email, HouseName, Mobile, PostOffice, City, District, State, PIN } } });
            } else {
                const address = new addresses({
                    userId: userId,
                    addresses: { Name, Email, Mobile, HouseName, PostOffice, City, District, State, PIN }
                });
                await address.save();
            }
            if (req.body.page == 'checkout') {
                res.redirect('/checkout');
            } else {
                res.redirect('/profile');
            }
        } catch (error) {
            console.log(error.message);
        }
    },

    placeOrder: async (req, res) => {
        let addressId;
        const { status, paymentMethod, address } = req.body;
        paymentMethodAnotherFunction = paymentMethod;
        const userEmail = req.session.customer;
        const user = await Users.findOne({ Email: userEmail });
        const userId = user._id;
        const orderItems = (await carts.findOne({ userId: userId })).cartItems;
        const orderInfo = await orders.findOne({ userId });
        const adr = await addresses.findOne({ userId: userId });
        if (status == 'first') {
            const { Name, Email, Mobile, HouseName, PostOffice, City, District, State, PIN } = req.body;
            if (adr) {
                await addresses.updateOne({ userId: userId }, { $push: { addresses: { Name, Email, HouseName, Mobile, PostOffice, City, District, State, PIN } } });
                addressId = ((await addresses.findOne({ userId: userId })).addresses)[0]._id;
                addressId = mongoose.Types.ObjectId(addressId);
                addressFromAnotherFunction = addressId;
            } else {
                const address = new addresses({
                    userId: userId,
                    addresses: { Name, Email, HouseName, Mobile, PostOffice, City, District, State, PIN }
                });
                await address.save();
                addressId = ((await addresses.findOne({ userId: userId })).addresses)[0]._id;
                addressId = mongoose.Types.ObjectId(addressId);
                addressFromAnotherFunction = addressId;
            }

            if (paymentMethod == 'Cash on Delivery') {
                if (orderInfo) {
                    const shippingAddress = ((await addresses.findOne({ userId }, { addresses: { $elemMatch: { _id: addressId } } })).addresses)[0];
                    await orders.updateOne({ userId: userId }, { $push: { orderDetails: { paymentMethod, address: shippingAddress, orderItems, totalPrice } } });
                    await carts.deleteOne({ userId });
                } else {
                    const shippingAddress = ((await addresses.findOne({ userId }, { addresses: { $elemMatch: { _id: addressId } } })).addresses)[0];
                    const order = new orders({
                        userId,
                        orderDetails: { paymentMethod, address: shippingAddress, orderItems, totalPrice }
                    });
                    await order.save();
                    await carts.deleteOne({ userId });
                }
                res.json({ codSuccess: true });
            } else {
                const shippingAddress = ((await addresses.findOne({ userId }, { addresses: { $elemMatch: { _id: addressId } } })).addresses)[0];
                if (orderInfo) {
                    await orders.updateOne({ userId }, { $push: { orderDetails: { paymentMethod, address: shippingAddress, orderItems, totalPrice, status: 'Payment failed' } } });
                } else {
                    const orderNew = new orders({
                        userId,
                        orderDetails: { paymentMethod: paymentMethodAnotherFunction, address: shippingAddress, orderItems, totalPrice, status: 'Payment failed' }
                    });
                    await orderNew.save();
                }
                let order = await orders.findOne({ userId: userId }, { orderDetails: { $slice: -1 } });
                let total = (order.orderDetails[0]).totalPrice;
                totalFromAnotherFunction = total;
                let options = {
                    amount: total * 100,
                    currency: 'INR',
                    receipt: '' + order.orderDetails[0]._id
                }

                razorpayInstance.orders.create(options,
                    (err, order) => {
                        if (!err) res.json(order);
                        else res.send(err);
                    }
                );
            }
        } else {
            addressId = address;
            if (paymentMethod == 'Cash on Delivery') {
                const shippingAddress = ((await addresses.findOne({ userId }, { addresses: { $elemMatch: { _id: addressId } } })).addresses)[0];
                if (orderInfo) {
                    await orders.updateOne({ userId: userId }, { $push: { orderDetails: { paymentMethod, address: shippingAddress, orderItems, totalPrice } } });
                    await carts.deleteOne({ userId });
                } else {
                    const order = new orders({
                        userId,
                        orderDetails: { paymentMethod, address: shippingAddress, orderItems, totalPrice }
                    });
                    await order.save();
                    await carts.deleteOne({ userId });
                }
                res.json({ codSuccess: true });
            } else {
                const shippingAddress = ((await addresses.findOne({ userId }, { addresses: { $elemMatch: { _id: addressId } } })).addresses)[0];
                if (orderInfo) {
                    await orders.updateOne({ userId }, { $push: { orderDetails: { paymentMethod, address: shippingAddress, orderItems, totalPrice, status: 'Payment failed' } } });
                } else {
                    const orderNew = new orders({
                        userId,
                        orderDetails: { paymentMethod: paymentMethodAnotherFunction, address: shippingAddress, orderItems, totalPrice, status: 'Payment failed' }
                    });
                    await orderNew.save();
                }
                let order = await orders.findOne({ userId: userId }, { orderDetails: { $slice: -1 } });
                let total = order.orderDetails[0].totalPrice;
                totalFromAnotherFunction = total;
                addressFromAnotherFunction = addressId;
                let options = {
                    amount: total * 100,
                    currency: 'INR',
                    receipt: '' + order.orderDetails[0]._id
                };

                razorpayInstance.orders.create(options,
                    (err, order) => {
                        if (!err) res.json(order);
                        else {
                            res.send(err);
                        }
                    }
                );
            }
        }
    },

    verifyPayment: async (req, res) => {
        const userEmail = req.session.customer;
        const userId = (await Users.findOne({ Email: userEmail }))._id;
        let details = req.body;
        const crypto = require('crypto');
        let hmac = crypto.createHmac('sha256', 'FTzFyk2RIsK7R92rZ0zkCW7X');
        hmac.update(details.payment.razorpay_order_id + '|' + details.payment.razorpay_payment_id);
        hmac = hmac.digest('hex')
        if (hmac == details.payment.razorpay_signature) {
            await orders.updateOne({ orderDetails: { $elemMatch: { _id: details.order.receipt } } }, { 'orderDetails.$.status': 'Order placed' });
            await carts.deleteOne({ userId: userId })
            res.json({ status: true })
        } else {
            res.json({ status: false });
        }
    },

    orderConfirmationPage: async (req, res) => {
        const userEmail = req.session.customer;
        const userId = (await Users.findOne({ Email: userEmail }))._id;
        const order = await orders.findOne({ userId }, { orderDetails: { $slice: -1 } }).lean();
        const orderDetails = (order.orderDetails)[0];
        const date = orderDetails.createdAt.toDateString();
        res.render('user/orderConfirmationPage', { orderDetails, date });
    },

    orderPage: async (req, res) => {
        try {
            const userEmail = req.session.customer;
            const userId = (await Users.findOne({ Email: userEmail }))._id;
            let allOrders = await orders.findOne({ userId }).lean();
            if (allOrders) {
                allOrders = allOrders.orderDetails;
                allOrders.forEach(e => {
                    date = e.createdAt;
                    e.date = date.toDateString();
                })
                res.render('user/orderPage', { allOrders });
            } else {
                res.render('user/orderPage', { message: 'No orders found... Continue shopping...' });
            }
        } catch (error) {
            console.log(error.message);
            res.redirect('/login');
        }
    },

    viewProducts: async (req, res) => {
        try {
            let orderId = req.params.id;
            orderId = mongoose.Types.ObjectId(orderId);
            const userEmail = req.session.customer;
            const userId = (await Users.findOne({ Email: userEmail }))._id;
            const order = await orders.findOne({ userId }, { orderDetails: { $elemMatch: { _id: orderId } } }).populate('orderDetails.orderItems.productId').lean();
            const orderDetails = order.orderDetails;
            const orderItems = orderDetails[0].orderItems;
            res.render('user/viewProducts', { orderItems });
        } catch (error) {
            res.redirect('/login');
        }
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