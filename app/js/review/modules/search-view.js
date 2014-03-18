/*global define*/
define(function (require) {
  'use strict';

  var Backbone = require('backbone');
  var _ = require('underscore');
  var app = require('app');
  var template = require('text!reviewModulesTemplates/search.html');

  return Backbone.View.extend({
    el: '#search',
    template: _.template(template),
    events: {
      'click #searchButton': 'search'
    },
    search: function () {
      var searchValue = $('#searchValue').val();
      app.github.search.code({
        q: searchValue
      }, this.callback.bind(this));
    },
    callback: function (error, resp) {
      this.render(resp);
    },
    initialize: function () {},
    render: function (results) {
      results = results || {
        items: []
      };
      this.$el.html(this.template(results));
    }
  });
});
