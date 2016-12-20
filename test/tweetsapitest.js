'use strict';

const assert = require('chai').assert;
var request = require('sync-request');

suite('Tweet API tests', function () {

  test('get tweets', function () {

    const url = 'http://localhost:4000/api/tweets';
    var res = request('GET', url);
    const tweets = JSON.parse(res.getBody('utf8'));
    assert.equal(4, tweets.length);

    assert.equal(tweets[0].text, 'What are you up to?');
    assert.equal(tweets[0].subject, 'ping');
    assert.equal(tweets[0].date, 'Wed, Nov 2nd, 2016, 9:45:03 PM');

    assert.equal(tweets[1].text, 'I\'m just back from work?');
    assert.equal(tweets[1].subject, 'pong');
    assert.equal(tweets[1].date, 'Wed, Nov 2nd, 2016, 9:49:07 PM');

    assert.equal(tweets[2].text, 'Up the Rebels!');
    assert.equal(tweets[2].subject, '#rebels');
    assert.equal(tweets[2].date, 'Thu, Nov 3rd, 2016, 5:45:05 PM');

    assert.equal(tweets[3].text, 'Got my tickets!!');
    assert.equal(tweets[3].subject, 'cold play');
    assert.equal(tweets[3].date, 'Thu, Nov 3rd, 2016, 6:15:10 PM');
  });

  test('get one tweet', function () {

    const allTweetsUrl = 'http://localhost:4000/api/tweets';
    var res = request('GET', allTweetsUrl);
    const tweets = JSON.parse(res.getBody('utf8'));

    const oneTweetUrl = allTweetsUrl + '/' + tweets[0]._id;
    res = request('GET', oneTweetUrl);
    const oneTweet = JSON.parse(res.getBody('utf8'));

    assert.equal(oneTweet.text, 'What are you up to?');
    assert.equal(oneTweet.subject, 'ping');
    assert.equal(oneTweet.date, 'Wed, Nov 2nd, 2016, 9:45:03 PM');

  });

  test('create a tweet', function () {

    const usersUrl = 'http://localhost:4000/api/users';
    var resUsers = request('GET', usersUrl);
    const users = JSON.parse(resUsers.getBody('utf8'));
    const tweetsUrl = 'http://localhost:4000/api/tweets';
    const newTweet = {
      text: 'What are you up to?',
      subject: 'ping',
      date: 'Tue, Dec 20th, 2016, 9:45:03 AM',
      sender: users[0],
    };

    const res = request('POST', tweetsUrl, { json: newTweet });
    const returnedTweet = JSON.parse(res.getBody('utf8'));
    const tweets = JSON.parse(res.getBody('utf8'));

    assert.equal(returnedTweet.text, 'What are you up to?');
    assert.equal(returnedTweet.subject, 'ping');
    assert.equal(returnedTweet.date, 'Tue, Dec 20th, 2016, 9:45:03 AM');
    assert.equal(returnedTweet.sender, '5859589dd991e621e8b9907a');

    const url = 'http://localhost:4000/api/tweets';
    var resTweets = request('GET', url);
    const tweetsAll = JSON.parse(resTweets.getBody('utf8'));
    assert.equal(5, tweetsAll.length);
  });

  test('delete one tweet', function () {

    const allTweetsUrl = 'http://localhost:4000/api/tweets';
    var res = request('GET', allTweetsUrl);
    const tweets = JSON.parse(res.getBody('utf8'));
    const oneTweetUrl = allTweetsUrl + '/' + tweets[0]._id;
    var resDelete = request('DELETE', oneTweetUrl);

    var resAll = request('GET', allTweetsUrl);
    const tweetsAll = JSON.parse(resAll.getBody('utf8'));
    assert.equal(tweetsAll.length, 4);
  });

  test('delete all tweets', function () {

    const allTweetsUrl = 'http://localhost:4000/api/tweets';
    var resDeleteAll = request('DELETE', allTweetsUrl);

    var resAll = request('GET', allTweetsUrl);
    const tweetsAll = JSON.parse(resAll.getBody('utf8'));
    assert.equal(tweetsAll.length, 0);
  });
});

