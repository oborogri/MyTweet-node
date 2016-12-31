'use strict';
var request = require('sync-request');
const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Friendships API tests', function () {

  let friendships = fixtures.friendships;

  const tweetService = new TweetService(fixtures.tweetService);

  beforeEach(function () {
    //tweetService.deleteAllUsers();
  });

  afterEach(function () {
    tweetService.deleteAllFriendships();

    //tweetService.logout();
  });

  test('get invalid friendship', function () {
    const f1 = tweetService.getFriendship('1234');
    assert.isNull(f1);
    const f2 = tweetService.getFriendship('012345678901234567890123');
    assert.isNull(f2);
  });
});
