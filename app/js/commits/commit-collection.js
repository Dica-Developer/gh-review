/*global define*/
define(['backbone', 'commitModel'], function (Backbone, CommitModel) {
  'use strict';
  var CommitsCollection = Backbone.Collection.extend({
    model: CommitModel,
    localStorage: new Backbone.LocalStorage('commits'),
    initialize: function () {

    }
  });

  return new CommitsCollection();
});
