//Database connection

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/wikidata', { useNewUrlParser: true }, function(err) {
    if (!err) {
        console.log("Database connected");
    } else {
        console.log("Database connection failure");
    }
});

module.exports = mongoose;