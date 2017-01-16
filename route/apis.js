var express = require("express");
var router = express.Router();
module.exports = router;
var poll = require("./schema");



router.get('/api/polls', function(req, res) {
    poll.find()
        .then(function(doc) {
            res.json(doc);
        })
})

//to update option count
router.get('/api/polls/:pollID/:optName', function(req, res) {
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
router.get('/api/addPollOption/:pollID/:newOptName', function(req, res) {
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
