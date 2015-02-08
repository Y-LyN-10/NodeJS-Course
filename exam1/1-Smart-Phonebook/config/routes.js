'use strict';

var phonebook = require('./../api/phonebook');

module.exports = function (app) {
    'use strict';

    app.get('/', phonebook.index);
    app.get('/contacts', phonebook.allContacts);
    app.post('/contacts/create', phonebook.addContact);
    app.get('/contacts/details/:id', phonebook.contactDetails);
    app.put('/contacts/details/:id', phonebook.updateContact);
    app.delete('/contacts/details/:id', phonebook.removeContact);
    app.get('/contacts/groups', phonebook.showGroups);
};