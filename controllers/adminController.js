const session = require('express-session');
const Admin = require('../models/adminModel');
const users = require('../models/userModel');
const orders = require('../models/orderModel');
const products = require('../models/productModel');
const categories = require('../models/categoryModel');
const bcrypt = require('bcrypt');

let msg = '';

module.exports = {
    loginGet: async (req, res) => {
        if (req.session.adminSession) {
            let userCount = await users.countDocuments();
            let productCount = await products.countDocuments();
            let categoryCount = await categories.countDocuments();
            const allOrders = await orders.aggregate([
                {
                    $project: {
                        orderDetails: {
                            $filter: {
                                input: '$orderDetails',
                                as: 'orderDetails',
                                cond: {}
                            },
                        },
                        _id: 0,
                    },
                },
            ]);
            let orderCount = 0;
            let failedCount = 0;
            let placeOrderCount = 0;
            let packedCount = 0;
            let shippedCount = 0;
            let deliveredCount = 0;
            let cancelledCount = 0;

            if (allOrders) {
                allOrders.forEach((e) => {
                    orderCount += e.orderDetails.length
                    e.orderDetails.forEach((f) => {
                        if (f.status === 'Order placed') placeOrderCount += 1;
                        else if (f.status === 'Payment failed') failedCount += 1;
                        else if (f.status === 'Packed') packedCount += 1;
                        else if (f.status === 'Shipped') shippedCount += 1;
                        else if (f.status === 'Delivered') deliveredCount += 1;
                        else if (f.status === 'Cancelled') cancelledCount += 1;
                    })
                })
            }
            res.render('admin/adminHome', { admin: true, dashboard:true, userCount, orderCount, productCount, categoryCount, placeOrderCount, failedCount, packedCount, shippedCount, deliveredCount, cancelledCount });
        } else {
            res.render('admin/adminLogin', { message: msg });
            msg = '';
        }
    },

    loginPost: async (req, res) => {

        const { Email, Password } = req.body;
        const admin = await Admin.findOne({ Email });

        try {
            if (Email === admin.Email && await bcrypt.compare(Password, admin.Password)) {
                req.session.adminSession = Email;

                res.cookie('adminId', Email, {
                    maxage: 2 * 60 * 60 * 1000,
                    httpOnly: true
                });

                res.redirect('/admin');
            } else {
                msg = 'Invalid username or password';
                res.redirect('/admin');
            }
        } catch (err) {
            // res.send(err.message);
            console.log(err.message);
            msg = 'Invalid username or password';
            res.redirect('/admin');
        }
    },

    adminLogout: (req, res) => {
        try {
            res.clearCookie('adminId');
            res.clearCookie('session-1');
            res.redirect('/admin');
        } catch (error) {
            // res.send(error.message);
            console.log(error.message);
        }
    }
}