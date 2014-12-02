'use strict';

require('./config/mongoose')();

var express = require('express'),
    app = express(),
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

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/user', function (req, res) {
   if(!req.session.passport.user){
       res.redirect('/');
   } else {
       res.send('<h2>Welcome, ' + req.user.username + '!</h2>');
       res.end();
   }
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

app.post('/login', passport.authenticate('local', {
    failureRedirect: '/',
    successRedirect:  '/user'
}));

console.log("Server running on port: " + port);
app.listen(port);
