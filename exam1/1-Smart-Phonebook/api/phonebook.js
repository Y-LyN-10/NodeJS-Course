'use strict';

var	MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    Db = require('mongodb').Db,
    url = 'mongodb://localhost:27017/phonebook',
    collection,
    contactsDB = {};

var server = new Server('localhost', 27017, { auto_reconnect: true });
var db = new Db('phonebook', server);

MongoClient.connect(url, function(err, db) {
    if(err) throw err;

    collection = db.collection('phonebook');
});

exports.index = function(req, res) {
    res.send('This is smart phonebook\'s welcome page <br/>' +
    '<br/> Routes: <br/>' +
    '[GET] - \'/\' - Index page <br>' +
    '[GET] - \'/contacts\' - List all contacts <br/>' +
    '[POST] - \'/contacts/create\' - Add contact <br/>' +
    '[GET] - \'/contacts/details/:id\' - Show contact details<br/>' +
    '[PUT] - \'/contacts/details/:id\' - Update contact<br/>' +
    '[DELETE] - \'/contacts/delete/:id\' - Remove contact <br/>' +
    '[GET] - \'/contacts/groups\' - Show contact groups <br/><br/>' +
    'Contacts consist of two things: \'phoneNumber\' and \'personIdentifier\'');
};

exports.allContacts = function(req, res) {
    collection.find().toArray(function(err, results) {
        contactsDB = results;
        db.close();

        res.send(contactsDB);
    });
};

exports.addContact = function(req, res) {
    var contact = req.body;

    collection.insert(contact, function(err, docs) {
        res.send('Contact successfully created with id ' + contact._id);
    });
};

exports.removeContact = function(req, res) {
    var contactID = req.params.id;

    collection.remove({"_id": ObjectId(contactID)}, function(err, docs) {
        res.send( (docs === 1) ?
            'Contact is successfully removed from your phonebook' : 'error: '+ err);
    });
};

exports.contactDetails = function(req, res) {
    var contactID = req.params.id;

    collection.find({"_id": ObjectId(contactID)}).toArray(function(err, result) {
        res.send(result);
    });
};

exports.updateContact = function(req, res) {
    res.status(501); // Not implemented
    res.send(501); // Not implemented
    // TODO: implement updateContact function
};

exports.showGroups = function(req, res){
    res.status(501); // Not implemented
    res.send(501);
    // TODO: implement showGroups function
};

// TODO: add Validations