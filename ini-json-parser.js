var fs = require('fs');
var os = require('os');
var http = require('https');

var path = process.argv[2];

convertController(path);

function convertController(path) {
    if (path !== undefined) {
        var fileName = getFileName(path);
        var parsedObj;

        if (endsWith(path, '.ini')) {
            if (path.substring(0, 4) === 'http') {
                parseIniFromURL(path, function(result) {
                    saveFileToFS(fileName + '.json', result);
                });
            }
            else {
                parseIniFromFS(path, function (result) {
                    saveFileToFS(fileName + '.json', result);
                });
            }
        }
        else if (endsWith(path, '.json')) {
            if (path.substring(0, 4) === 'http') {
                parseJsonFromURL(path, function (result) {
                    saveFileToFS(fileName + '.ini', result);
                });
            }
            else {
                parseJsonFromFS(path, function (result) {
                    saveFileToFS(fileName + '.ini', result);
                });
            }
        }
    }

    function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }
}

function getFileName(path) {
    var urlParts = path.split(/[//.\\]/);
    return urlParts[urlParts.length - 2];
}

function saveFileToFS(fileName, content) {
    fs.writeFile(fileName, content, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    });
}

function parseIniFromURL(path, cb) {
    http.get(path, function (res) {
        res.on("data", function (contents) {
            var iniFile = contents.toString("utf8");
            cb(parseIniToJSON(iniFile));
        })
    });
}

function parseJsonFromURL(path, cb) {
    http.get(path, function (res) {
        res.on("data", function (contents) {
            var jsonFile = contents.toString("utf8");
            cb(parseJsonToIni(jsonFile));
        })
    });
}

function parseIniFromFS(file, cb) {
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        }
        cb(parseIniToJSON(data));
    });
}

function parseJsonFromFS(file, cb) {
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        }

        cb(parseJsonToIni(data));
    });
}

function parseIniToJSON(data) {
    var lines = data.split(/[\r\n]+/g).filter(Boolean);
    var json = {};
    var nameOfObject;

    lines.forEach(function (line) {
        if (line.indexOf(';') > -1) {
            // if the line is a comment or contains ';'
            // it's invalid and we do nothing with it
        }
        else if (line.indexOf('[') > -1) {
            var objName = line.match(/[^\[\]+]/g).join('').replace(/ /g,'');
            json[objName] = {};
            nameOfObject = objName;
        }
        else if (line.indexOf('=') > -1) {
            var parts = line.split('=');
            var key = parts[0].replace(/ /g,'');
            var value = parts[1].replace(/ /g,'');

            if (objName === undefined) {
                json[nameOfObject][key] = value;
            }
        }
    });

    return JSON.stringify(json, os.EOL, ' ');
}

function parseJsonToIni(data) {
    var objFromJSON = JSON.parse(data);
    var iniString = '';
    var keys = Object.keys(objFromJSON);

    for (var i = 0; i < keys.length; i++) {
        var iniObjName = '[' + keys[i] + ']';
        iniString += iniObjName;
        iniString += os.EOL;

        var currentObjKeys = Object.keys(objFromJSON[keys[i]]);
        for (var j = 0; j < currentObjKeys.length; j++) {
            var key = currentObjKeys[j];
            var value = objFromJSON[keys[i]][key];
            var strLine = key + '=' + value + os.EOL;
            iniString += strLine;
        }
    }

    return iniString;
}