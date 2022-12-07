const users = require('../models/userModel');

const customerAuth = async (req, res, next) => {
    if (!req.session.customer) {
        let err = new Error("You are not authenticated");
        res.setHeader("WWW-Authenticate", "Basic");
        err.status = 401;
        res.redirect("/login");
        next(err);
    }else{
        const userEmail = req.session.customer;
        console.log();
        blockStatus = (await users.findOne({Email:userEmail})).Block;
        if(blockStatus){
            req.session.customer = null;
            return next();
        }else{
            return next();
        }
    }
};

module.exports = customerAuth;