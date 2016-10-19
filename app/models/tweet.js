/**
 * Created by Grigore on 19/10/2016.
 */
const mongoose = require('mongoose');
const User = require('../models/user');

const tweetSchema = mongoose.Schema({
  tweettext: String,
  subject: String,
  date: Date,

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;
