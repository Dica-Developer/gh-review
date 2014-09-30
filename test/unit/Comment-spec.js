/*global inject*/
describe('#Comment', function () {
  'use strict';

  /*jshint camelcase:false*/
  var Comment,
    commentData = {
    mode: 'test',
    body_html: '<p>Line comment test</p>',
    preview_html: '<p>Line comment test preview</p>',
    body: 'Line comment test body',
    body_text: 'Line comment test body',
    edit_text: 'Line comment test body edit',
    content: 'Line comment test content',
    sha: 'sad87cv087wfadvb098h',
    commit_id: '9dc35ebda672c3a0443d0af3fa54fda0372cdcd2',
    created_at: '2014-06-05T14:19:31Z',
    html_url: 'https://github.com/Dica-Developer/gh-review/commit/9dc35ebda672c3a0443d0af3fa54fda0372cdcd2#commitcomment-6569207',
    id: 6569207,
    line: 39,
    path: 'app/templates/_filter.html',
    position: 6,
    updated_at: '2014-06-05T14:19:31Z',
    url: 'https://api.github.com/repos/Dica-Developer/gh-review/comments/6569207',
    editInformations: {
      repo: 'gh-review',
      user: 'Dica-Developer'
    }
  };

  beforeEach(angular.mock.module('GHReview'));

  beforeEach(inject(function ($injector) {
    Comment = $injector.get('Comment');
  }));

  it('Should be defined', function () {
    expect(Comment).toBeDefined();
  });

  describe('.createComment', function () {
    var github, $rootScope;

    beforeEach(inject(function ($injector) {
      github = $injector.get('github');
      $rootScope = $injector.get('$rootScope');
    }));

    it('Should call github.repos.createCommitComment', function () {
      var comment = new Comment(commentData);
      var expectedCallArgs = {
        user: commentData.editInformations.user,
        repo: commentData.editInformations.repo,
        sha: commentData.sha,
        /*jshint camelcase:false*/
        body: commentData.edit_text,
        path: commentData.path,
        position: commentData.position,
        line: commentData.line,
        headers: {
          Accept: 'application/vnd.github-commitcomment.full+json'
        }
      };
      var githubSpy = spyOn(github.repos, 'createCommitComment');
      comment.createComment();
      expect(githubSpy.calls.argsFor(0)[0]).toEqual(expectedCallArgs);
    });

    it('Should set comment.mode to "show" and $rootScope.$apply', function () {
      var comment = new Comment(commentData);
      var githubSpy = spyOn(github.repos, 'createCommitComment');
      var scopeSpy = spyOn($rootScope, '$apply');
      comment.createComment();
      var callback = githubSpy.calls.argsFor(0)[1];
      callback(null, {});
      expect(scopeSpy).toHaveBeenCalled();
      expect(comment.mode).toBe('show');
    });
  });

  describe('.preview', function () {
    var github, $rootScope;

    beforeEach(inject(function ($injector) {
      github = $injector.get('github');
      $rootScope = $injector.get('$rootScope');
    }));

    it('Should call github.markdown.render', function () {
      var comment = new Comment(commentData);
      var expectedCallArgs = {
        /*jshint camelcase:false*/
        text: commentData.edit_text,
        mode: 'gfm'
      };
      var githubSpy = spyOn(github.markdown, 'render');
      comment.preview();
      expect(githubSpy.calls.argsFor(0)[0]).toEqual(expectedCallArgs);
    });

    it('Should set comment.mode to "preview" comment.preview_html to resp.data and $rootScope.$apply', function () {
      var comment = new Comment(commentData);
      var githubSpy = spyOn(github.markdown, 'render');
      var scopeSpy = spyOn($rootScope, '$apply');
      comment.preview();
      var callback = githubSpy.calls.argsFor(0)[1];
      callback(null, {
        data: '<p>Test</p>'
      });
      expect(scopeSpy).toHaveBeenCalled();
      expect(comment.mode).toBe('preview');
      /*jshint camelcase:false*/
      expect(comment.preview_html).toBe('<p>Test</p>');
    });
  });

  describe('.edit', function () {
    var github, $rootScope;

    beforeEach(inject(function ($injector) {
      github = $injector.get('github');
      $rootScope = $injector.get('$rootScope');
    }));

    it('Should set comment.mode to "edit" ', function () {
      var comment = new Comment(commentData);
      comment.edit();
      expect(comment.mode).toBe('edit');
    });
  });

  describe('.remove', function () {
    var github, $rootScope;

    beforeEach(inject(function ($injector) {
      github = $injector.get('github');
      $rootScope = $injector.get('$rootScope');
    }));

    it('Should call github.repos.deleteCommitComment', function () {
      var comment = new Comment(commentData);
      var expectedCallArgs = {
        user: commentData.editInformations.user,
        repo: commentData.editInformations.repo,
        id: commentData.id
      };
      var githubSpy = spyOn(github.repos, 'deleteCommitComment');
      comment.remove();
      expect(githubSpy.calls.argsFor(0)[0]).toEqual(expectedCallArgs);
    });

    xit('Should set comment.mode to "edit" comment.content to resp.body and $rootScope.$apply', function () {
      var comment = new Comment(commentData);
      var githubSpy = spyOn(github.repos, 'getCommitComment');
      var scopeSpy = spyOn($rootScope, '$apply');
      comment.edit();
      var callback = githubSpy.calls.argsFor(0)[1];
      callback(null, {
        body: 'Test'
      });
      expect(scopeSpy).toHaveBeenCalled();
      expect(comment.mode).toBe('edit');
      expect(comment.content).toBe('Test');
    });
  });

  describe('.save', function () {
    var github, $rootScope;

    beforeEach(inject(function ($injector) {
      github = $injector.get('github');
      $rootScope = $injector.get('$rootScope');
    }));

    it('Should call github.repos.updateCommitComment', function () {
      var comment = new Comment(commentData);
      var expectedCallArgs = {
        user: commentData.editInformations.user,
        repo: commentData.editInformations.repo,
        id: commentData.id,
        body: commentData.edit_text,
        headers: {
          Accept: 'application/vnd.github-commitcomment.full+json'
        }
      };
      var githubSpy = spyOn(github.repos, 'updateCommitComment');
      comment.save();
      expect(githubSpy.calls.argsFor(0)[0]).toEqual(expectedCallArgs);
    });

    it('Should set comment.mode to "show" and call $rootScope.$apply', function () {
      var comment = new Comment(commentData);
      var githubSpy = spyOn(github.repos, 'updateCommitComment');
      var scopeSpy = spyOn($rootScope, '$apply');
      comment.save();
      var callback = githubSpy.calls.argsFor(0)[1];
      callback(null, {
        body: 'Test'
      });
      expect(scopeSpy).toHaveBeenCalled();
      expect(comment.mode).toBe('show');
    });
  });

});