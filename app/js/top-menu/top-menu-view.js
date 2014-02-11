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
      if (app.authenticated) {
        this.model = new UserModel();
        this.model.on('change', this.setAvatarAndLogout, this);
      }
      this.render();
    },
    setAvatarAndLogout: function () {
      var container = this.$('#loginLogoutContainer');
      var avatarUrl = this.model.get('avatar_url');
      var content = '';
      if (avatarUrl) {
        content = content + '<img src="' + avatarUrl + '" height="50"/>';
      }
      content = content + this.model.get('name');
      container.html(content);
    },
    events: {
      'change #selectRepo': 'showRepoDetail'
    },
    showRepoDetail: function (event) {
      var target = $(event.target),
        option = $('#repositories').find('option[value="' + target.val() + '"]');
      app.router.navigate('#repo/' + option.data('id'), {trigger: true});
    },
    render: function () {
      this.$el.html(this.template());
    }
  });

  return TopMenuView;
});
