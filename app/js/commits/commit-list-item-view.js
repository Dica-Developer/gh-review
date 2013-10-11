/*global define*/
define(['backbone', 'underscore', 'text!../templates/commit-list-item.html'], function(Backbone, _, template){
  'use strict';
  var CommitListView = Backbone.View.extend({
    tagName: 'li',
    template: _.template(template),
    initialize: function(){
      this.$el.data('modelid', this.model.id);
      this.$el.data('user', this.model.get('user'));
      this.$el.data('repo', this.model.get('repo'));
      this.render();
    },
    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
    }
  });

  return CommitListView;
});