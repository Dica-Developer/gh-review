/*global inject, Github*/

describe('#Services', function () {
  'use strict';

  beforeEach(angular.mock.module('GHReview'));

  describe('authenticated', function () {
    var authenticated;

    beforeEach(inject(function ($injector) {
      authenticated = $injector.get('authenticated');
    }));

    afterEach(function () {
      localStorage.clear();
    });

    it('.get should return false if no access token is stored', function () {
      expect(authenticated.get()).toBeFalsy();
    });

    it('.get should return true if access token is stored', function () {
      localStorage.setItem('ghreview.accessToken', '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad');
      expect(authenticated.get()).toBeTruthy();
    });

    it('.set should store access token to local storage', function () {
      authenticated.set({
        'access_token': 'test-to-ken'
      });
      expect(localStorage.length).toBe(1);
      expect(localStorage['ghreview.accessToken']).toBe('test-to-ken');
    });

  });

  describe('.github', function () {
    var github;

    beforeEach(inject(function ($injector) {
      github = $injector.get('github');
    }));

    afterEach(function () {
      localStorage.clear();
    });

    it('Should be defined', function () {
      expect(github instanceof Github).toBeTruthy();
    });

  });

  describe('.githubUserData', function () {
    var githubUserData, github, $rootScope;

    beforeEach(inject(function ($injector) {
      githubUserData = $injector.get('githubUserData');
      github = $injector.get('github');
      $rootScope = $injector.get('$rootScope');
    }));

    it('Should be defined', function () {
      expect(githubUserData).toBeDefined();
    });

    it('Should call "github.user.get"', function () {
      spyOn(github.user, 'get');
      githubUserData.get();
      expect(github.user.get).toHaveBeenCalled();
    });

    it('Should return promise and resolve if response has no errors', function (done) {
      spyOn(github.user, 'get');

      githubUserData.get()
        .then(function (data) {
          expect(data).toBeDefined();
          done();
        });

      var getCallback = github.user.get.calls.argsFor(0)[1];
      getCallback(null, {});

      $rootScope.$apply();
    });

    it('Should return promise and reject if response has errors', function (done) {
      spyOn(github.user, 'get');

      githubUserData.get()
        .then(function (data) {
          expect(data).toBeDefined();
          done();
        }, function (error) {
          expect(error.name).toBe('TestError');
          done();
        });

      var getCallback = github.user.get.calls.argsFor(0)[1];
      getCallback({
        name: 'TestError'
      }, null);

      $rootScope.$apply();
    });

    it('Should take cached userData instead calling github if userData already fetched', function (done) {
      spyOn(github.user, 'get');

      githubUserData.get()
        .then(function () {
          expect(github.user.get).toHaveBeenCalled();
        });

      var getCallback = github.user.get.calls.argsFor(0)[1];
      getCallback(null, {});
      $rootScope.$apply();

      githubUserData.get()
        .then(function () {
          expect(github.user.get.call.length).toBe(1);
          done();
        });
      $rootScope.$apply();
    });

  });

  describe('.commits', function () {

    describe('.bySha', function () {
      var commits, github, $rootScope,
        githubParams = {
          user: 'testUser',
          repo: 'testRepo',
          sha: 'master'
        };

      beforeEach(inject(function ($injector) {
        commits = $injector.get('commits');
        github = $injector.get('github');
        $rootScope = $injector.get('$rootScope');
      }));

      it('Should be defined', function () {
        expect(commits.bySha).toBeDefined();
      });

      it('Should call "github.repos.getCommit"', function () {
        spyOn(github.repos, 'getCommit');
        commits.bySha(githubParams);
        expect(github.repos.getCommit.calls.argsFor(0)[0]).toEqual(githubParams);
      });

      it('Should return promise and resolve if response has no errors', function (done) {
        spyOn(github.repos, 'getCommit');

        commits.bySha(githubParams)
          .then(function (data) {
            expect(data).toBeDefined();
            done();
          });

        var getCallback = github.repos.getCommit.calls.argsFor(0)[1];
        getCallback(null, {});

        $rootScope.$apply();
      });

      it('Should return promise and reject if response has errors', function (done) {
        spyOn(github.repos, 'getCommit');

        commits.bySha(githubParams)
          .then(null, function (error) {
            expect(error.name).toBe('TestError');
            done();
          });

        var getCallback = github.repos.getCommit.calls.argsFor(0)[1];
        getCallback({
          name: 'TestError'
        }, null);

        $rootScope.$apply();
      });
    });

    describe('.byPath', function () {
      var commits, $rootScope,
        githubParams = {
          user: 'testUser',
          repo: 'testRepo',
          path: '/',
          sha: 'master'
        };

      beforeEach(inject(function ($injector) {
        commits = $injector.get('commits');
        $rootScope = $injector.get('$rootScope');
      }));

      it('Should be defined', function () {
        expect(commits.byPath).toBeDefined();
      });

      xit('Should return promise and resolve if response has no errors', function (done) {
        commits.byPath(githubParams)
          .then(function (data) {
            expect(data).toBeDefined();
            done();
          });

        $rootScope.$apply();
      });

      xit('Should return promise and reject if response has errors', function (done) {
        commits.byPath(githubParams)
          .then(null, function (error) {
            expect(error.name).toBe('TestError');
            done();
          });

        $rootScope.$apply();
      });
    });
  });

  describe('.getAllFilter', function () {
    var filter;

    beforeEach(inject(function ($injector) {
      localStorage.setItem('ghreview.filter', 'e0a35c44-1066-9a60-22f2-86bd825bc70c,2d3e5719-fc16-b69e-4a27-1cb2521fbeba');
      localStorage.setItem('ghreview.filter-2d3e5719-fc16-b69e-4a27-1cb2521fbeba', '{"sha":"master","customFilter":{"state":"reviewed"},"repo":"gh-review","user":"Dica-Developer","since":"2012-05-13T18:21:29.919Z","id":"2d3e5719-fc16-b69e-4a27-1cb2521fbebf"}');
      localStorage.setItem('ghreview.filter-e0a35c44-1066-9a60-22f2-86bd825bc70c', '{"sha":"master","customFilter":{},"repo":"forTestUseOnly","user":"jwebertest","since":"2014-04-14T16:41:48.746Z","id":"e0a35c44-1066-9a60-22f2-86bd825bc70c"}');
      filter = $injector.get('filter');
    }));

    afterEach(function () {
      localStorage.clear();
    });

    it('Should return all stored filter', function () {
      var allFilter = filter.getAll();
      expect(allFilter).toBeDefined();
      expect(allFilter.length).toBe(2);
    });

  });

  describe('.getFilterById', function () {
    var filter;

    beforeEach(inject(function ($injector) {
      localStorage.setItem('ghreview.filter', 'e0a35c44-1066-9a60-22f2-86bd825bc70c,2d3e5719-fc16-b69e-4a27-1cb2521fbeba');
      localStorage.setItem('ghreview.filter-2d3e5719-fc16-b69e-4a27-1cb2521fbeba', '{"sha":"master","customFilter":{"state":"reviewed"},"repo":"gh-review","user":"Dica-Developer","since":"2012-05-13T18:21:29.919Z","id":"2d3e5719-fc16-b69e-4a27-1cb2521fbebf"}');
      localStorage.setItem('ghreview.filter-e0a35c44-1066-9a60-22f2-86bd825bc70c', '{"sha":"master","customFilter":{},"repo":"forTestUseOnly","user":"jwebertest","since":"2014-04-14T16:41:48.746Z","id":"e0a35c44-1066-9a60-22f2-86bd825bc70c"}');
      filter = $injector.get('filter');
    }));

    afterEach(function () {
      localStorage.clear();
    });

    it('Should return specific filter', function () {
      var filterById = filter.getById('e0a35c44-1066-9a60-22f2-86bd825bc70c');
      expect(filterById).toBeDefined();
      expect(filterById.getId()).toBe('e0a35c44-1066-9a60-22f2-86bd825bc70c');
    });

  });

  describe('.removeFilter', function () {
    var filter;

    beforeEach(inject(function ($injector) {
      localStorage.setItem('ghreview.filter', 'e0a35c44-1066-9a60-22f2-86bd825bc70c,2d3e5719-fc16-b69e-4a27-1cb2521fbeba');
      localStorage.setItem('ghreview.filter-2d3e5719-fc16-b69e-4a27-1cb2521fbeba', '{"sha":"master","customFilter":{"state":"reviewed"},"repo":"gh-review","user":"Dica-Developer","since":"2012-05-13T18:21:29.919Z","id":"2d3e5719-fc16-b69e-4a27-1cb2521fbebf"}');
      localStorage.setItem('ghreview.filter-e0a35c44-1066-9a60-22f2-86bd825bc70c', '{"sha":"master","customFilter":{},"repo":"forTestUseOnly","user":"jwebertest","since":"2014-04-14T16:41:48.746Z","id":"e0a35c44-1066-9a60-22f2-86bd825bc70c"}');
      filter = $injector.get('filter');
    }));

    afterEach(function () {
      localStorage.clear();
    });

    it('Should remove specific filter', function () {
      filter.remove('e0a35c44-1066-9a60-22f2-86bd825bc70c');
      var removedFilter = localStorage.getItem('ghreview.filter-e0a35c44-1066-9a60-22f2-86bd825bc70c');
      expect(removedFilter).toBeNull();
    });

    it('Should remove id from filter list', function () {
      var filterList = localStorage.getItem('ghreview.filter').split(',');
      expect(filterList.length).toBe(2);
      filter.remove('e0a35c44-1066-9a60-22f2-86bd825bc70c');
      filterList = localStorage.getItem('ghreview.filter').split(',');
      expect(filterList.length).toBe(1);
    });
  });

  describe('.humanReadableDate', function () {
    var humanReadableDate, date;

    beforeEach(inject(function ($injector) {
      humanReadableDate = $injector.get('humanReadableDate');
      date = new Date(new Date().getFullYear() - 35, 11, 10).getTime();
    }));

    it('Should be defined', function () {
      expect(humanReadableDate).toBeDefined();
      expect(humanReadableDate.fromNow).toBeDefined();
      expect(humanReadableDate.format).toBeDefined();
      expect(humanReadableDate.customFormat).toBeDefined();
    });

    it('Should humanReadableDate.fromNow should return an "ago" string', function () {
      expect(humanReadableDate.fromNow(date)).toBe('35 years ago');
    });

    it('Should humanReadableDate.fromNow should return null if no date is given', function () {
      expect(humanReadableDate.fromNow()).toBeNull();
    });

    it('Should humanReadableDate.format should return a string', function () {
      expect(humanReadableDate.format(date)).toBe('Mon, Dec 10 1979 12:00 AM');
    });

    it('Should humanReadableDate.format should return null if no date is given', function () {
      expect(humanReadableDate.format()).toBeNull();
    });

    it('Should humanReadableDate.customFormat should return a date in default format if pattern is null', function () {
      expect(humanReadableDate.customFormat(date, null)).toContain('1979-12-10T00:00:00');
    });

    it('Should humanReadableDate.customFormat should return only the year if pattern is "YYYY"', function () {
      expect(humanReadableDate.customFormat(date, 'YYYY')).toBe('1979');
    });

    it('Should humanReadableDate.customFormat should return only "1979 jub jub 00" if pattern is "YYYY jub jub ss"', function () {
      expect(humanReadableDate.customFormat(date, 'YYYY jub jub ss')).toBe('1979 jub jub 00');
    });

    it('Should humanReadableDate.customFormat should return null if no date is given', function () {
      expect(humanReadableDate.customFormat()).toBeNull();
    });
  });

  describe('.getCommitApproved', function () {
    var getCommitApproved, commentCollector;

    beforeEach(inject(function ($injector) {
      getCommitApproved = $injector.get('getCommitApproved');
      commentCollector = $injector.get('commentCollector');
    }));

    it('Should be a promise', function () {
      expect(getCommitApproved.then).toBeDefined();
    });
  });

  describe('.getAllAvailableRepos', function () {
    var getAllAvailableRepos, authenticated,
      githubUserData, github, $rootScope;

    beforeEach(inject(function ($injector) {
      getAllAvailableRepos = $injector.get('getAllAvailableRepos');
      authenticated = $injector.get('authenticated');
      githubUserData = $injector.get('githubUserData');
      github = $injector.get('github');
      $rootScope = $injector.get('$rootScope');
    }));

    it('Should be defined', function () {
      getAllAvailableRepos();
      expect(getAllAvailableRepos).toBeDefined();
    });

    it('Should call authenticated.get', function () {
      spyOn(authenticated, 'get');
      getAllAvailableRepos();
      expect(authenticated.get).toHaveBeenCalled();
    });

    it('Should call github.repos.getAll', function () {
      spyOn(authenticated, 'get').and.returnValue(true);
      spyOn(github.repos, 'getAll');
      getAllAvailableRepos();
      $rootScope.$apply();
      expect(github.repos.getAll).toHaveBeenCalled();
    });

    it('Should return promise and resolve if data exist', function (done) {
      spyOn(authenticated, 'get').and.returnValue(true);
      spyOn(github.repos, 'getAll');
      getAllAvailableRepos()
        .then(function (data) {
          expect(data).toBeDefined();
          done();
        });

      $rootScope.$apply();

      var getAllAvailableReposCallback = github.repos.getAll.calls.argsFor(0)[1];
      getAllAvailableReposCallback(null, {});
      $rootScope.$apply();
    });

    it('Should return promise and reject if error exist', function (done) {
      spyOn(authenticated, 'get').and.returnValue(true);
      spyOn(github.repos, 'getAll');
      getAllAvailableRepos()
        .then(null, function (data) {
          expect(data).toBeDefined();
          expect(data.name).toBe('Error');
          done();
        });

      $rootScope.$apply();

      var getAllAvailableReposCallback = github.repos.getAll.calls.argsFor(0)[1];
      getAllAvailableReposCallback({
        name: 'Error'
      }, null);
      $rootScope.$apply();
    });

    it('Should return promise and reject user is not authenticated yet', function (done) {
      spyOn(authenticated, 'get').and.returnValue(false);
      getAllAvailableRepos()
        .then(null, function (data) {
          expect(data).toBeDefined();
          expect(data instanceof Error).toBeTruthy();
          done();
        });
      $rootScope.$apply();
    });
  });

  describe('.githubFreeSearch', function () {
    var githubFreeSearch, authenticated, github, $rootScope;

    beforeEach(inject(function ($injector) {
      githubFreeSearch = $injector.get('githubFreeSearch');
      authenticated = $injector.get('authenticated');
      github = $injector.get('github');
      $rootScope = $injector.get('$rootScope');
    }));

    it('Should call github.search.code', function () {
      spyOn(github.search, 'code');
      githubFreeSearch();
      expect(github.search.code).toHaveBeenCalled();
    });

    it('Should return promise and resolve if data exist', function (done) {
      spyOn(github.search, 'code');
      githubFreeSearch()
        .then(function (data) {
          expect(data).toBeDefined();
          expect(data.result).toBe('testResult');
          done();
        });
      var callback = github.search.code.calls.argsFor(0)[1];
      callback(null, {
        result: 'testResult'
      });
      expect(github.search.code).toHaveBeenCalled();
      $rootScope.$apply();
    });

    it('Should return promise and reject if error exist', function (done) {
      spyOn(github.search, 'code');
      githubFreeSearch()
        .then(null, function (error) {
          expect(error).toBeDefined();
          expect(error.name).toBe('Error');
          done();
        });
      var callback = github.search.code.calls.argsFor(0)[1];
      callback({
        name: 'Error'
      }, null);
      expect(github.search.code).toHaveBeenCalled();
      $rootScope.$apply();
    });
  });

  describe('.getFileContent', function () {
    var getFileContent, github, $rootScope;

    beforeEach(inject(function ($injector) {
      getFileContent = $injector.get('getFileContent');
      github = $injector.get('github');
      $rootScope = $injector.get('$rootScope');
    }));

    it('Should call github.search.code', function () {
      spyOn(github.repos, 'getContent');
      getFileContent({});
      expect(github.repos.getContent).toHaveBeenCalled();
    });

    it('Should return promise and resolve if data exist', function (done) {
      spyOn(github.repos, 'getContent');
      getFileContent({})
        .then(function (data) {
          expect(data).toBeDefined();
          expect(data.result).toBe('testResult');
          done();
        });
      var callback = github.repos.getContent.calls.argsFor(0)[1];
      callback(null, {
        data: {
          result: 'testResult'
        }
      });
      expect(github.repos.getContent).toHaveBeenCalled();
      $rootScope.$apply();
    });

    it('Should return promise and reject if error exist', function (done) {
      spyOn(github.repos, 'getContent');
      getFileContent({})
        .then(null, function (error) {
          expect(error).toBeDefined();
          expect(error.name).toBe('Error');
          done();
        });
      var callback = github.repos.getContent.calls.argsFor(0)[1];
      callback({
        name: 'Error'
      }, null);
      expect(github.repos.getContent).toHaveBeenCalled();
      $rootScope.$apply();
    });

    it('Should delete property ref not sha from options if null', function (done) {
      spyOn(github.repos, 'getContent');
      getFileContent({
        ref: null,
        sha: 'bla'
      })
        .then(function (data) {
          expect(data).toBeDefined();
          done();
        });
      var callback = github.repos.getContent.calls.argsFor(0)[1];
      var callOptions = github.repos.getContent.calls.argsFor(0)[0];
      callback(null, {
        data: {
          bla: 'bla'
        }
      });
      expect(callOptions.ref).not.toBeDefined();
      expect(callOptions.sha).toBeDefined();
      $rootScope.$apply();
    });

    it('Should not delete property ref but sha from options if not null', function (done) {
      spyOn(github.repos, 'getContent');
      getFileContent({
        ref: 'not null',
        sha: 'delete me'
      })
        .then(function (data) {
          expect(data).toBeDefined();
          done();
        });
      var callback = github.repos.getContent.calls.argsFor(0)[1];
      var callOptions = github.repos.getContent.calls.argsFor(0)[0];
      callback(null, {
        data: {
          bla: 'bla'
        }
      });
      expect(callOptions.ref).toBeDefined();
      expect(callOptions.sha).not.toBeDefined();
      $rootScope.$apply();
    });
  });

  describe('.commentProviderService', function () {
    var commentProviderService, commentProvider;

    beforeEach(inject(function ($injector) {
      commentProviderService = $injector.get('commentProviderService');
      commentProvider = $injector.get('commentProvider');
    }));

    it('Should return commentProvider', function () {
      expect(commentProviderService).toEqual(commentProvider);
    });
  });

  describe('.commitProviderService', function () {
    var commitProviderService, commitProvider;

    beforeEach(inject(function ($injector) {
      commitProviderService = $injector.get('commitProviderService');
      commitProvider = $injector.get('commitProvider');
    }));

    it('Should return commitProvider', function () {
      expect(commitProviderService).toEqual(commitProvider);
    });
  });

  describe('.isCommentNotApprovalComment', function () {

    var commentCollector, isCommentNotApprovalComment;

    beforeEach(inject(function ($injector) {
      commentCollector = $injector.get('commentCollector');
      isCommentNotApprovalComment = $injector.get('isCommentNotApprovalComment');
    }));

    it('Should return false', function () {
      spyOn(commentCollector, 'getApproveComments').and.returnValue({
        commentIsApprovalComment: true
      });
      expect(isCommentNotApprovalComment('commentIsApprovalComment')).toBe(false);
    });

    it('Should return true', function () {
      spyOn(commentCollector, 'getApproveComments').and.returnValue({
        commentIsNotApprovalComment: false
      });
      expect(isCommentNotApprovalComment('commentIsNotApprovalComment')).toBe(true);
    });

    it('Should return true', function () {
      spyOn(commentCollector, 'getApproveComments').and.returnValue({
        commentIsApprovalComment: true
      });
      expect(isCommentNotApprovalComment('commentIsNotApprovalComment')).toBe(true);
    });
  });

  describe('.isCommentApprovalCommentFromUser', function () {

    var commentCollector, isCommentApprovalCommentFromUser;

    beforeEach(inject(function ($injector) {
      commentCollector = $injector.get('commentCollector');
      isCommentApprovalCommentFromUser = $injector.get('isCommentApprovalCommentFromUser');
    }));

    it('Should return false comment is approval comment but user is not approver', function () {
      spyOn(commentCollector, 'getApproveComments').and.returnValue({
        commentIsApprovalComment: true
      });
      expect(isCommentApprovalCommentFromUser({
        id: 'isCommentApprovalCommentFromUser',
        user: {
          login: 'ms'
        }
      }, {
        login: 'karl'
      })).toBe(false);
    });

    it('Should return false comment is not approval comment and user is not approver', function () {
      spyOn(commentCollector, 'getApproveComments').and.returnValue({
        commentIsNotApprovalComment: false
      });
      expect(isCommentApprovalCommentFromUser({
        id: 'notApprovalComment',
        user: {
          login: 'ms'
        }
      }, {
        login: 'karl'
      })).toBe(false);
    });

    it('Should return false comment is not approval comment but user is approver', function () {
      spyOn(commentCollector, 'getApproveComments').and.returnValue({
        commentIsApprovalComment: true
      });
      expect(isCommentApprovalCommentFromUser({
        id: 'commentIsNotApprovalComment',
        user: {
          login: 'ms'
        }
      }, {
        login: 'ms'
      })).toBe(false);
    });

    it('Should return true comment is approval comment and user is approver', function () {
      spyOn(commentCollector, 'getApproveComments').and.returnValue({
        commentIsApprovalComment: true
      });
      expect(isCommentApprovalCommentFromUser({
        id: 'commentIsApprovalComment',
        user: {
          login: 'ms'
        }
      }, {
        login: 'ms'
      })).toBe(true);
    });
  });

  describe('.approveCommit', function(){
    var $q, $rootScope, approveCommit, commentCollector, githubUserData, github;

    beforeEach(inject(function ($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      approveCommit = $injector.get('approveCommit');
      commentCollector = $injector.get('commentCollector');
      githubUserData = $injector.get('githubUserData');
      github = $injector.get('github');
    }));

    it('Should resolve', function(done){

      spyOn(githubUserData, 'get').and.returnValue($q.when({login: 'TestAuthor'}));
      spyOn(commentCollector, 'addApprovalComment');
      spyOn(github.repos, 'createCommitComment');

      approveCommit('sha', 'user', 'repo')
        .then(function(){
          expect(githubUserData.get).toHaveBeenCalled();
          expect(commentCollector.addApprovalComment).toHaveBeenCalledWith('sha', 'commentId');
          done();
        });


      $rootScope.$apply();

      var callback = github.repos.createCommitComment.calls.argsFor(0)[1];
      callback(null, {id: 'commentId'});

      $rootScope.$apply();
    });

    it('Should reject if github throws error', function(done){

      spyOn(githubUserData, 'get').and.returnValue($q.when({login: 'TestAuthor'}));
      spyOn(commentCollector, 'addApprovalComment');
      spyOn(github.repos, 'createCommitComment');

      approveCommit('sha', 'user', 'repo')
        .then(null, function(){
          expect(githubUserData.get).toHaveBeenCalled();
          expect(commentCollector.addApprovalComment).not.toHaveBeenCalled();
          done();
        });


      $rootScope.$apply();

      var callback = github.repos.createCommitComment.calls.argsFor(0)[1];
      callback({});

      $rootScope.$apply();
    });

  });

  describe('.unapproveCommit', function(){
    var $q, $rootScope, unapproveCommit, commentCollector, github;

    beforeEach(inject(function ($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      unapproveCommit = $injector.get('unapproveCommit');
      commentCollector = $injector.get('commentCollector');
      github = $injector.get('github');
    }));

    it('Should resolve', function(done){

      spyOn(commentCollector, 'removeApprovalComment');
      spyOn(github.repos, 'deleteCommitComment');

      unapproveCommit('commentId', 'sha', 'user', 'repo')
        .then(function(){
          expect(commentCollector.removeApprovalComment).toHaveBeenCalledWith('sha');
          done();
        });


      $rootScope.$apply();

      var callback = github.repos.deleteCommitComment.calls.argsFor(0)[1];
      callback(null, {});

      $rootScope.$apply();
    });

    it('Should reject if github throws error', function(done){

      spyOn(commentCollector, 'removeApprovalComment');
      spyOn(github.repos, 'deleteCommitComment');

      unapproveCommit('commitId', 'sha', 'user', 'repo')
        .then(null, function(){
          expect(commentCollector.removeApprovalComment).not.toHaveBeenCalled();
          done();
        });


      $rootScope.$apply();

      var callback = github.repos.deleteCommitComment.calls.argsFor(0)[1];
      callback({});

      $rootScope.$apply();
    });

  });


});