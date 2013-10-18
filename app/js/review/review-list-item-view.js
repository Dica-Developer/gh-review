/*global define*/
define([
  'backbone',
  'underscore',
  'text!../templates/review-list-item.html'
], function(Backbone, _, template){
  'use strict';

  var ReviewListItemView = Backbone.View.extend({
    tagName: 'a',
    attributes: {
      'class': 'list-group-item'
    },
    template: _.template(template),
    events: {
      'click .destroy' : 'clear'
    },
    initialize: function() {
      this.$el.attr('href', '#review/' + this.model.id);
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    clear: function(event){
      event.stopPropagation();
      event.preventDefault();
      this.model.destroy();
    }
  });

  return ReviewListItemView;
});
