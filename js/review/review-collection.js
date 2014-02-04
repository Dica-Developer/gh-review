/*global define*/
define(['backbone', 'reviewItemModel'], function (Backbone, ReviewItemModel) {
  'use strict';

  var ReviewCollection = Backbone.Collection.extend({
    model: ReviewItemModel,
    localStorage: new Backbone.LocalStorage('reviews')
  });

  return new ReviewCollection();
});
