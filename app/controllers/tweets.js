/**
 * Created by Grigore on 11/10/2016.
 */
'use strict';

exports.home = {
  handler: function (request, reply) {
    reply.view('home', { title: 'MyTweet Timeline' });
  },

};
