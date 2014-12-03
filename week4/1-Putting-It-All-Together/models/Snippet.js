var mongoose = require('mongoose'),
    jsesc = require('jsesc');

module.exports.init = function () {
    var snippetSchema = new mongoose.Schema({
        language: String,
        //fileName: String
        creator: String,
        code: String
    });

    var Snippet = mongoose.model('snippets', snippetSchema);

};