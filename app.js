var express = require("express")
require("./config/passport")
require('dotenv').load();
var app = express();
var _ = require("lodash")
var passport = require("passport");
var poll = require("./route/schema");
var User = require("./route/userschema");
var uuid = require("node-uuid")
var mongoose = require("mongoose");
var session = require("express-session");
var bodyParser = require('body-parser')

mongoose.connect('localhost:27017/data')


app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use(session({
    secret: 'ppmakeitcountsapp',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.set("views", "./views");
app.set("view engine", "jade");


app.use(express.static("public"))
app.use(express.static("route"))
app.use(express.static("node_modules/bootstrap/dist"));
app.use(express.static("node_modules/jquery/dist"));


app.listen(8080, function() {
    console.log("app listening on port 8080");
})



//unauthorized user functionality
app.get('/', function(req, res) {
    res.render("layout");
})

var apiRouter = require("./route/apis");
app.use(apiRouter);


app.get('/login', passport.authenticate('twitter'));
app.get('/mypolls', function(req, res) {
    res.render("layout")
})

app.route('/auth/twitter/callback')
    .get(passport.authenticate('twitter', {
        successRedirect: '/admin',
        failureRedirect: '/'
    }));
    
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


app.use(function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
        return
    }
    res.redirect('/');
})

var adminRouter = require("./route/admin");
app.use(adminRouter);
