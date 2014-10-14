'use strict';

var express = require ('express'),
    bodyParser = require('body-parser'),
//    subscribers = require('./subscribers.json'),
//    articles = require('./articles.json'),
//    fs = require('fs'),
    app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/newArticles', function(req, res) {
    // A request to this URL makes the notifier read the data from
    // articles.json and subscribers.json and send the respective mails.
});

//TODO: ... Matching phase
/* It is enough only 1 of the keywords from a bag of keywords for a given
 subscriber to match in a story's title, for the notifier to send an email.*/

//TODO: ... Sending notifications
/* For one subscriber, the notifier should check for all new articles if there
   are any matches and send the articles that match in one email. */

app.listen(3001);