const TweetsApi = require('./app/api/tweetsapi');
const UsersApi = require('./app/api/usersapi');

module.exports = [
  { method: 'GET', path: '/api/tweets',      config: TweetsApi.find },
  { method: 'GET', path: '/api/tweets/{id}', config: TweetsApi.findOne },
  { method: 'GET', path: 'api/tweets/{id}',  config: TweetsApi.deleteOne },
  { method: 'GET', path: 'api/tweets',       config: TweetsApi.deleteAll },
  { method: 'POST', path: 'api/tweets',      config: TweetsApi.createTweet },

  { method: 'GET', path: '/api/users',       config: UsersApi.find },
  { method: 'GET', path: '/api/users/{id}',  config: UsersApi.findOne },
  { method: 'GET', path: 'api/users/{id}',   config: UsersApi.deleteOne },
  { method: 'GET', path: 'api/users',        config: UsersApi.deleteAll },
  { method: 'POST', path: 'api/users',       config: UsersApi.createUser },

];
