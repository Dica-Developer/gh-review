/*global define*/
define(['backbone', 'backboneLocalStorage', 'reviewItemModel'], function(Backbone, BackboneLocalStorage, ReviewItemModel){
  'use strict';

  var ReviewCollection = Backbone.Collection.extend({
    model: ReviewItemModel,
    localStorage: new BackboneLocalStorage('reviews')
  });

  return new ReviewCollection();
});
