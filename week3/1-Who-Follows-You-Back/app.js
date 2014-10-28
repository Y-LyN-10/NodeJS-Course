'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    // fs = require('fs'),
    // os = require('os'),
    Graph = require("./graph"),
    rand = require('generate-key'),
    app = express();

// var graph1 = new Graph(..);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var exampleJSON = {
  "username": "kunev",
  "depth": 3
};

// method for all: GET
var apiUrls = {
	baseURL: 'https://api.github.com',
	getSingleUser: '/users/:username',
	listFollowrs: '/users/:username/followers',
	listFollowing: '/users/:username/following',
	isFollowingCheck: '/users/:username/following/:target_user'
}

app.get('/', function (req, res) {
  res.send('Index page');
});

app.post('/createGraphFor', function(req, res){
	// accepts a JSON
	// returns unique graph id or message "No"
	createGraphFor(req);
	
	res.send(rand.generateKey(5) + login);
});

app.get('/graph/:graphId', function (req, res) {
	// returns the social graph for the given graphId, else...
    res.send('The graph with ID ' + req.params.graphId + ' is not ready yet');
});

app.get('/mutually_follow/:graphId/:username', function (req, res) {
	// returns the social graph for the given graphId, else...
	var graphId = req.params.graphId;
	var username = req.params.username;

	/* If the user's social graph (graphId) and the given 
		username follows each other, this should return: */

	// {
	//     "relation": "mutual"
	// }

	// If the first user follows the second, but not vice versa:

	// {
	//     "relation": "first"
	// }
	
	// In the opposite situation:

	// {
	//     "relation": "second"
	// }

    res.send('This functionallity is not implemented yet' + 
    	'<p> Graph Id is: ' + graphId +
    	'<br> Username is: ' + username);
});

function createGraphFor(jsonData){
	var username = jsonData.login;
}

app.listen(8000);