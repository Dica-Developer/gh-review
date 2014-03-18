/*global define*/
define(function (require) {
  'use strict';

  var Backbone = require('backbone');
  var _ = require('underscore');
  var app = require('app');
  var template = require('text!fileTemplates/file.html');

  return Backbone.View.extend({
    el: '#main',
    template: _.template(template),
    initialize: function () {},
    render: function (commits) {
      var _this = this;
      try {
        var msg = {
          headers: {
            'accept': 'application/vnd.github.v3.raw'
          },
          user: this.model.user,
          repo: this.model.repo,
          path: this.model.path
        };
        app.github.repos.getContent(msg, function (error, result) {
          if (!error) {
            _this.$el.html(_this.template({
              commits: commits,
              content: result.data
            }));
          }
        });
      } catch (e) {
        console.log(e);
      }
    }
  });
});
