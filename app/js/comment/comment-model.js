/* global define */
define(['backbone'], function(Backbone){
  'use strict';

  var CommentModel = Backbone.Model.extend({
    initialize: function(){
      console.log(this);
    }
  });

  return CommentModel;
});
