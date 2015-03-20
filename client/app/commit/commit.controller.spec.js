describe('Controller: CommitController', function () {
  'use strict';

  var $controller, $q, $rootScope, $scope, ghUser, preparedCommit, commitsMock, commentsMock,
    mockUserData = {login: 'jayGray'};

  beforeEach(module('GHReview'));
  beforeEach(module('CommitMock'));
  beforeEach(module('commitMockModule'));
  beforeEach(module('commentMockModule'));


  beforeEach(inject(['$injector', function ($injector) {
    var Commit = $injector.get('Commit');
    $controller = $injector.get('$controller');
    $rootScope = $injector.get('$rootScope');
    $q = $injector.get('$q');
    ghUser = $injector.get('ghUser');
    commitsMock = $injector.get('commitsMock');
    commentsMock = $injector.get('commentsMock');
    preparedCommit = new Commit({
      user: 'Mock-User',
      repo: 'Mock-Repo',
      sha: 'Mock-SHA'
    });
    preparedCommit.commitData = commitsMock[3];
    preparedCommit.prepareComments(commentsMock[0]);
    spyOn(ghUser, 'get').and.returnValue($q.when(mockUserData));
    $scope = $rootScope.$new();
    $controller('CommitController', {
      '$scope': $scope,
      'preparedCommit': preparedCommit
    });
  }]));


  describe('$scope.loggedInUser', function () {

    it('should be defined', function () {
      expect($scope.loggedInUser).not.toBeDefined();

      $rootScope.$apply();
      expect($scope.loggedInUser).toBeDefined();
      expect($scope.loggedInUser).toBe(mockUserData);
    });

  });

  describe('$scope.commit', function () {

    it('should be defined', function () {
      expect($scope.commit).toBeDefined();
    });

  });

  describe('$scope.commitResponse', function () {

    it('should be defined', function () {
      expect($scope.commitResponse).toBeDefined();
    });

    it('should be equal to commit return commit.bySha', function () {
      expect($scope.commitResponse).toBe(commitsMock[3]);
    });

  });


  describe('$scope methods', function () {

    describe('.addLineComment', function () {

      it('should be defined', function () {
        expect($scope.addLineComment).toBeDefined();
        expect($scope.addLineComment).toEqual(jasmine.any(Function));
      });

      it('should add comments list to line object if it not exist', function () {
        var lineObject = {position: 0, lineNrLeft: 0, path: ''};
        expect(lineObject.comments).not.toBeDefined();

        $scope.addLineComment(lineObject);

        expect(lineObject.comments).toBeDefined();
      });

      it('should add new Comment to comments list', function () {
        var lineObject = {position: 0, lineNrLeft: 0, path: ''};

        $scope.addLineComment(lineObject);

        expect(lineObject.comments).toBeDefined();
      });

      it('should add new Comment in "edit" mode', function () {
        var lineObject = {position: 0, lineNrLeft: 0, path: ''};

        $scope.addLineComment(lineObject);

        expect(lineObject.comments[0].mode).toBe('edit');
      });

      //FIXME removing lineComments in edit mode currently not handled in controller (bug)
      //xit('should remove lineComments in edit mode if one exists', function () {
      //  var lineObject = {position: 0, lineNrLeft: 0, path: '', mode: 'edit'};
      //
      //  $scope.addLineComment(lineObject);
      //
      //  expect(lineObject.comments[0] instanceof Comment).toBe(true);
      //});

    });

    describe('.addCommitComment', function () {

      it('should be defined', function () {
        expect($scope.addCommitComment).toBeDefined();
        expect($scope.addCommitComment).toEqual(jasmine.any(Function));
      });

      it('should add new Comment to $scope.commitComments list', function () {
        expect($scope.commitComments.length).toBe(1);

        $scope.addCommitComment();

        expect($scope.commitComments.length).toBe(2);
      });

      it('should add new Comment in edit mode', function () {
        $scope.addCommitComment();

        expect($scope.commitComments[1].mode).toBe('edit');
      });

      it('should remove comments in edit if one exist', function () {
        $scope.addCommitComment();
        expect($scope.commitComments.length).toBe(2);

        $scope.addCommitComment();
        expect($scope.commitComments.length).toBe(2);
      });

    });

    describe('.removeComment', function () {

      it('should be defined', function () {
        expect($scope.removeComment).toBeDefined();
        expect($scope.removeComment).toEqual(jasmine.any(Function));
      });

      it('should call .remove method of given comment', function () {
        var comment = $scope.commitComments[0];
        spyOn(comment, 'remove').and.returnValue($q.when());

        $scope.removeComment(null, comment);

        expect(comment.remove).toHaveBeenCalled();
      });

      it('should remove comment from line if line is given', function () {
        var lineObject = {position: 0, lineNrLeft: 0, path: ''};
        $scope.addLineComment(lineObject);
        expect(lineObject.comments.length).toBe(1);

        var comment = lineObject.comments[0];
        spyOn(comment, 'remove').and.returnValue($q.when());

        $scope.removeComment(lineObject, comment);

        expect(lineObject.comments.length).toBe(0);
        expect(comment.remove).toHaveBeenCalled();
      });

    });


    describe('.cancelCreateComment', function () {

      it('should be defined', function () {
        expect($scope.cancelCreateComment).toBeDefined();
        expect($scope.cancelCreateComment).toEqual(jasmine.any(Function));
      });

      it('should remove comment in "edit" mode', function () {
        var lineObject = {position: 0, lineNrLeft: 0, path: ''};

        $scope.addCommitComment();
        expect($scope.commitComments.length).toBe(2);
        $scope.cancelCreateComment();
        expect($scope.commitComments.length).toBe(1);
        $scope.addLineComment(lineObject);
        expect(lineObject.comments.length).toBe(1);
        $scope.cancelCreateComment();
      });

    });

    describe('.approveCommit', function () {

      beforeEach(function () {
        spyOn($scope.commit, 'updateComments').and.returnValue($q.when());
      });

      it('should be defined', function () {
        expect($scope.approveCommit).toBeDefined();
        expect($scope.approveCommit).toEqual(jasmine.any(Function));
      });

      it('should should call .approve method of commit', function () {
        spyOn($scope.commit, 'approve').and.returnValue($q.when());
        $scope.approveCommit();
        expect($scope.commit.approve).toHaveBeenCalled();
      });

      it('should should call .updateComments method of commit', function () {
        spyOn($scope.commit, 'approve').and.returnValue($q.when());
        $scope.approveCommit();
        $rootScope.$apply();
        expect($scope.commit.updateComments).toHaveBeenCalled();
      });

    });

    describe('.unapproveCommit', function () {

      beforeEach(function () {
        spyOn($scope.commit, 'updateComments').and.returnValue($q.when());
      });

      it('should be defined', function () {
        expect($scope.unapproveCommit).toBeDefined();
        expect($scope.unapproveCommit).toEqual(jasmine.any(Function));
      });

      it('should should call .unapprove method of commit', function () {
        spyOn($scope.commit, 'unapprove').and.returnValue($q.when());
        $scope.unapproveCommit();
        expect($scope.commit.unapprove).toHaveBeenCalled();
      });

      it('should should call .updateComments method of commit', function () {
        spyOn($scope.commit, 'unapprove').and.returnValue($q.when());
        $scope.unapproveCommit();
        $rootScope.$apply();
        expect($scope.commit.updateComments).toHaveBeenCalled();
      });
    });
  });
});
