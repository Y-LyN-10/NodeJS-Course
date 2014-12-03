var mongoose = require('mongoose'),
    Snippet = require('../models/Snippet');

module.exports = function () {
    mongoose.connect('mongodb://localhost/users');
    var db = mongoose.connection;

    db.once('open', function(err) {
        if (err) {
            console.log('Database could not be opened: ' + err);
            return;
        }

        console.log('Database up and running...')
    });

    db.on('error', function(err){
        console.log('Database error: ' + err);
    });

    require('../models/Snippet').init();
};