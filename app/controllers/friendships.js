'use strict';

const User = require('../models/user');
const Friendship = require('../models/friendship');
const Joi = require('joi');

exports.follow = {
  handler: function (request, reply) {
    let targetUserFollowedBy = [];
    const userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(sourceUser => {
      let sourceUserFollowing = sourceUser.following;
      const sourceUserId = sourceUser.id;
      const targetUserId = request.payload.targetUser;
      if ((sourceUserId !== targetUserId) && (sourceUserFollowing.indexOf(targetUserId) === -1)) {
        sourceUserFollowing.push(targetUserId);//add target user to source user following array
        User.findOne({ _id: targetUserId }).then(targetUser => {
          targetUserFollowedBy = targetUser.followedBy;
          if ((sourceUserId !== targetUserId) && (targetUserFollowedBy.indexOf(sourceUserId) === -1)) {
            targetUserFollowedBy.push(sourceUserId);//add source user to target user followed by array

            const friendship = new Friendship();//creating new friendship object
            friendship.sourceUser = sourceUserId;
            friendship.targetUser = targetUserId;
            friendship.save();
          } else {
            console.log('Already followed by this user');
          }

          sourceUser.save();
          return targetUser.save();
        });
      } else {
        console.log('Already following this user');
      };
    }).then(response => {
      reply.redirect('/home');
    }).catch(err => {
      reply.redirect('/home');
    });
  },
};

exports.unfollow = {
  handler: function (request, reply) {

    const userEmail = request.auth.credentials.loggedInUser;
    const usersId = request.payload.userId;
    let selectedUsers = [];
    if (typeof usersId === 'object') {//payload contains an array of user ids
      selectedUsers.push.apply(selectedUsers, usersId);//insert payload into a new array
    } else {//payload contains just a single user id
      selectedUsers.push(usersId);
    }

    User.find({ _id: { $in: selectedUsers } }).then(allUsers => {//find selected users to unfollow
      const userEmail = request.auth.credentials.loggedInUser;
      User.findOne({ email: userEmail }).then(foundUser => {//loggedIn user
        const foundUserId = foundUser.id;
        let userFollowing = foundUser.following;
        allUsers.forEach(followingUser => {//looping through selected users to unfollow
          let followersList = followingUser.followedBy;
          followersList.remove(foundUserId);//removing loggedIn user from followers followedBy list
          followingUser.save();
          foundUser.save();
        });
        selectedUsers.forEach(user => {//looping through the payload ids
          for (var i = 0; i < userFollowing.length; i++) {
            if (userFollowing[i] == user) {
              userFollowing.splice(i, 1);//deleting selected ids from user's following list
              foundUser.save();
            }
          }
        });
        return foundUser.save();
      });
    });
    User.findOne({ email: userEmail }).then(foundUser => {
      const userId = foundUser.id;//find loggedIn user id
      return Friendship.remove({ $and: [{ sourceUser: userId }, { targetUser: { $in: selectedUsers } }] });
    }).then(response => {
      reply.redirect('/settings');//deleting friendships fom db
    }).catch(err => {
      reply.redirect('/home');
    });
  },
};
