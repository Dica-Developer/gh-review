describe('Service: Comment', function () {
  'use strict';

  /*jshint camelcase:false*/
  var Comment, ghComments, $q, $rootScope,
    commitComment = {
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
      line: null,
      position: null,
      updated_at: '2014-06-05T14:19:31Z',
      url: 'https://api.github.com/repos/Dica-Developer/gh-review/comments/6569207',
      editInformations: {
        repo: 'gh-review',
        user: 'Dica-Developer'
      }
    },
    lineComment = JSON.parse(JSON.stringify(commitComment));

  lineComment.line = 39;
  lineComment.path = 'app/templates/_filter.html';
  lineComment.position = 6;

  beforeEach(module('GHReview'));

  beforeEach(inject(function ($injector) {
    localStorage.setItem('ghreview.accessToken', '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad');
    Comment = $injector.get('Comment');
    ghComments = $injector.get('ghComments');
    $q = $injector.get('$q');
    $rootScope = $injector.get('$rootScope');
  }));

  afterEach(function () {
    localStorage.clear();
  });

  it('Should be defined', function () {
    expect(Comment).toBeDefined();
  });

  describe('.createComment', function () {

    it('should call comments.addCommitComment', function () {
      spyOn(ghComments, 'addCommitComment').and.returnValue($q.when({}));
      var comment = new Comment(commitComment);
      comment.createComment();
      $rootScope.$apply();
      expect(ghComments.addCommitComment).toHaveBeenCalled();
    });

    it('should call comments.addLineComment', function () {
      spyOn(ghComments, 'addLineComment').and.returnValue($q.when({}));
      var comment = new Comment(lineComment);
      comment.createComment();
      $rootScope.$apply();
      expect(ghComments.addLineComment).toHaveBeenCalled();
    });

    it('Should set comment.mode to "show"', function () {
      var comment = new Comment(commitComment);
      spyOn(ghComments, 'addCommitComment').and.returnValue($q.when({}));
      expect(comment.mode).toBe('test');
      comment.createComment();
      $rootScope.$apply();
      expect(comment.mode).toBe('show');
    });
  });

  describe('.preview', function () {

    it('Should call comments.renderAsMarkdown', function () {
      spyOn(ghComments, 'renderAsMarkdown').and.returnValue($q.when({}));
      var comment = new Comment(commitComment);
      comment.preview();
      $rootScope.$apply();
      expect(ghComments.renderAsMarkdown).toHaveBeenCalled();
    });

    it('Should set comment.mode to "preview" comment.preview_html to resp.data', function () {
      spyOn(ghComments, 'renderAsMarkdown').and.returnValue($q.when({ data: '<p>Test</p>' }));
      var comment = new Comment(commitComment);
      comment.preview();
      $rootScope.$apply();
      expect(ghComments.renderAsMarkdown).toHaveBeenCalled();
      expect(comment.mode).toBe('preview');
      /*jshint camelcase:false*/
      expect(comment.preview_html).toBe('<p>Test</p>');
    });
  });

  describe('.edit', function () {

    it('Should set comment.mode to "edit" ', function () {
      var comment = new Comment(commitComment);
      comment.edit();
      expect(comment.mode).toBe('edit');
    });

  });

  describe('.continueEditing', function () {

    it('Should set comment.mode to "edit" ', function () {
      var comment = new Comment(commitComment);
      comment.continueEditing();
      expect(comment.mode).toBe('edit');
    });

  });

  describe('.cancelEdit', function () {

    it('Should set comment.mode to "show" and comment.edit_text to empty string', function () {
      var comment = new Comment(commitComment);
      comment.cancelEdit();
      expect(comment.mode).toBe('show');
      expect(comment.edit_text).toBe('');
    });

  });

  describe('.remove', function () {

    it('should call comments.deleteComment', function () {
      spyOn(ghComments, 'deleteComment').and.returnValue($q.when());
      var comment = new Comment(commitComment);
      comment.remove();
      $rootScope.$apply();
      expect(ghComments.deleteComment).toHaveBeenCalled();
    });

  });

  describe('.save', function () {

    it('Should call comments.updateComment', function () {
      spyOn(ghComments, 'updateComment').and.returnValue($q.when({}));
      var comment = new Comment(commitComment);
      comment.save();
      $rootScope.$apply();
      expect(ghComments.updateComment).toHaveBeenCalled();
    });

    it('Should set comment.mode to "show" comment.body to resp.body', function () {
      spyOn(ghComments, 'updateComment').and.returnValue($q.when({ body: 'Test' }));
      var comment = new Comment(commitComment);
      comment.save();
      $rootScope.$apply();
      expect(comment.mode).toBe('show');
      expect(comment.body).toBe('Test');
    });
  });

  describe('.isApproval', function () {

    it('should return false', function () {
      var comment = new Comment(commitComment);
      expect(comment.isApproval()).toBe(false);
    });

    it('should return true', function () {
      var comment = new Comment(commitComment);
      comment.body = 'approved with [gh-review](http://gh-review.herokuapp.com/)';
      expect(comment.isApproval()).toBe(true);
    });

  });

  describe('.getApprover', function () {

    it('should return null', function () {
      var comment = new Comment(commitComment);
      expect(comment.getApprover()).toBeNull();
    });

    it('should return "JayGray"', function () {
      var comment = new Comment(commitComment);
      comment.body = '```json\n{\n  "version": "0.6.2",\n  "approved": true,\n  "approver": "JayGray",\n  "approvalDate": 1414186947435\n}\n```\napproved with [gh-review](http://gh-review.herokuapp.com/)';
      expect(comment.getApprover()).toBe('JayGray');
    });

  });
});