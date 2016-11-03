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

  { method: 'POST', path: '/register', config: Accounts.register },
  { method: 'POST', path: '/login', config: Accounts.authenticate },

  { method: 'GET', path: '/settings', config: Accounts.viewSettings },
  { method: 'POST', path: '/settings', config: Accounts.updateSettings },

  { method: 'GET', path: '/home', config: Tweets.home },
  { method: 'GET', path: '/timeline', config: Tweets.timeline },
  { method: 'GET', path: '/newtweet', config: Tweets.newtweet },

  { method: 'POST', path: '/posttweet', config: Tweets.posttweet },
  { method: 'POST', path: '/deleteTweetsAll', config: Tweets.deleteTweetsAll },
  { method: 'POST', path: '/deleteTweet', config: Tweets.deleteTweet },

  {
    method: 'GET',
    path: '/{param*}',
    config: { auth: false },
    handler: Assets.servePublicDirectory,
  },

];
