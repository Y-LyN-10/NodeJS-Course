$(function(){
    $('#listAllBtn').on('click', function () {
        $.get( '/show', function(data) {

            Object.keys(data).forEach(function (key) {
                var language = data[key].language;
                var author = data[key].creator;
                var code = data[key].code;
                var id = data[key]._id;
                var newLine = '<br/>';

                var snippetDiv = $('<div />');
                snippetDiv.addClass('snippet-div');

                snippetDiv.append('<div>' + 'ID: ' + id + '</div>');
                snippetDiv.append('<div>' + 'Language: ' + language + '</div>');
                snippetDiv.append('<div>' + 'Author: ' + author + '</div>');
                snippetDiv.append(newLine);
                snippetDiv.append('<div>' + 'Code Snippet: ' + newLine + '</div>');
                snippetDiv.append('<pre>' + code + '</pre>');
                snippetDiv.append(newLine);

                $('#listedSnippets').append(snippetDiv);
            });
        });
    });
});
