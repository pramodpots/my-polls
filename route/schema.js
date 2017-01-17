'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var pollsSchema = new Schema({
    question: String,
    options: [{
        optName: String,
        count: Number
    }],
    owner_id: String,
})

module.exports = mongoose.model('pollsData', pollsSchema);
