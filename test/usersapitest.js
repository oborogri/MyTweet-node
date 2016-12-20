'use strict';

const assert = require('chai').assert;
var request = require('sync-request');

suite('User API tests', function () {

  test('get users', function () {

    const url = 'http://localhost:4000/api/users';
    var res = request('GET', url);
    const users = JSON.parse(res.getBody('utf8'));
    assert.equal(4, users.length);

    assert.equal(users[0].firstName, 'Homer');
    assert.equal(users[0].lastName, 'Simpson');
    assert.equal(users[0].posts, 4);

    assert.equal(users[1].firstName, 'Marge');
    assert.equal(users[1].lastName, 'Simpson');
    assert.equal(users[1].posts, 2);

    assert.equal(users[2].firstName, 'Bart');
    assert.equal(users[2].lastName, 'Simpson');
    assert.equal(users[2].posts, 1);

    assert.equal(users[3].firstName, 'Lisa');
    assert.equal(users[3].lastName, 'Simpson');
    assert.equal(users[3].posts, 1);

  });

  test('get one user', function () {

    const allUsersUrl = 'http://localhost:4000/api/users';
    var res = request('GET', allUsersUrl);
    const users = JSON.parse(res.getBody('utf8'));

    const oneUserUrl = allUsersUrl + '/' + users[0]._id;
    res = request('GET', oneUserUrl);
    const oneUser = JSON.parse(res.getBody('utf8'));

    assert.equal(oneUser.firstName, 'Homer');
    assert.equal(oneUser.lastName, 'Simpson');
    assert.equal(oneUser.posts, 4);

  });

  test('create a user', function () {

    const usersUrl = 'http://localhost:4000/api/users';
    const newUser = {
      firstName: 'Barnie',
      lastName: 'Grumble',
      email: 'barnie@simpson.com',
      password: 'secret',
      joined: 'Tue, Dec 20th, 2016',
      posts: 3,
    };

    const res = request('POST', usersUrl, { json: newUser });
    const returnedUser = JSON.parse(res.getBody('utf8'));
    const users = JSON.parse(res.getBody('utf8'));

    assert.equal(returnedUser.firstName, 'Barnie');
    assert.equal(returnedUser.lastName, 'Grumble');
    assert.equal(returnedUser.email, 'barnie@simpson.com');
    assert.equal(returnedUser.password, 'secret');
    assert.equal(returnedUser.joined, 'Tue, Dec 20th, 2016');
    assert.equal(returnedUser.posts, 3);

    const url = 'http://localhost:4000/api/users';
    var resUsers = request('GET', url);
    const usersAll = JSON.parse(resUsers.getBody('utf8'));
    assert.equal(5, usersAll.length);
  });

  test('delete one user', function () {

    const allUsersUrl = 'http://localhost:4000/api/users';
    var res = request('GET', allUsersUrl);
    const users = JSON.parse(res.getBody('utf8'));
    const oneUserUrl = allUsersUrl + '/' + users[0]._id;
    var res = request('DELETE', oneUserUrl);

    var resAll = request('GET', allUsersUrl);
    const usersAll = JSON.parse(resAll.getBody('utf8'));
    assert.equal(usersAll.length, 4);
  });

  test('delete all users', function () {

    const allUsersUrl = 'http://localhost:4000/api/users';
    var resDelete = request('DELETE', allUsersUrl);

    var resAll = request('GET', allUsersUrl);
    const usersAll = JSON.parse(resAll.getBody('utf8'));
    assert.equal(usersAll.length, 0);
  });
});

