var express = require("express")
var app = express();
var _ = require("lodash")
var poll = require("./route/schema");
var uuid = require("node-uuid")
var mongoose = require("mongoose");
mongoose.connect('localhost:27017/data')

app.set("views", "./views");
app.set("view engine", "jade");

var adminRouter = require("./route/admin");
app.use(adminRouter);

var apiRouter = require("./route/apis");
app.use(apiRouter);

app.use(express.static("public"))
app.use(express.static("route"))
app.use(express.static("node_modules/bootstrap/dist"));
app.use(express.static("node_modules/jquery/dist"));



app.listen(8080, function() {
    console.log("app listening on port 8080");
})

app.get('/getsinglepoll', function(req, res) {
    poll.findOne({
            _id: req.query.id
        })
        .then(function(doc) {
            res.json(doc);
        })
})

app.get('/mypolls', function(req, res) {
    res.render("adminUser")
})

app.get('/', function(req, res) {
    res.render("layout");

})


