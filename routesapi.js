const TweetsApi      = require('./app/api/tweetsapi');
const UsersApi       = require('./app/api/usersapi');
const FriendshipsApi = require('./app/api/friendshipsapi');

module.exports = [

    //tweets api
  { method: 'GET', path: '/api/tweets',             config: TweetsApi.findAllTweets },
  { method: 'GET', path: '/api/users/{id}/tweets',  config: TweetsApi.findUsersTweets },
  { method: 'GET', path: '/api/tweets/{id}',        config: TweetsApi.findOne },

  { method: 'DELETE', path: '/api/tweets',            config: TweetsApi.deleteAllTweets },
  { method: 'DELETE', path:  '/api/tweets/{id}',      config: TweetsApi.deleteOneTweet },
  { method: 'DELETE', path: '/api/users/{id}/tweets', config: TweetsApi.deleteUsersTweets },

  { method: 'POST', path: '/api/users/{id}/tweets',   config: TweetsApi.createTweet },

    //users api
  { method: 'GET', path:     '/api/users',        config: UsersApi.find },
  { method: 'GET', path:     '/api/users/{id}',   config: UsersApi.findOne },

  { method: 'DELETE', path:  '/api/users/{id}',   config: UsersApi.deleteOne },
  { method: 'DELETE', path:  '/api/users',        config: UsersApi.deleteAll },

  { method: 'POST', path:    '/api/users',              config: UsersApi.createUser },
  { method: 'POST', path:    '/api/users/authenticate', config: UsersApi.authenticate },

    //friendships api
  { method: 'GET', path:     '/api/friendships',                 config: FriendshipsApi.find },
  { method: 'GET', path:     '/api/friendships/{id}',            config: FriendshipsApi.findOne },
  { method: 'GET', path:     '/api/friendships/sourceUser/{id}', config: FriendshipsApi.userFollowing },
  { method: 'GET', path:     '/api/friendships/targetUser/{id}', config: FriendshipsApi.userFollowers },

  { method: 'DELETE', path:  '/api/friendships/{id}',            config: FriendshipsApi.deleteOne },
  { method: 'DELETE', path:  '/api/friendships/sourceUser/{id}', config: FriendshipsApi.deleteUserFollowing, },
  { method: 'DELETE', path:  '/api/friendships/targetUser/{id}', config: FriendshipsApi.deleteUserFollowers, },
  { method: 'DELETE', path:  '/api/friendships',                 config: FriendshipsApi.deleteAll },

];
