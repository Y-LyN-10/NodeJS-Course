var mongoose = require('mongoose');

module.exports.init = function () {
    var userSchema = new mongoose.Schema({
        username: {type: String, required: true, unique: true },
        password: {type: String, required: true}
    });

    var User = mongoose.model('registered_user', userSchema);

    // Some example data
    //var adminUser = new User({username: 'admin', password: 'admin'});
    //adminUser.save(function (err, user) {
    //   console.log(user);
    //});

    //var pandaUser = new User({username: 'Panda', password: 'chucknorris'});
    //pandaUser.save(function (err, user) {
    //   console.log(user);
    //});

    //var dumbUser = new User({username: 'username', password: 'qwerty'});
    //dumbUser.save(function (err, user) {
    //   console.log(user);
    //});
};