const users = require('../models/userModel');

// async function isUserBlocked(req,res){
//     const userEmail = req.session.customer;
//     blockStatus = (await users.findOne({Email:userEmail})).Block;
//     console.log('blockStatus: '+blockStatus);
//     return blockStatus;
// }

const auth = (req, res, next) => {
    if (!req.session.customer) {
        let err = new Error("You are not authenticated");
        res.setHeader("WWW-Authenticate", "Basic");
        err.status = 401;
        res.redirect("/");
        next(err);
    }else{
        next();
    }
};

module.exports = auth;