/*global define*/
define([
  'backbone',
  'underscore',
  'app',
  'userModel',
  'repoCollection',
  'text!../templates/top-menu.html'
], function(Backbone, _, app, userModel, repoCollection, template){
  'use strict';

  var TopMenuView = Backbone.View.extend({
    el: '#topMenu',
    model: userModel,
    template: _.template(template),
    initialize: function(){
      app.on('ready', this.render, this);
      repoCollection.on('add', this.render, this);
      this.model.on('change', this.render, this);
    },
    serialize: function(){
      return {
        name: this.model.get('name'),
        repos: repoCollection.toJSON()
      };
    },
    events: {
      'change #selectRepo': 'showRepoDetail'
    },
    showRepoDetail: function(event){
      var target = $(event.target),
        option = $('#repositories').find('option[value="' + target.val() + '"]');
      app.router.navigate('#repo/' + option.data('id'), {trigger: true});
    },
    render: function(){
      this.$el.html(this.template(this.serialize()));
    }
  });

  return new TopMenuView();
});
