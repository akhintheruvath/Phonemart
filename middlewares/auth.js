const auth = (req, res, next) => {
    if (!req.session.adminSession) {
        let err = new Error("You are not authenticated");
        res.setHeader("WWW-Authenticate", "Basic");
        err.status = 401;
        res.redirect("/admin");
        next(err);
    }else{
        next();
    }
};

module.exports = auth;