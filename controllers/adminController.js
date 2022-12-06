const session = require('express-session');
const Admin = require('../models/adminModel');
const users = require('../models/userModel');
const bcrypt = require('bcrypt');

let msg = '';

module.exports = {
    loginGet : async (req,res) => {
        if(req.session.adminSession){
            let userCount = await users.countDocuments();

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

            console.log(allOrders);

            res.render('admin/adminHome',{admin:true,userCount});
        }else{
            res.render('admin/adminLogin',{message:msg});
            msg = '';
        }
    },

    loginPost: async (req,res) => {
        
        const { Email, Password } = req.body;
        const admin = await Admin.findOne({ Email });

        try{
            if(Email===admin.Email && await bcrypt.compare(Password, admin.Password)){
                req.session.adminSession = Email;

                res.cookie('adminId', Email, {
                    maxage: 2 * 60 * 60 * 1000,
                    httpOnly : true
                });

                res.redirect('/admin');
            }else{
                msg = 'Invalid username or password';
                res.redirect('/admin');
            }
        }catch(err){
            // res.send(err.message);
            console.log(err.message);
            msg = 'Invalid username or password';
            res.redirect('/admin');
        }
    },

    adminLogout: (req,res) => {
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