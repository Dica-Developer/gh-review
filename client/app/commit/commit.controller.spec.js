(function () {
  'use strict';

  describe('Controller: CommitController', function () {

    var $controller, $q, $rootScope, githubUserData, ghCommits,
      Commit, ghComments, Comment, commitsMock, commentsMock, github,
      mockUserData = {login: 'jayGray'};

    beforeEach(module('GHReview'));
    beforeEach(module('commitMockModule'));
    beforeEach(module('commentMockModule'));


    beforeEach(inject(['$injector', function ($injector) {
      $controller = $injector.get('$controller');
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      ghCommits = $injector.get('ghCommits');
      Commit = $injector.get('Commit');
      ghComments = $injector.get('ghComments');
      Comment = $injector.get('Comment');
      githubUserData = $injector.get('githubUserData');
      github = $injector.get('github');
      commitsMock = $injector.get('commitsMock');
      commentsMock = $injector.get('commentsMock');
    }]));

    describe('$scope init', function () {
      var $scope;

      beforeEach(function () {
        spyOn(githubUserData, 'get').and.returnValue($q.when(mockUserData));
        spyOn(ghCommits, 'bySha').and.returnValue($q.when(commitsMock[0]));
        spyOn(ghComments, 'getForCommit').and.returnValue($q.when(commentsMock[0]));
        $scope = $rootScope.$new();
      });

      describe('.loggedInUser', function () {

        it('should be defined', function () {
          $controller('CommitController', {
            '$scope': $scope,
            '$stateParams': {}
          });

          expect($scope.loggedInUser).not.toBeDefined();

          $rootScope.$apply();
          expect($scope.loggedInUser).toBeDefined();
          expect($scope.loggedInUser).toBe(mockUserData);
        });

      });

      describe('.commit', function () {

        it('should be defined', function () {
          $controller('CommitController', {
            '$scope': $scope,
            '$stateParams': {}
          });

          expect($scope.commit).toBeDefined();
        });

        it('should be an instance of Commit', function () {
          $controller('CommitController', {
            '$scope': $scope,
            '$stateParams': {}
          });

          expect($scope.commit instanceof Commit).toBe(true);
        });

      });

      describe('.commitResponse', function () {

        it('should be defined', function () {
          $controller('CommitController', {
            '$scope': $scope,
            '$stateParams': {}
          });

          expect($scope.commitResponse).not.toBeDefined();
          $rootScope.$apply();
          expect($scope.commitResponse).toBeDefined();
        });

        it('should be equal to commit return commit.bySha', function () {
          $controller('CommitController', {
            '$scope': $scope,
            '$stateParams': {}
          });

          $rootScope.$apply();
          expect($scope.commitResponse).toBe(commitsMock[0]);
        });

      });

    });


    describe('$scope methods', function () {
      var $scope;

      beforeEach(function () {
        spyOn(githubUserData, 'get').and.returnValue($q.when(mockUserData));
        spyOn(ghCommits, 'bySha').and.returnValue($q.when(commitsMock[0]));
        spyOn(ghComments, 'getForCommit').and.returnValue($q.when(commentsMock[0]));
        $scope = $rootScope.$new();
      });

      describe('.addLineComment', function () {

        beforeEach(function () {
          $controller('CommitController', {
            '$scope': $scope,
            '$stateParams': {}
          });
          $rootScope.$apply();
        });

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

          expect(lineObject.comments[0] instanceof Comment).toBe(true);
        });

        it('should add new Comment in "edit" mode', function () {
          var lineObject = {position: 0, lineNrLeft: 0, path: ''};

          $scope.addLineComment(lineObject);

          expect(lineObject.comments[0].mode).toBe('edit');
        });

        //FIXME removing lineComments in edit mode currently not handled in controller (bug)
        xit('should remove lineComments in edit mode if one exists', function () {
          var lineObject = {position: 0, lineNrLeft: 0, path: '', mode: 'edit'};

          $scope.addLineComment(lineObject);

          expect(lineObject.comments[0] instanceof Comment).toBe(true);
        });

      });

      describe('.addCommitComment', function () {

        beforeEach(function () {
          $controller('CommitController', {
            '$scope': $scope,
            '$stateParams': {}
          });
          $rootScope.$apply();
        });

        it('should be defined', function () {
          expect($scope.addCommitComment).toBeDefined();
          expect($scope.addCommitComment).toEqual(jasmine.any(Function));
        });

        it('should add new Comment to $scope.commitComments list', function () {
          expect($scope.commitComments.length).toBe(1);

          $scope.addCommitComment();

          expect($scope.commitComments.length).toBe(2);
          expect($scope.commitComments[1] instanceof Comment).toBe(true);
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

        beforeEach(function () {
          $controller('CommitController', {
            '$scope': $scope,
            '$stateParams': {}
          });
          $rootScope.$apply();
        });

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

        beforeEach(function () {
          $controller('CommitController', {
            '$scope': $scope,
            '$stateParams': {}
          });
          $rootScope.$apply();
        });

        it('should be defined', function () {
          expect($scope.cancelCreateComment).toBeDefined();
          expect($scope.cancelCreateComment).toEqual(jasmine.any(Function));
        });

        it('should remove comment in "edit" mode', function () {
          $scope.addCommitComment();
          expect($scope.commitComments.length).toBe(2);
          $scope.cancelCreateComment();
          expect($scope.commitComments.length).toBe(1);
        });

      });

      describe('.approveCommit', function () {

        beforeEach(function () {
          $controller('CommitController', {
            '$scope': $scope,
            '$stateParams': {}
          });
          $rootScope.$apply();
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

      });

      describe('.unapproveCommit', function () {

        beforeEach(function () {
          $controller('CommitController', {
            '$scope': $scope,
            '$stateParams': {}
          });
          $rootScope.$apply();
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

      });
    });
  });

}());
