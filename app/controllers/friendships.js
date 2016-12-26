'use strict';

const User = require('../models/user');
const Joi = require('joi');

exports.follow = {
  handler: function (request, reply) {
    let sourceUserFollowing = [];
    let targetUserFollowedBy = [];
    const userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(sourceUser => {
        sourceUserFollowing = sourceUser.following;
        const sourceUserId = sourceUser.id;
        const targetUserId = request.payload.targetUser;
        if ((sourceUserId != targetUserId) && (sourceUserFollowing.indexOf(targetUserId) != -1)) {
          sourceUserFollowing.push(targetUserId);//add target user to following array

          User.findOne({ _id: { $in: targetUser } }).then(targetUser => {
            targetUserFollowedBy = targetUser.followedBy;
            targetUserFollowedBy.push(sourceUser.id);//add source user to followedBy array
            return targetUser.save();
          });
        } else {
          console.log('Already following this user');
        }

        return sourceUser.save();
      }).then(response => {
        reply.redirect('/home');
      }).catch(err => {
        reply.redirect('/home');
      });
  },
};
