/*global define*/
define(['backbone', 'reviewItemModel'], function (Backbone, ReviewItemModel) {
  'use strict';

  var ReviewCollection = Backbone.Collection.extend({
    model: ReviewItemModel,
    localStorage: new Backbone.LocalStorage('reviews'),
    initialize: function(){
      this.fetch();
    }
  });

  return ReviewCollection;
});