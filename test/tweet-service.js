'use strict';

const SyncHttpService = require('./sync-http-service');
const baseUrl = 'http://localhost:4000';

class TweetService {

  constructor(baseUrl) {
    this.httpService = new SyncHttpService(baseUrl);
  }

  //tweets///////////////////////////
  getTweets() {
    return this.httpService.get('/api/tweets');
  }

  getTweet(id) {
    return this.httpService.get('/api/tweets/' + id);
  }

  createTweet(newTweet) {
    return this.httpService.post('/api/tweets', newTweet);
  }

  getUsersTweets(id) {
    return this.httpService.get('/api/users/' + id + '/tweets');
  }

  deleteOneTweet(id) {
    return this.httpService.delete('/api/tweets/' + id);
  }

  deleteAllTweets() {
    return this.httpService.delete('/api/tweets');
  }

  //users/////////////////////////////
  login(user) {
    return this.httpService.setAuth('/api/users/authenticate', user);
  }

  logout() {
    this.httpService.clearAuth();
  }

  deleteUsersTweets(id) {
    return this.httpService.delete('/api/users/' + id + '/tweets');
  }

  getUsers() {
    return this.httpService.get('/api/users');
  }

  getUser(id) {
    return this.httpService.get('/api/users/' + id);
  }

  createUser(newUser) {
    return this.httpService.post('/api/users', newUser);
  }

  deleteAllUsers() {
    return this.httpService.delete('/api/users');
  }

  deleteOneUser(id) {
    return this.httpService.delete('/api/users/' + id);
  }

  //friendships////////////////////////
  getFriendships() {
    return this.httpService.get('/api/friendships');
  }

  getFriendship(id) {
    return this.httpService.get('/api/friendships/' + id);
  }

  createUserFollowing(id1, id2) {
    return this.httpService.post('/api/users/' + id1 + '/following', id2);
  }

  getUserFollowing(id) {
    return this.httpService.get('/api/friendships/sourceUser/' + id);
  }

  getUserFollowers(id) {
    return this.httpService.get('/api/friendships/targetUser/' + id);
  }

  deleteUsersFollowing(id) {
    return this.httpService.delete('/api/friendships/sourceUser/' + id);
  }

  deleteUsersFollowers(id) {
    return this.httpService.delete('/api/friendships/targetUser/' + id);
  }

  deleteOneFriendship(id) {
    return this.httpService.delete('/api/friendships/' + id);
  }

  deleteAllFriendships() {
    return this.httpService.delete('/api/friendships');
  }

}

module.exports = TweetService;
