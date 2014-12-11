var	MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    Db = require('mongodb').Db,
    ObjectId = require('mongodb').ObjectID,
    url = 'mongodb://27017/phonebook',
    contactsDB = {},
    collection;

var server = new Server('localhost', 27017, { auto_reconnect: true });
var db = new Db('phonebook', server);

MongoClient.connect('mongodb://127.0.0.1:27017/phonebook', function(err, db) {
    if(err) throw err;

    collection = db.collection('phonebook');
});

module.exports = function (app) {
    'use strict';

    app.get('/', index);
    app.get('/contacts', allContacts);
    app.post('/contacts/create', addContact);
    app.get('/contacts/details/:id', contactDetails);
    app.put('/contacts/details/:id', updateContact);
    app.delete('/contacts/details/:id', removeContact);
    app.get('/contacts/groups', showGroups);

    function index(req, res) {
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
    }

    function allContacts(req, res) {
        collection.find().toArray(function(err, results) {
            contactsDB = results;
            db.close();

            res.send(contactsDB);
        });
    }

    function addContact(req, res) {
        var contact = req.body;

        collection.insert(contact, function(err, docs) {
            res.send('Contact successfully created with id ' + contact._id);
        });
    }

    function removeContact(req, res) {
        var contactID = req.params.id;

        collection.remove({"_id": ObjectId(contactID)}, function(err, docs) {
            res.send( (docs === 1) ?
            'Contact is successfully removed from your phonebook' : 'error: '+ err);
        });
    }

    function contactDetails(req, res) {
        var contactID = req.params.id;

        collection.find({"_id": ObjectId(contactID)}).toArray(function(err, result) {
            res.send(result);
        });
    }

    function updateContact(req, res) {
        res.status(501); // Not implemented
        res.send(501); // Not implemented
        // TODO: implement updateContact function
    }

    function showGroups(req, res){
        res.status(501); // Not implemented
        res.send(501);
        // TODO: implement showGroups function
    }

    // TODO: add Validations
};