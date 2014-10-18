'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    articles = require('./articles.json'),
    fs = require('fs'),
    os = require('os'),
//    Q = require('q'),
//    deferred = Q.defer(),
    app = express();

var maxItemUrl = 'https://hacker-news.firebaseio.com/v0/maxitem.json',
    itemsUrl = 'https://hacker-news.firebaseio.com/v0/item/';

var maxItem;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

function getSavedArticlesMaxItem() {
    fs.readFile('articles.json', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        }
        var objData = JSON.parse(data);
        var idArray = [];

        for (var property in objData) {
            if (objData.hasOwnProperty(property)) {
                idArray.push(property);
            }
        }

        maxItem = idArray[idArray.length-1];
    });
}

getSavedArticlesMaxItem();

setInterval(function () {
    // Check for new items on hacker-news:
    getMaxItem();
}, 60 * 100);

function getMaxItem() {
    request.get(maxItemUrl, function (err, res, body) {
        if (!err) {
            var resultsObj = JSON.parse(body);
            if(resultsObj > maxItem){
                for (var i = maxItem+1; i <= resultsObj; i+=1) {
                    getArticle(i);
                    console.log('New item with ID: ' + i);
                }
                maxItem = resultsObj;
            }
        }
    });
}

function getArticle(itemID) {
    request.get((itemsUrl + itemID + '.json'), function (err, res, item) {
        if (err) {
            console.log(err);
        }

        item = JSON.parse(item);
        var objItem = {};
        objItem[itemID] = item;

        saveItemToFS(itemID, objItem);
    });
}

function saveItemToFS(id, item) {
    var saveData = JSON.stringify(item, os.EOL, ' ');
    if(item[id].type === 'story'){
        fs.writeFile('./articles.json', saveData, 'utf8', function (err) {
            if (err) {
                throw err;
            }
        });
        console.log('saved article');
    } else if(item[id].type === 'comment'){
        fs.writeFile('./comments.json', saveData, 'utf8', function (err) {
            if (err) {
                throw err;
            }
        });
        console.log('saved comment');
    } else {
        console.log('unrecognized item');
        console.log(item);
    }
}

// TODO: 2. Save all new articles in the file system
// - Get all articles by ID in the range from lastMaxItem to maxItem

app.listen(3001);