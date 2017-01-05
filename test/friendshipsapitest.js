'use strict';
var request = require('sync-request');
const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Friendships API tests', function () {

  let users = fixtures.users;
  let tweets = fixtures.tweets;
  let newUser = fixtures.newUser;

  const tweetService = new TweetService(fixtures.tweetService);

  beforeEach(function () {
    tweetService.login(users[0]);
    tweetService.deleteAllFriendships();
  });

  afterEach(function () {
    tweetService.deleteAllFriendships();
    tweetService.logout();
  });

  test('create a following', function () {
    const returnedUser1 = tweetService.createUser(newUser);
    const returnedUser2 = tweetService.createUser(newUser);
    tweetService.createUserFollowing(returnedUser1._id, returnedUser2._id);
    const returnedFriendships = tweetService.getUserFollowing(returnedUser1._id);
    assert.equal(returnedFriendships.length, 1);

    //assert(_.some([returnedFriendships[0]], friendships[0]), 'returned frindship must be a superset of friendship');
  });

  test('get invalid friendship', function () {
    const f1 = tweetService.getFriendship('1234');
    assert.isNull(f1);
    const f2 = tweetService.getFriendship('012345678901234567890123');
    assert.isNull(f2);
  });
});
