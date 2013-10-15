/*global define*/
define(['backbone', 'underscore', 'text!../templates/commit-list-item.html'], function(Backbone, _, template){
  'use strict';
  var CommitListView = Backbone.View.extend({
    tagName: 'li',
    template: _.template(template),
    initialize: function(){
      console.log(this.model);
      this.$el.data('modelid', this.model.cid);
      this.render();
    },
    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
    }
  });

  return CommitListView;
});