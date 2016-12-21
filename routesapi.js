const TweetsApi = require('./app/api/tweetsapi');
const UsersApi = require('./app/api/usersapi');

module.exports = [
  { method: 'GET', path: '/api/tweets',             config: TweetsApi.findAllTweets },
  { method: 'GET', path: '/api/users/{id}/tweets',  config: TweetsApi.findUsersTweets },
  { method: 'POST', path: '/api/users/{id}/tweets', config: TweetsApi.createTweet },
  { method: 'DELETE', path: '/api/tweets',          config: TweetsApi.deleteAllTweets },

  { method: 'GET', path:     '/api/tweets/{id}',      config: TweetsApi.findOne },
  { method: 'DELETE', path:  '/api/tweets/{id}',      config: TweetsApi.deleteOne },
  { method: 'DELETE', path: '/api/users/{id}/tweets', config: TweetsApi.deleteUsersTweets },

  { method: 'GET', path:     '/api/users',        config: UsersApi.find },
  { method: 'GET', path:     '/api/users/{id}',   config: UsersApi.findOne },
  { method: 'DELETE', path:  '/api/users/{id}',   config: UsersApi.deleteOne },
  { method: 'DELETE', path:  '/api/users',        config: UsersApi.deleteAll },
  { method: 'POST', path:    '/api/users',        config: UsersApi.createUser },

];
