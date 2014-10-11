var _ = require('lodash');

var letters = 'qwertyuiopasdfghjklzxcvbnm1234567890'.split('');

letters.forEach(function (ch) {
   letters.push(ch.toUpperCase());
});

function generateRandomToken(length) {
    var seed = _.shuffle(letters);
    return _.first(seed, length).join('');
}

generateRandomToken(10);

module.exports = generateRandomToken;