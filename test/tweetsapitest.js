'use strict';

const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Tweet API tests', function () {

  let users = fixtures.users;
  let tweets = fixtures.tweets;
  let newUser = fixtures.newUser;
  let newTweet = fixtures.newTweet;

  const tweetService = new TweetService(fixtures.tweetService);

  beforeEach(function () {
    tweetService.login(users[0]);
    tweetService.deleteAllTweets();
  });

  afterEach(function () {
    tweetService.deleteAllTweets();
    tweetService.logout();
  });

  test('create a tweet', function () {
    tweetService.createTweet(newTweet);
    const returnedTweets = tweetService.getTweets();
    assert.equal(returnedTweets.length, 1);
    assert(_.some([returnedTweets[0]], tweets[0]), 'returned tweet must be a superset of tweet');
  });

  test('create multiple tweets', function () {
    const returnedUser = tweetService.createUser(newUser);
    for (var i = 0; i < tweets.length; i++) {
      tweetService.createTweet(returnedUser._id, tweets[i]);
    }

    const returnedTweets = tweetService.getTweets(returnedUser._id);
    assert.equal(returnedTweets.length, tweets.length);
    for (var i = 0; i < tweets.length; i++) {
      assert(_.some([returnedTweets[i]], tweets[i]), 'returned tweet must be a superset of tweet');
    }
  });

  test('delete all tweets', function () {
    const returnedUser = tweetService.createUser(newUser);
    for (var i = 0; i < tweets.length; i++) {
      tweetService.createTweet(returnedUser._id, tweets[i]);
    }

    const d1 = tweetService.getTweets(returnedUser._id);
    assert.equal(d1.length, tweets.length);
    tweetService.deleteAllTweets();
    const d2 = tweetService.getTweets(returnedUser._id);
    assert.equal(d2.length, 0);
  });

  test('delete tweets', function () {
    const returnedUser = tweetService.createUser(newUser);
    for (var i = 0; i < tweets.length; i++) {
      tweetService.createTweet(returnedUser._id, tweets[i]);
    }

    tweetService.deleteAllTweets(returnedUser._id);
    const d = tweetService.getTweets(returnedUser._id);
    assert.equal(d.length, 0);
  });
});
