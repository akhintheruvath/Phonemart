const express = require('express');
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const Handlebars = require('handlebars');
const hbs = require('express-handlebars');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const PORT = process.env.PORT;

const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));
app.use("/uploads", express.static('uploads'));     // for multer

if(!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");          // for multer
}

app.set('view engine','hbs');
app.set('views',path.join(__dirname,'views'));
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutDir:'./views/layouts/',partialsDir:'./views/partials'}));

Handlebars.registerHelper("inc", function(value)
{
    return parseInt(value) + 1;
});

Handlebars.registerHelper("multiply",function(value1,value2){
    return value1 * value2;
});

Handlebars.registerHelper('times', function(n, block) {
    let accum = '';
    for(let i = 1; i <= n; ++i) accum += block.fn(i);
    return accum;
});

app.use(
    session({
        name: "session-1",
        secret: "Secret",
        saveUninitialized: false,
        resave: false
    })
);

app.use(cookieParser());

app.use(function (req, res, next) {
    res.set(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    next();
});

app.use('/', userRouter);
app.use('/admin', adminRouter);

mongoose.connect('mongodb://localhost/phonemart').then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
        console.log('Server started');
    });
}).catch((error) => {
    console.log(error.message);
})