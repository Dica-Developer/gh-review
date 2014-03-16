/*global define*/
define(function (require) {
  'use strict';

  var Backbone = require('backbone');
  var _ = require('underscore');
  var app = require('app');
  var template = require('text!review/modules/templates/search.html');

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
      }, this.callback);
    },
    callback: function (error, resp) {
      console.log(resp);
      $('<h1>').text(resp.total_count + ' results found ' + resp.meta['x-ratelimit-remaining'] + ' queries left of ' + resp.meta['x-ratelimit-limit']).appendTo($('#search'));
    },
    initialize: function () {},
    serialize: function () {
      return {
        repos: app.repoCollection.toJSONSortedByName(),
        repo: this.repo
      };
    },
    render: function () {
      this.$el.html(this.template(this.serialize()));
    }
  });
});
