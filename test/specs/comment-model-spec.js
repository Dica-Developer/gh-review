/*global define, describe, it, expect, spyOn*/
define(['app', 'moment', 'CommentModel'], function (app, moment, CommentModel) {
  'use strict';

  var exampleCommentResponse = {
    'url': 'https://api.github.com/repos/Dica-Developer/gh-review/comments/5479503',
    'html_url': 'https://github.com/Dica-Developer/gh-review/commit/c88aab3067c50c1a904fee575592aead4bc59904#commitcomment-5479503',
    'id': 5479503,
    'user': {
      'login': 'JayGray',
      'id': 675206,
      'avatar_url': 'https://gravatar.com/avatar/cf12ae28f798e2377aa712d7055e5eb9?d=https%3A%2F%2Fidenticons.github.com%2F9fb3548a180222bd22da74bb3dbe6363.png&r=x',
      'gravatar_id': 'cf12ae28f798e2377aa712d7055e5eb9',
      'url': 'https://api.github.com/users/JayGray',
      'html_url': 'https://github.com/JayGray',
      'followers_url': 'https://api.github.com/users/JayGray/followers',
      'following_url': 'https://api.github.com/users/JayGray/following{/other_user}',
      'gists_url': 'https://api.github.com/users/JayGray/gists{/gist_id}',
      'starred_url': 'https://api.github.com/users/JayGray/starred{/owner}{/repo}',
      'subscriptions_url': 'https://api.github.com/users/JayGray/subscriptions',
      'organizations_url': 'https://api.github.com/users/JayGray/orgs',
      'repos_url': 'https://api.github.com/users/JayGray/repos',
      'events_url': 'https://api.github.com/users/JayGray/events{/privacy}',
      'received_events_url': 'https://api.github.com/users/JayGray/received_events',
      'type': 'User',
      'site_admin': false
    },
    'position': null,
    'line': null,
    'path': null,
    'commit_id': 'c88aab3067c50c1a904fee575592aead4bc59904',
    'created_at': '2014-02-25T07:43:33Z',
    'updated_at': '2014-02-25T07:43:33Z',
    'body_html': '<p>Approved by <a href=\"https://github.com/JayGray\" class=\"user-mention\">@JayGray</a></p>'
  };

  describe('#CommentModel', function () {
    it('Should be defined', function () {
      expect(CommentModel).toBeDefined();
    });
  });

  describe('.initialize', function () {

    it('Should call #CommentModel.set with [ "commentFromNow", "a few seconds ago" ]', function () {
      var setSpy = spyOn(CommentModel.prototype, 'set');
      new CommentModel(exampleCommentResponse);
      expect(setSpy.calls.argsFor(1)).toEqual(['commentFromNow', 'a few seconds ago']);
    });

    it('Should call #CommentModel.set with [ "isCommentEditable", "false" ]', function () {
      var setSpy = spyOn(CommentModel.prototype, 'set');
      new CommentModel(exampleCommentResponse);
      expect(setSpy.calls.argsFor(2)).toEqual(['isCommentEditable', false]);
    });

    it('Should call #CommentModel.set with [ "isCommentEditable", "true" ]', function () {
      app.authenticated = true;
      app.user = {
        login: 'JayGray'
      };
      var setSpy = spyOn(CommentModel.prototype, 'set').and.callThrough();
      new CommentModel(exampleCommentResponse);
      expect(setSpy.calls.argsFor(2)).toEqual(['isCommentEditable', true]);
      app.authenticated = false;
      app.user = null;
    });

    it('Should call #CommentModel.set with [ "commentId", "5479503" ]', function () {
      var setSpy = spyOn(CommentModel.prototype, 'set').and.callThrough();
      new CommentModel(exampleCommentResponse);
      expect(setSpy.calls.argsFor(3)).toEqual(['commentId', 5479503]);
    });

    it('Should call #CommentModel.set with [ "commentMessage", "<p>Approved by <a href=\"https://github.com/JayGray\" class=\"user-mention\">@JayGray</a></p>" ]', function () {
      var setSpy = spyOn(CommentModel.prototype, 'set').and.callThrough();
      new CommentModel(exampleCommentResponse);
      expect(setSpy.calls.argsFor(4)).toEqual(['commentMessage', '<p>Approved by <a href=\"https://github.com/JayGray\" class=\"user-mention\">@JayGray</a></p>']);
    });

  });

});
