

if(routes[req.url]){
    routes[req.url].call(null, req, res);
}

http.get({ host: 'localhost:' + port, path: '/all_chirps' }, function (res) {
    var chirps = '';

    request.on('data', function (chunk) {
        //returns all the chirps for all the users we have. Newest chirps should be first.
        console.log('working');
    });
});
