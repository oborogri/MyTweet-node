'use strict';

const assert = require('chai').assert;
var request = require('sync-request');

suite('Tweet API tests', function () {

  test('get tweets', function () {

    const url = 'http://localhost:4000/api/tweets';
    var res = request('GET', url);
    const tweets = JSON.parse(res.getBody('utf8'));
    assert.equal(4, tweets.length);
  });
});
