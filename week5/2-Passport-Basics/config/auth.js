var passport = require('passport'),
    LocalPassport = require('passport-local'),
    mongoose = require('mongoose'),
    User = mongoose.model('registered_user');

passport.use(new LocalPassport(function(username, password, done) {
    User.findOne({ username: username }).exec(function(err, user) {
        if (err) {
            console.log('Error loading user: ' + err);
            return;
        }

        if(user){
            if(password === user.password){
                return done(null, {username: username})
            } else {
                return done(null, false, {errmsg: 'Wrong password!'})
            }
        } else {
            return done(null, false, {errmsg: 'No registered user with "' + username + '" username'});
        }
    })
}));

passport.serializeUser(function (user, done) {
    done(null, user.username);
});

passport.deserializeUser(function (username, done) {
    done(null, {username: username});
});

module.exports = passport;