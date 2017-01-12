var express = require("express")
var app = express();
var polls = require("./data/polls.json")

app.use(express.static("public"))
app.use(express.static("node_modules/bootstrap/dist"));
app.use(express.static("node_modules/jquery/dist"));

app.set("views", "./views");
app.set("view engine", "jade");

app.listen(8080, function() {
    console.log("app listening on port 8080");
})

app.get('/', function(req, res) {
    res.render("polls");
})
app.get('/api/polls', function(req, res) {
    res.json(polls)
})

app.get('/api/polls/:pollID', function(req, res) {
    var poll = polls.filter(p => p.id === req.params.pollID)
    res.json(poll[0])
})
