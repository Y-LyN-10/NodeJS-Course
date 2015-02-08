var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./config/routes')(app);

app.listen(port);
console.log('Listening on port ' + port);

module.exports = app;