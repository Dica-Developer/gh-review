/*global define*/
define([
  'backbone',
  'underscore',
  'app',
  'UserModel',
  'text!../templates/top-menu.html'
], function (Backbone, _, app, UserModel, template) {
  'use strict';

  var TopMenuView = Backbone.View.extend({
    el: '#topMenu',
    model: null,
    template: _.template(template),
    initialize: function () {
      this.listenTo(app, 'authenticated', this.renderAuthenticatedView);
      this.render();
    },
    renderAuthenticatedView: function(){
      this.model = new UserModel();
      this.model.on('change', this.render, this);
    },
    serialize: function () {
      return {
        ghName: this.model.get('name'),
        avatar: this.model.get('avatar_url'),
        authenticated: true
      };
    },
    events: {
      'change #selectRepo': 'showRepoDetail',
      'click #login': 'login'
    },
    login: function(event){
      event.stopPropagation();
      localStorage.inAuthorizationProcess = true;
      app.authenticate();
    },
    showRepoDetail: function (event) {
      var target = $(event.target),
        option = $('#repositories').find('option[value="' + target.val() + '"]');
      app.router.navigate('#repo/' + option.data('id'), {trigger: true});
    },
    render: function () {
      if(app.authenticated){
        this.$el.html(this.template(this.serialize()));
      }else{
        this.$el.html(this.template({authenticated: false}));
      }
    }
  });

  return new TopMenuView();
});
