'use strict';

require('./config/mongoose')();

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    Snippet = require('mongoose').model('snippets'),
    port = parseInt(process.env.PORT, 10) || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
   res.send('API\'s endpoints:' + '<br>' +
   '[GET] - \'/snippets\' - Listing all snippets' + '<br>' +
   '[POST] - \'/snippets\' - Creating snippets' + '<br>' +
   '[GET] - \'/snippets/:id\' - Listing a single snippet by ID' + '<br>' +
   '[GET] - \'/snippets/:creator\' - Listing snippets by creator' + '<br>' +
   '[PUT] - \'/snippets/:id\' - Updating existing snippet' + '<br>' +
   '[DELETE] - \'/snippets/:id\' - Deleting a snippet' + '<br>');
});

app.get('/snippets', function(req, res) {
    Snippet.find({}).exec(function (err, result) {
        res.json(result);
    });
});

app.get('/snippets/:creator', function(req, res) {
    Snippet.find({creator: req.param('creator')}).exec(function (err, result) {
        res.json(result);
    });
});

app.get('/snippets/:id', function(req, res) {
    Snippet.find({_id: req.param('id')}).exec(function (err, result) {
        res.json(result);
    });
});

app.post('/snippets', function(req, res) {
    console.log(req.body);

    new Snippet(
        {
            language: req.body.language,
            fileName: req.body.fileName,
            creator: req.body.creator,
            code: req.body.code
        }).save(function (err, snippet) {
            res.send(snippet._id);
        });
});

app.put('/snippets/:id', function(req, res) {
    var updatedObj = {
        //_id: req.params.id,
        language: req.body.language,
        fileName: req.body.fileName,
        code: req.body.code,
        creator: req.body.creator
    };

    Snippet.findOne({_id: req.params.id}, function (err, snippet) {
        if(err){
            res.json(err);
        } else if(!snippet){
            res.json('Snippet with this ID doesn\'t exist in database');
        } else {
            Snippet.update(snippet, updatedObj, function(){
                res.send('Snippet is updated');
            });
        }
    });
});

app.delete('/snippets/:id', function (req, res) {
    Snippet.findOne({_id: req.params.id}, function (err, snippet) {
        if(err){
            res.json(err);
        } else if(!snippet){
            res.json('Snippet with this ID doesn\'t exist');
        } else {
            Snippet.remove(snippet, function(){
                res.send('Snippet is deleted');
             });
        }
    });
});

console.log("Server running on port: " + port);
app.listen(port);