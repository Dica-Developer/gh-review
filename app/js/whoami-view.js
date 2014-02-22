/*global define*/
define(['backbone', 'underscore', 'app', 'text!templates/whoami.html'], function (Backbone, _, app, template) {
  'use strict';

  return Backbone.View.extend({
    el: '#main',
    template: _.template(template),
    initialize: function () {
    },
    render: function () {
      this.$el.html(this.template({
        user: this.model.attributes
      }));
      app.showIndicator(false);
    }
  });

});