/*global define*/
define([
  'backbone',
  'underscore',
  'app',
  'UserModel',
  'text!../templates/top-menu.html',
  'text!../templates/top-right-menu.html'
], function (Backbone, _, app, UserModel, template, topRightTemplate) {
  'use strict';

  var TopMenuView = Backbone.View.extend({
    el: '#topMenu',
    model: null,
    template: _.template(template),
    topRightTemplate: _.template(topRightTemplate),
    initialize: function () {
      if (app.authenticated) {
        this.model = new UserModel();
        this.model.getUserData().then(function (user) {
          this.setAvatarAndLogout();
          app.user = user;
        }.bind(this));
      }
      this.render();
    },
    setAvatarAndLogout: function () {
      var container = this.$('#loginLogoutContainer');
      var parent = container.parent();
      //var avatarUrl = this.model.get('avatar_url');
      parent.html(this.topRightTemplate({
        userName: this.model.get('name')
      }));
    },
    events: {
      'change #selectRepo': 'showRepoDetail'
    },
    showRepoDetail: function (event) {
      var target = $(event.target),
        option = $('#repositories').find('option[value="' + target.val() + '"]');
      app.router.navigate('#repo/' + option.data('id'), {
        trigger: true
      });
    },
    render: function () {
      this.$el.html(this.template());
    }
  });

  return TopMenuView;
});