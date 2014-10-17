'use strict';

var express = require ('express'),
    bodyParser = require('body-parser'),
    rand = require('generate-key'),
    subscribers = require('./subscribers.json'),
    fs = require('fs'),
    os = require('os'),
    app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
    res.send('Welcome!');
});

app.post('/subscribe', function(req, res) {
    var email = req.body.email;
    var keywords = req.body.keywords.split(/[^a-zA-Z0-9]/).filter(Boolean);
    var subscriberID = rand.generateKey(10);

    var subscriber = {};
    subscriber.email = email;
    subscriber.keywords = keywords;

    subscribers[subscriberID] = subscriber;
    saveSubscribersList();
    res.json(subscriberID);
});

app.post('/unsubscribe', function(req, res) {
    var id = req.body.subscriberID;
    delete subscribers[id];

    saveSubscribersList();
    res.sendStatus(200);
});

function saveSubscribersList() {
    var saveData = JSON.stringify(subscribers, os.EOL, ' ');
    fs.writeFile('./subscribers.json', saveData, 'utf8', function (err) {
        if (err) {
            throw err;
        }
    });
}

app.get('/listSubscribers', function(req, res) {
    res.json(subscribers);
});

app.listen(3000);