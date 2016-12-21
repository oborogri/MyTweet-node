'use strict';

const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Tweet API tests', function () {

  let tweets = fixtures.tweets;
  let newUser = fixtures.newUser;

  const tweetService = new TweetService(fixtures.tweetService);

  beforeEach(function () {
    tweetService.deleteAllUsers();
    tweetService.deleteAllTweets();
  });

  afterEach(function () {
    tweetService.deleteAllUsers();
    tweetService.deleteAllTweets();
  });

  test('create a tweet', function () {
    const returnedUser = tweetService.createUser(newUser);
    tweetService.createTweet(returnedUser._id, tweets[0]);
    const returnedTweets = tweetService.getUsersTweets(returnedUser._id);
    assert.equal(returnedTweets.length, 1);
    assert(_.some([returnedTweets[0]], tweets[0]), 'returned tweet must be a superset of tweet');
  });

  test('create multiple tweets', function () {
    const returnedUser = tweetService.createUser(newUser);
    for (var i = 0; i < tweets.length; i++) {
      tweetService.createTweet(returnedUser._id, tweets[i]);
    }

    const returnedTweets = tweetService.getUsersTweets(returnedUser._id);
    assert.equal(returnedTweets.length, tweets.length);
    for (var i = 0; i < tweets.length; i++) {
      assert(_.some([returnedTweets[i]], tweets[i]), 'returned tweet must be a superset of tweet');
    }
  });

  test('delete user tweets', function () {
    const returnedUser = tweetService.createUser(newUser);
    for (var i = 0; i < tweets.length; i++) {
      tweetService.createTweet(returnedUser._id, tweets[i]);
    }

    tweetService.deleteUsersTweets(returnedUser._id);
    const t = tweetService.getTweets(returnedUser._id);
    assert.equal(t.length, 0);
  });

  test('delete all tweets', function () {
    const returnedUser = tweetService.createUser(newUser);
    for (var i = 0; i < tweets.length; i++) {
      tweetService.createTweet(returnedUser._id, tweets[i]);
    }

    const t1 = tweetService.getUsersTweets(returnedUser._id);
    assert.equal(t1.length, tweets.length);
    tweetService.deleteAllTweets();
    const t2 = tweetService.getUsersTweets(returnedUser._id);
    assert.equal(t2.length, 0);
  });
});
