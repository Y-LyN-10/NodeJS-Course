var express = require("express"),
	config = require('./config.json'),
    path = require('path'),
    querystring = require('querystring'),
    tolmort = process.argv[2],
    data = require('./data/' + tolmort),
    MongoClient = require('mongodb').MongoClient,
    url = 'mongodb://localhost:27017/users',
    util = require('util'),
    bodyParser = require('body-parser'),
	// passport = require('passport'),
	// LocalStrategy = require('passport-local').Strategy,
    user = {},
    app = express();


app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.post('/login', function(req, res) {
	var chunk = '';

    req.on('data', function (data, err) {
    	if(err){
			console.log(err);
		}
        
        chunk += data;
    });

    req.on('end', function () {
    	chunk = util.inspect(querystring.parse(chunk));
		res.end(chunk);

		// user['username'] = chunk;
		// user['password'] = chunk['password'];
    });
});

MongoClient.connect(url, function(err, db) {
    var collectionName = path.basename(tolmort, '.json'),
        collection = db.collection(collectionName);

    console.log('Connected correctly to the server');

    // collection.insert(data, function(err, result) {
    //     console.log("Inserted something into the document collection");
    //     console.log(result);
    // });

	// collecion.find();

    db.close();
});

app.listen(3000);