/*global define*/
define(function (require) {
  'use strict';

  var Backbone = require('backbone');
  var _ = require('underscore');
  var Search = require('Search');
  var template = require('text!reviewModulesTemplates/overview.html');

  return Backbone.View.extend({
    el: '#main',
    template: _.template(template),
    render: function () {
      this.$el.html(this.template());
      var search = new Search();
      search.render();
    }
  });
});
