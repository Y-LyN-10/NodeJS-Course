'use strict';

var http = require('http'),
    port = 3000,
    qs = require('querystring'),
    randomToken = require('./tokens');

var data = {};

http.createServer(function (request, response) {
    var allChirps = [];
    var routes = {
        '/all_chirps' : getAllChirps,
        '/chirp' : chirpController,
        '/all_users' : getAllRegisteredUsers,
        '/register' : register,
        '/my_chirps' : getAllUserChirps
    };

    function createNewChirp(request) {
        // expects either chirpId or userId as an argument.
        // If given both ignores chirpId.
        // Returns a list of chirps.
    }

    function getChirpList(request) {
        //expects user, key and chirpText arguments.
        //Creates a new chirp on behalf of user and returns a chirpId, which should be unique for every chirp!
    }

    function deleteChirp(request) {
        //expects key and chirpId as arguments
        //Deletes the chirp with the given id if the key matches the key of the chirp owner.
        // Otherwise returns a 403 response code.
    }

    function chirpController(request, response) {
        var method = request.method;

        if(method === 'GET'){
            createNewChirp(request);
        } else if(method === 'POST'){
            getChirpList(request);
        } else if(method === 'DELETE'){
            deleteChirp(request);
        } else{
            // throw exception
        }

        response.end("END!");
    }

    function getAllChirps() {
        //Returns all the chirps for all the users we have.
        // Newest chirps should be first.
        response.end(JSON.stringify(allChirps));
    }

    function getAllRegisteredUsers() {
        //returns all the registered users
    }

    //expects user as argument
    function register() {
        var userName = request.params;

        response.end(JSON.stringify(userName));

//        if(request.user in data){
//            response.end(response.statusCode);
//        } else {
//            response.end(JSON.stringify(data));
//        }

        //Creates a new user and returns a key for that user.
        //If the user already exists just returns a 409 response code.
    }

    //expects user and key as arguments
    function getAllUserChirps() {
        //Returns all chirps of user
    }

    if(routes[request.url]){
        routes[request.url].call(null, request, response);
    }

    request.on('end', function (chunk) {
        response.writeHead(200, "OK", {'Content-Type': 'JSON'});
    });

}).listen(port);

console.log('Listening on port ' + port);