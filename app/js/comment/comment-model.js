/*global define*/
define(['backbone', 'underscore', 'moment', 'app'], function (Backbone, _, moment, app) {
  'use strict';

  return Backbone.Model.extend({
    initialize: function () {
      var date = moment(this.get('created_at'));
      this.set('commentFromNow', date.fromNow());
      var isCommentEditable = false;
      if (app.authenticated) {
        isCommentEditable = this.get('user').login === app.user.login;
      }
      this.set('isCommentEditable', isCommentEditable);
      var id = this.get('id');
      this.set('commentId', id);
      var commentMessage = this.get('body_html');
      this.set('commentMessage', commentMessage);
      this.set('commitComment', (_.isNull(this.get('line')) && _.isNull(this.get('position'))));
    }
  });
});
