/*global define*/
define([
  'backbone',
  'underscore',
  'text!../templates/review-list-item.html'
], function(Backbone, _, template){
  'use strict';

  var ReviewListItemView = Backbone.View.extend({
    tagName: 'li',
    template: _.template(template),
    events: {
      'click a.destroy' : 'clear'
    },
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.data('modelid', this.model.id);
      return this;
    },
    clear: function(){
      this.model.destroy();
    }
  });

  return ReviewListItemView;
});
