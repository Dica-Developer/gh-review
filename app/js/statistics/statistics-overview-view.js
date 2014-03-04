/*global define*/
define([
  'backbone',
  'underscore',
  'app',
  'text!templates/statistics.html'
], function(Backbone, _, app, template){
  'use strict';

  return Backbone.View.extend({
    el: '#main',
    template: _.template(template),
    render: function(){
      this.$el.html(this.template({models: app.filterCollection.toJSON()}));
    }
  });

});
