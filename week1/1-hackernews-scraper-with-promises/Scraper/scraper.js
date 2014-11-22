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

var maxItemUrl = 'https://hacker-news.firebaseio.com/v0/maxitem.json',
    itemsUrl = 'https://hacker-news.firebaseio.com/v0/item/';

var maxItem, lastSavedItem;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

setTimeout(function() {
	getLastSavedItem()
    	.then(getMaxItem)
        .then(getNewItemIDs)
        .then(getContent)
        .fail(function(error) {
            console.log("Failed");
            console.log(error);
        })
        .done(function() {
            console.log('done');
        });
 }, 60 * 1000);

function getLastSavedItem() {
	var defered = Q.defer();

    fs.readFile('articles.json', 'utf8', function (err, data) {
        if (err) {
            return defered.reject(error);
        }

        var objData = JSON.parse(data);
        var idArray = [];

    	Object.getOwnPropertyNames(objData).forEach(function (property) {
            idArray.push(property);	
    	});
        
        lastSavedItem = idArray[idArray.length-1];
        console.log('get last saved item');
        console.log(lastSavedItem);
        
        // Advise: return (maxItem - n) here to get only last n articles
        defered.resolve(lastSavedItem);

    });
    return defered.promise;
};

function getMaxItem(lastSaved) {
    var defered = Q.defer();
    console.log('get max item');
    console.log(lastSaved);

    request.get(maxItemUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            maxItem = JSON.parse(body);
            defered.resolve([maxItem, lastSaved]);
        } else {
            defered.reject(error);
        }
    });

    return defered.promise;
};

function getNewItemIDs(ids) {
    var defered = Q.defer();
    var newItemIDs = [];
    var maxItem = Number(ids[0]);
    var lastSavedItem = Number(ids[1]);

    console.log('get new items id-s function');
    console.log(maxItem);
    console.log(lastSavedItem);
    
    if (maxItem > lastSavedItem) {
        for (var i = lastSavedItem + 1; i <= maxItem; i += 1) {
            newItemIDs.push(i);
            console.log('New item with ID: ' + i);
        }

        lastSavedItem = maxItem;
        defered.resolve(newItemIDs);
    }

    return defered.promise;
};

function getContent(itemIDs) {
    var defered = Q.defer();

    itemIDs.forEach(function(itemID){
        var requestUrl = itemsUrl + itemID + '.json';
        console.log(requestUrl);
        request.get(requestUrl, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                var item = JSON.parse(body);
                saveItemToFileSystem(itemID, item);
                console.log('Saved items with ID\'s: ' + itemID);

                defered.resolve(item);
            } else {
                defered.reject(error);
            }
        });
    });

    return defered.promise;
};

function saveItemToFileSystem(id, item) {
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
