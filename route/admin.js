var express = require("express");
var router = express.Router();
module.exports = router;
var poll = require("./schema");



router.get('/admin', function(req, res) {
    res.render("adminUser");
})


router.get('/admin/myPolls', function(req, res) {
    res.render('adminUser')
})

router.get('/admin/addPoll', function(req, res) {
    res.render('addpoll');
})

router.get('/admin/create', function(req, res) {

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

router.get('/admin/delete', function(req, res) {
    var id = req.query.id
    console.log(id)
    poll.findByIdAndRemove(id, function(err, poll) {
        if (err) return err;
        res.redirect('/');
    });
})
