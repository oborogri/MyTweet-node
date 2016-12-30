/**
 * Created by Grigore on 19/10/2016.
 */
'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  avatar: { data: Buffer, contentType: String },
  joined: String,
  followedBy: [],
  following: [],
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet',
  },
  ],
});

const User = mongoose.model('User', userSchema);
module.exports = User;

