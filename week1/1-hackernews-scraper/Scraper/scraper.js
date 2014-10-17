'use strict';

var express = require ('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

setInterval(function() {
    /* TODO: 1. Check for new articles on hacker-news:
            - Get maxItem (id)
            - Get all articles by ID in the range from lastKnownArticleID to maxItem
       TODO: 2. Save all new articles in the file system */
}, 60 * 3000);

request.get('https://hacker-news.firebaseio.com/v0/maxitem.json', function(req))

app.listen(3001);