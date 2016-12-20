'use strict';

const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');

suite('User API tests', function () {

  let users = fixtures.users;
  let newUser = fixtures.newUser;

  const tweetService = new TweetService('http://localhost:4000');

  test('create an user', function () {
    const returnedUser = tweetService.createUser(newUser);
    assert.equal(returnedUser.firstName, newUser.firstName);
    assert.equal(returnedUser.lastName, newUser.lastName);
    assert.equal(returnedUser.email, newUser.email);
    assert.equal(returnedUser.password, newUser.password);
    assert.equal(returnedUser.joined, newUser.joined);
    assert.equal(returnedUser.posts, newUser.posts);
    assert.isDefined(returnedUser._id);
  });
});
