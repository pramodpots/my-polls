var express = require("express")
var app = express();
var polls = require("./data/polls.json")
var _ = require("lodash")

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

//to di
app.get('/api/polls/:pollID', function(req, res) {
    var poll = polls.filter(p => p.id === req.params.pollID)
    //console.log("req: /api/polls/polID: " + poll)
    res.json(poll[0])
})

//to update option count
app.get('/api/polls/:pollID/:optName', function(req, res) {
    var poll = _.find(polls, p => p.id === req.params.pollID);
    var option = req.params.optName;
    poll.options.forEach(function(o){
        if(o.optName == option){
            o.count += 1;
        }
    });
    res.sendStatus(200);
})
//to add new option
app.get('/api/addPollOption/:pollID/:newOptName', function(req, res) {
    var poll = _.find(polls, p => p.id === req.params.pollID);
       // console.log("req: /api/add/polID/newopt: " + poll)

    //var option = req.params.newOptName;
    var opt = {
        "optName" : req.params.newOptName,
        "count" : 1
    };
    poll.options.push(opt)
    res.sendStatus(200);
})