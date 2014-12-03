'use strict';

require('./config/mongoose')();

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    Snippet = require('mongoose').model('snippets'),
    port = parseInt(process.env.PORT, 10) || 3000;

app.set('view engine', 'jade');
app.set('views', './views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/create', function(req, res) {
    res.render('create');
});

app.get('/show/:id', function(req, res) {
    Snippet.find({_id: req.param('id')}).exec(function (err, result) {
        res.send(result);
    });
});

app.get('/show', function(req, res) {
    Snippet.find({}).exec(function (err, result) {
        res.send(result);
    });
});

app.post('/create', function(req, res) {
    new Snippet(
        {
            language: req.body.language,
            code: req.body.code,
            creator: req.body.creator
        }).save(function (err, snippet) {
            res.redirect('/show/' + snippet._id);
    });
});

app.get('/update', function (req, res) {
   res.render('update');
});

app.post('/update/:id', function(req, res) {
    var updatedObj = {
        _id: req.params.id,
        language: req.body.language,
        code: req.body.code,
        creator: req.body.creator
    };

    Snippet.findOne({_id: req.params.id}, function (err, snippet) {
        if(err){
            res.json(err);
        } else if(!snippet){
            res.json('Snippet with this ID doesn\'t exist');
        } else {
            Snippet.update(snippet, updatedObj, function(err, result){
                res.redirect('/')
            });
        }
    });
});

app.delete('/delete/:id', function(req, res) {
    Snippet.findOne({_id: req.params.id}, function (err, snippet) {
        if(err){
            res.json(err);
        } else if(!snippet){
            res.json('Snippet with this ID doesn\'t exist');
        } else {
            Snippet.remove(snippet, function(err, result){
                res.send('Snippet is deleted');
            });
        }
    });
});

console.log("Server running on port: " + port);
app.listen(port);