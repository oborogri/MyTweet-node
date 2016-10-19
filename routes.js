/**
 * Created by Grigore on 11/10/2016.
 */
const Assets = require('./app/controllers/assets');
const Accounts = require('./app/controllers/accounts');
const Tweets = require('./app/controllers/tweets');

module.exports = [

  { method: 'GET', path: '/', config: Accounts.main },
  { method: 'GET', path: '/signup', config: Accounts.signup },
  { method: 'GET', path: '/login', config: Accounts.login },
  { method: 'GET', path: '/logout', config: Accounts.logout },

  { method: 'GET', path: '/home', config: Tweets.home },

  { method: 'POST', path: '/register', config: Accounts.register },
  { method: 'POST', path: '/login', config: Accounts.authenticate },

  {
    method: 'GET',
    path: '/{param*}',
    config: { auth: false },
    handler: Assets.servePublicDirectory,
  },

];
