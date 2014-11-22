'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    articles = require('./articles.json'),
    comments = require('./comments.json'),
    Q = require("q"),
    fs = require('fs'),
    os = require('os'),
    app = express();

var MAX_ITEM_URL = 'https://hacker-news.firebaseio.com/v0/maxitem.json',
    ITEMS_URL = 'https://hacker-news.firebaseio.com/v0/item/',
    JSON_EXT = '.json';

var seconds = 60 * 2000;
var lastSavedItem;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

loop(seconds);

function loop(seconds){
    console.log('Waitng for the timeout');

    setTimeout(function() {
    	getLastSavedItem()
        	.then(getNewMaxItem)
            .then(getNewItemIDs)
            .then(getData)
            .then(saveItemsToFS)
            .fail(function(error) {
                console.log("Failed");
                console.log(error);
            })
            .done(function(msg) {
                console.log(msg);
                loop(seconds);
            });
     }, seconds);
}

function getLastSavedItem() {
	var defered = Q.defer();
    var filesToRead = ['articles', 'comments'];

    filesToRead.forEach(function(fileName, index) {
        var maxFoundItem;
        fs.readFile(fileName + JSON_EXT, 'utf8', function(err, data) {
            if (err) { return defered.reject(error); }

            var objData = JSON.parse(data);
            var idArray = [];

            Object.getOwnPropertyNames(objData).forEach(function(property) { idArray.push(property);});
            maxFoundItem = Math.max.apply(Math, idArray);
            
            lastSavedItem = lastSavedItem > maxFoundItem ? lastSavedItem : maxFoundItem;

            if (index === filesToRead.length - 1) {
                console.log('Last saved item is: ' + lastSavedItem);

                // Advise: return (maxItem - n) here to get only last n articles
                defered.resolve();
            }

        });
    });

    return defered.promise;
}

function getNewMaxItem() {
    var defered = Q.defer();

    request.get(MAX_ITEM_URL, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var maxItem = JSON.parse(body);
            console.log('Max item is: ' + maxItem);
            defered.resolve(maxItem);
        } else {
            defered.reject(error);
        }
    });

    return defered.promise;
};

function getNewItemIDs(maxItem) {
    var defered = Q.defer();
    var newItemIDs = [];
    
    if (maxItem > lastSavedItem) {
        var i = lastSavedItem + 1;
        for (i; i <= maxItem; i += 1) {
            newItemIDs.push(i);
        }

        console.log('New items with IDs: ' + newItemIDs);
        defered.resolve(newItemIDs);
    } else {
        defered.resolve(maxItem);
    }

    return defered.promise;
};

function getData(itemIDs) {
    var defered = Q.defer();
    var newData = {};

    itemIDs.forEach(function(itemID, index){
        var requestUrl = ITEMS_URL + itemID + JSON_EXT;
        request.get(requestUrl, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                var item = JSON.parse(body);
                newData[itemID] = item;

                if (index === itemIDs.length-1) {
                    console.log('All new items are scraped successfully');
                    defered.resolve(newData);
                }
            } else {
                return defered.reject(error);
            }
        });
    });

    return defered.promise;
};

function saveItemsToFS(data) {
    var defered = Q.defer();
    var numberOfItems = Object.keys(data).length;
    var stupidCounter = 0;

    for (var key in data) {
        var item = data[key];

        if(item.type === 'story'){
            articles[key] = item;
            
            var saveData = JSON.stringify(articles, os.EOL, ' ');
            fs.writeFile('./articles.json', saveData, 'utf8', function (err) {
                if (err) { return defered.reject(error); }

                console.log('Saved to file system article with ID: ' + key +' | Title: ' + item.title);
            });

        } else if(item.type === 'comment'){
            comments[key] = item;

            var saveData = JSON.stringify(comments, os.EOL, ' ');
            fs.writeFile('./comments.json', saveData, 'utf8', function (err) {
                if (err) { return defered.reject(error); }
                console.log('saved comment with ID: ' + key);
            });
            
        } else {
            console.log('unrecognized item: ');
            console.log(item);
        }

        stupidCounter++;
        if(stupidCounter === numberOfItems-1){
            lastSavedItem = key;
            defered.resolve('All new items are saved.');
        }

    }
    
    return defered.promise;
}


app.listen(3001);
