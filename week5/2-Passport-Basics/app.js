var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    port = parseInt(process.env.PORT, 10) || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

// TODO: Connect with MongoDb

// TODO: Use passport to implement the login / logout functionallity

var user = {};

app.get('/', function(req, res) {
    res.render('index');
});

app.post('/login', function(req, res) {
    console.log(req.body);

	user['username'] = req.body.username;
	user['password'] = req.body.password;

    // TODO: checks for existing user, etc...
    res.send(user);
});

app.post('/logout', function(req, res) {
    // TODO: ...
});

console.log("Server running on port: " + port);
app.listen(port);
