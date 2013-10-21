/* global define */
define(['backbone', 'moment'], function(Backbone, moment){
  'use strict';

  var CommentModel = Backbone.Model.extend({
    initialize: function(){
      var date = moment(this.get('created_at'));
      this.set('commentFromNow', date.fromNow());
    }
  });

  return CommentModel;
});
