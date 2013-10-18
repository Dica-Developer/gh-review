/*global define*/
define(['backbone', 'underscore', 'text!../templates/commit-list-item.html'], function(Backbone, _, template){
  'use strict';
  var CommitListView = Backbone.View.extend({
    tagName: 'a',
    template: _.template(template),
    initialize: function(){
      this.$el.attr('href', '#commit/' + this.model.cid);
      this.$el.addClass('list-group-item');
      this.render();
    },
    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
    }
  });

  return CommitListView;
});