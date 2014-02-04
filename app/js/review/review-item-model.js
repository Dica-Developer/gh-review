/*global define*/
define(['backbone'], function (Backbone) {
  'use strict';

  var ReviewItemModel = Backbone.Model.extend({
    defaults: {
      repo: '',
      contributor: '',
      branch: '',
      since: {
        amount: 0,
        pattern: ''
      },
      until: '',
      path: ''
    }
  });

  return ReviewItemModel;
});
