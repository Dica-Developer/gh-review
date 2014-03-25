/*global define*/
define(['backbone', 'commitModel'], function (Backbone, CommitModel) {
  'use strict';
  return Backbone.Collection.extend({
    model: CommitModel,
    initialize: function () {

    }
  });
});
