const mongoose = require('mongoose');
const User = require('../models/user');

const friendshipSchema = mongoose.Schema({
  sourceUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  targetUser:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Friendship = mongoose.model('Friendship', friendshipSchema);
module.exports = Friendship;
