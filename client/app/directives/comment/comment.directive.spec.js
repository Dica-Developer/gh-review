describe('Directive: comment', function () {
  'use strict';

  beforeEach(module('GHReview'));
  beforeEach(module('app/directives/comment/comment.html'));
  beforeEach(module('app/directives/formatted-date/formatted-date.html'));

  var $compile, $rootScope;

  beforeEach(inject(function ($injector) {
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');
  }));

  describe('existing comment', function () {
    var $scope;
    beforeEach(inject(function ($injector) {
      $scope = $rootScope.$new();
      var Comment = $injector.get('Comment');
      /*jshint camelcase:false*/
      $scope.comment = new Comment({
        body_html: '<p>Line comment test</p>',
        commit_id: '9dc35ebda672c3a0443d0af3fa54fda0372cdcd2',
        created_at: '2014-06-05T14:19:31Z',
        html_url: 'https://github.com/Dica-Developer/gh-review/commit/9dc35ebda672c3a0443d0af3fa54fda0372cdcd2#commitcomment-6569207',
        id: 6569207,
        line: 39,
        path: 'app/templates/_filter.html',
        position: 6,
        updated_at: '2014-06-05T14:19:31Z',
        url: 'https://api.github.com/repos/Dica-Developer/gh-review/comments/6569207'
      });
    }));
    it('Should render comment', function () {
      var element = $compile('<div class="lineComment panel panel-default" content="comment" mode="comment.mode" comment></div>')($scope);
      $scope.$digest();
      expect(element.querySelectorAll('.panel-body').text().trim()).toBe('Line comment test');
    });

    it('Should render edit and remove buttons', function () {
      var element = $compile('<div class="lineComment panel panel-default" content="comment" mode="comment.mode" comment></div>')($scope);
      $scope.$digest();
      expect(element.find('button').length).toBe(2);
    });
  });

  describe('new comment', function () {
    var $scope;
    beforeEach(inject(function ($injector) {
      $scope = $rootScope.$new();
      var Comment = $injector.get('Comment');
      /*jshint camelcase:false*/
      $scope.comment = new Comment({
        mode: 'edit',
        line: 39,
        path: 'app/templates/_filter.html',
        position: 6
      });
    }));

    it('Should render comment', function () {
      var element = $compile('<div class="lineComment panel panel-default" content="comment" mode="comment.mode" comment></div>')($scope);
      $scope.$digest();
      expect(element.find('textarea').text()).toBe('');
      expect(element.find('textarea').length).toBe(1);
    });

    it('Should render cancel button only if comment as no content', function () {
      var element = $compile('<div class="lineComment panel panel-default" content="comment" mode="comment.mode" comment></div>')($scope);
      $scope.$digest();
      expect(element.querySelectorAll('#cancelComment').length).toBe(1);
      expect(element.querySelectorAll('#previewComment').length).toBe(0);
      expect(element.querySelectorAll('#submitLineComment').length).toBe(0);
      expect(element.querySelectorAll('#cancelComment').text()).toBe('Cancel');
    });

    it('Should render all buttons if comment as content', function () {
      /*jshint camelcase:false*/
      $scope.comment.edit_text = 'Comment content';
      var element = $compile('<div class="lineComment panel panel-default" content="comment" mode="comment.mode" comment></div>')($scope);
      $scope.$digest();
      expect(element.querySelectorAll('#cancelComment').length).toBe(1);
      expect(element.querySelectorAll('#previewComment').length).toBe(1);
      expect(element.querySelectorAll('#submitLineComment').length).toBe(1);
      expect(element.querySelectorAll('#cancelComment').text()).toBe('Cancel');
      expect(element.querySelectorAll('#previewComment').text()).toBe('Preview');
      expect(element.querySelectorAll('#submitLineComment').text()).toBe('Create');
    });
  });

  describe('preview comment', function () {
    var $scope;
    beforeEach(inject(function ($injector) {
      $scope = $rootScope.$new();
      var Comment = $injector.get('Comment');
      /*jshint camelcase:false*/
      $scope.comment = new Comment({
        mode: 'preview',
        line: 39,
        path: 'app/templates/_filter.html',
        position: 6,
        preview_html: '<p>Test</p>'
      });
    }));
    it('Should render comment', function () {
      var element = $compile('<div class="lineComment panel panel-default" content="comment" mode="comment.mode" comment></div>')($scope);
      $scope.$digest();
      expect(element.find('p').text()).toBe('Test');
      expect(element.find('p').length).toBe(1);
    });

    //FIXME
    xit('Should render cancel, preview and save buttons', function () {
      var element = $compile('<div class="lineComment panel panel-default" content="comment" mode="comment.mode" comment></div>')($scope);
      $scope.$digest();
      expect(element.querySelectorAll('#cancelComment').length).toBe(1);
      expect(element.querySelectorAll('#previewComment').length).toBe(1);
      expect(element.querySelectorAll('#submitLineComment').length).toBe(1);
      expect(element.querySelectorAll('#cancelComment').text()).toBe('Cancel');
      expect(element.querySelectorAll('#previewComment').text()).toBe('Preview');
      expect(element.querySelectorAll('#submitLineComment').text()).toBe('Add');
    });
  });
});