const auth = require('./auth.js');

module.exports = {
    home: require('./home.js'),
    mostPopular: require('./mostPopular.js'),
    search: require('./search.js'),
    groups : require ('./groups.js'),
    searchResults : require ('./searchResults.js'),
    account : require('./userAccount.js'),
    signUp :auth.signUp,
    signIn  : auth.signIn,
    logout : auth.logout
};