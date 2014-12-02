'use strict';

var config = require('./config.json'),
    jsonData = process.argv[2],
    data = require('./' + jsonData),
    MongoClient = require('mongodb').MongoClient,
    path = require('path'),
    fs = require('fs');

var url = 'mongodb://localhost:27017/people';

MongoClient.connect(url, function(err, db) {
    if(err) { return console.log(err); }

    var collectionName = path.basename(jsonData, '.json');
    var collection = db.collection(collectionName);
    var newData = [];

    for(var key in data){
       newData.push(data[key]);
    }

    // Using the {w:1} option ensure you get the error back if the document fails to insert correctly.
    collection.insert(newData, {w:1}, function(err, result){
        if(err) {
            console.log(err.errmsg);
        } else if (result){
            console.log(result.ops.length + " documents inserted");
        }

        db.close();
    });

    console.log('Connected correctly to the server');
});

