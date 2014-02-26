/*global define*/
define(['backbone'], function (Backbone) {
  'use strict';

  return Backbone.Model.extend({
    defaults: {
      owner: '',
      repo: '',
      contributor: '',
      branch: 'master',
      since: {
        amount: 0,
        pattern: ''
      },
      until: '',
      path: ''
    }
  });
});
