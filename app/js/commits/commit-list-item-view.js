/*global define*/
define(['backbone', 'underscore', 'text!../templates/commit-list-item.html'], function (Backbone, _, template) {
  'use strict';
  var CommitListView = Backbone.View.extend({
    template: _.template(template),
    initialize: function () {
      this.render();
    },
    render: function () {
      return this.template(this.model.toJSON());
    }
  });

  return CommitListView;
});