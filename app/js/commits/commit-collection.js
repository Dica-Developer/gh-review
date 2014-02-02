/*global define*/
define(['backbone', 'commitModel'], function (Backbone, CommitModel) {
  'use strict';
  var CommitsCollection = Backbone.Collection.extend({
    model: CommitModel,
    initialize: function () {

    }
  });

  return new CommitsCollection();
});
