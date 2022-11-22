const session = require('express-session');
const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');

let msg = '';

module.exports = {
    loginGet : (req,res) => {
        if(req.session.adminSession){
            res.render('admin/adminHome',{admin:true});
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