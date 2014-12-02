var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    passport = require('./config/auth'),
    port = parseInt(process.env.PORT, 10) || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: 'panda'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + "/public"));

mongoose.connect('mongodb://localhost/users');

var db = mongoose.connection;
var user = {};
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

app.get('/', function(req, res) {
    res.render('index');
});
app.get('/user', function (req, res) {
   if(!req.session.passport.user){
       res.redirect('/');
   } else {
       res.send('Welcome, ' + req.user.username);
       res.end();
   }
});
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

app.post('/login', passport.authenticate('local', {
    failureRedirect: '/index',
    successRedirect:  '/user'
}));

console.log("Server running on port: " + port);
app.listen(port);