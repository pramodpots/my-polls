var express = require("express")
var app = express();
var _ = require("lodash")
var uuid = require("node-uuid")
var mongoose = require("mongoose");
mongoose.connect('localhost:27017/data')
var Schema = mongoose.Schema;
var userDataSchema = new Schema({
    uname: String,
    id: String

})
var pollsSchema = new Schema({
    question: String,
    options: [{
        optName: String,
        count: Number
    }],
    owner_id: String,
})
var userData = mongoose.model('userData', userDataSchema)
var poll = mongoose.model('pollsData', pollsSchema)
    /*

    app.get('/insert/user', function(req, res) {
        var item = {
            uname: "ppmakeitcount",
            id: uuid.v4()
        }
        var data = new userData(item);
        data.save();
        res.json(data);
    })*/

/*
app.get('/show/user', function(req, res) {
    userData.find()
        .then(function(doc) {
            res.json(doc);
        })
})*/
app.get('/show/poll', function(req, res) {
    poll.find()
        .then(function(doc) {
            res.json(doc);
        })
})

app.use(express.static("public"))
app.use(express.static("node_modules/bootstrap/dist"));
app.use(express.static("node_modules/jquery/dist"));

app.set("views", "./views");
app.set("view engine", "jade");

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


app.get('/admin', function(req, res) {
    res.render("adminUser");
})

app.get('/api/polls', function(req, res) {
    poll.find()
        .then(function(doc) {
            res.json(doc);
        })
})

//to di
/*app.get('/api/polls/:pollID', function(req, res) {
    var poll = polls.filter(p => p.id === req.params.pollID)
    res.json(poll[0])
})
*/
//to update option count
app.get('/api/polls/:pollID/:optName', function(req, res) {
        //var poll = _.find(polls, p => p.id === req.params.pollID);
        var option = req.params.optName;
        var p = req.params.pollID;
        console.log(option + p)

        poll.findById(p, function(err, doc) {
            if (err) console.log(err);
            doc.options.forEach(function(o) {
                if (o.optName == option) {
                    o.count += 1;
                }
            })
            doc.save();
        })
        res.sendStatus(200)
    })
    //to add new option
app.get('/api/addPollOption/:pollID/:newOptName', function(req, res) {
    var p = req.params.pollID;
    var temp = {
        "optName": req.params.newOptName,
        "count": 0
    }
    poll.findById(p, function(err, doc) {
        if (err) console.log(err);
        doc.options.push(temp)
        doc.save();
    })
    res.sendStatus(200)
})

app.get('/admin/myPolls', function(req, res) {
    res.render('adminUser')
})

app.get('/admin/addPoll', function(req, res) {
    res.render('addpoll');
})

app.get('/admin/create', function(req, res) {

    var options = [];
    var optArr = req.query.options.split('/');

    optArr.forEach(function(o) {
        var temp = {
            "optName": o,
            "count": 0
        }
        options.push(temp);
    })
    var question = req.query.question;
    var newPoll = {
        "question": question,
        "options": options,
        "owner_id": "587c73f8b05f875c12ccaa26"
    }
    var data = new poll(newPoll);
    data.save();
    res.redirect('/')

})

app.get('/admin/delete', function(req, res) {
    var id = req.query.id
    console.log(id)
    poll.findByIdAndRemove(id, function (err, poll) {  
    // We'll create a simple object to send back with a message and the id of the document that was removed
    // You can really do this however you want, though.
    var response = {
        message: "Todo successfully deleted",
        id: poll._id
    };
    res.redirect('/');
});
})
