var express = require('express'),
    bodyParser = require('body-parser'),
    format = require('util').format,
	app = express();

var	MongoClient = require('mongodb').MongoClient,
	Server = require('mongodb').Server,
	Db = require('mongodb').Db,
	ObjectId = require('mongodb').ObjectID,
	url = 'mongodb://27017/phonebook',
	contactsDB = {},
	collection;

var server = new Server('localhost', 27017, { auto_reconnect: true });
var db = new Db('phonebook', server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// TODO: Export database operations as module if it's possible
MongoClient.connect('mongodb://127.0.0.1:27017/phonebook', function(err, db) {
    if(err) throw err;

 	collection = db.collection('phonebook');
});

app.get('/', index);
app.get('/contacts', allContacts);
app.post('/contacts/create', addContact);
app.get('/contacts/details/:id', contactDetails);
app.delete('/contacts/delete/:id', removeContact);
app.get('/contacts/groups', showGroups);

function index(req, res) {
	res.send('This is smart phonebook\'s welcome page');
};

function allContacts(req, res) {
    collection.find().toArray(function(err, results) {
        contactsDB = results;
        db.close();

		res.send(contactsDB);
    });
};

function addContact(req, res) {
	var contact = req.body;

	collection.insert(contact, function(err, docs) {
       res.send('Contact successfully created with id ' + contact._id);
    });
};

function removeContact(req, res) {
    var contactID = req.params.id;

    collection.remove({"_id": ObjectId(contactID)}, function(err, docs) {
    	res.send( (docs === 1) ? 
    		{ msg: 'Contact is successfully removed from your phonebook' } : 
    		{ msg: 'error: '+ err } );
    });
};

function contactDetails(req, res) {
	var contactID = req.params.id;

	collection.find({"_id": ObjectId(contactID)}).toArray(function(err, result) {
		res.send(result);
    });
};

function showGroups(req, res) {
    res.send('TODO groups here...');
};

app.listen(3000);