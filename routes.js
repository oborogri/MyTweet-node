/**
 * Created by Grigore on 11/10/2016.
 */
const Assets = require('./app/controllers/assets');
const Accounts = require('./app/controllers/accounts');
const Tweets = require('./app/controllers/tweets');
const Admins = require('./app/controllers/admins');

module.exports = [

  { method: 'GET', path: '/',          config: Accounts.main },
  { method: 'GET', path: '/signup',    config: Accounts.signup },
  { method: 'GET', path: '/login',     config: Accounts.login },
  { method: 'GET', path: '/logout',    config: Accounts.logout },
  { method: 'GET', path: '/admin_signup',    config: Accounts.admin_signup },
  { method: 'GET', path: '/admin_login',     config: Accounts.admin_login },

  { method: 'POST', path: '/register',           config: Accounts.register },
  { method: 'POST', path: '/admin_register',     config: Accounts.admin_register },
  { method: 'POST', path: '/authenticate',       config: Accounts.authenticate },
  { method: 'POST', path: '/admin_authenticate', config: Accounts.admin_authenticate },

  { method: 'GET', path: '/settings',         config: Accounts.viewSettings },
  { method: 'POST', path: '/update_settings', config: Accounts.updateSettings },

  { method: 'GET', path: '/home',           config: Tweets.home },
  { method: 'GET', path: '/timeline',       config: Tweets.timeline },
  { method: 'GET', path: '/newtweet',       config: Tweets.newtweet },
  { method: 'POST', path: '/user_timeline', config: Tweets.user_timeline },

  { method: 'POST', path: '/posttweet',       config: Tweets.posttweet },
  { method: 'POST', path: '/deleteTweetsAll', config: Tweets.deleteTweetsAll },
  { method: 'POST', path: '/userDeleteTweetsAll', config: Tweets.userDeleteTweetsAll },
  { method: 'POST', path: '/deleteTweet',     config: Tweets.deleteTweet },

  { method: 'GET', path: '/admin_home',    config: Admins.dashboard },

  {
    method: 'GET',
    path: '/{param*}',
    config: { auth: false },
    handler: Assets.servePublicDirectory,
  },

];
