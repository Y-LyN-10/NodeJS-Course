'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    articles = require('./articles.json'),
    comments = require('./comments.json'),
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
//                    console.log('New item with ID: ' + i);
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

        if(item !== null){
            item = JSON.parse(item);
            saveItemToFS(itemID, item);
        } else {
            // It happened to me once
            console.log('There was something, but it\'s null - maybe deleted? xD');
        }
    });
}

function saveItemToFS(id, item) {
    if(item.type === 'story'){
        articles[id] = item;
        var saveData = JSON.stringify(articles, os.EOL, ' ');
        fs.writeFile('./articles.json', saveData, 'utf8', function (err) {
            if (err) {
                throw err;
            }
        });
        console.log('saved article with ID: ' + id +' | Title: ' + item.title);
    } else if(item.type === 'comment'){
        comments[id] = item;
        var saveData = JSON.stringify(comments, os.EOL, ' ');
        fs.writeFile('./comments.json', saveData, 'utf8', function (err) {
            if (err) {
                throw err;
            }
        });
        console.log('saved comment with ID: ' + id);
    } else {
        console.log('unrecognized item: ');
        console.log(item);
    }
}

app.listen(3001);