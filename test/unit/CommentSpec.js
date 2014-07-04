define([
    'angular',
    'angularMocks',
    'app'
], function (angular, mocks) {
    'use strict';

    /*jshint camelcase:false*/
    var commentData = {
        mode: 'test',
        body_html: '<p>Line comment test</p>',
        body: 'Line comment test body',
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


    describe('#Comment', function () {
        var Comment;

        beforeEach(mocks.inject(function ($injector) {
            Comment = $injector.get('Comment');
        }));

        it('Should be defined', function () {
            expect(Comment).toBeDefined();
        });

        describe('.save', function () {
            var github, $rootScope;

            beforeEach(mocks.inject(function ($injector) {
                github = $injector.get('github');
                $rootScope = $injector.get('$rootScope');
            }));


            it('Should call github.repos.createCommitComment', function () {
                var comment = new Comment(commentData);
                var expectedCallArgs = {
                    user: commentData.editInformations.user,
                    repo: commentData.editInformations.repo,
                    sha: commentData.sha,
                    body: commentData.content,
                    path: commentData.path,
                    position: commentData.position,
                    line: commentData.line
                };
                var githubSpy = spyOn(github.repos, 'createCommitComment');
                comment.save();
                expect(githubSpy.calls.argsFor(0)[0]).toEqual(expectedCallArgs);
            });

            it('Should set comment.mode to "show" and $rootScope.$apply', function () {
                var comment = new Comment(commentData);
                var githubSpy = spyOn(github.repos, 'createCommitComment');
                var scopeSpy = spyOn($rootScope, '$apply');
                comment.save();
                var callback = githubSpy.calls.argsFor(0)[1];
                callback(null, {});
                expect(scopeSpy).toHaveBeenCalled();
                expect(comment.mode).toBe('show');
            });
        });

        describe('.preview', function () {
            var github, $rootScope;

            beforeEach(mocks.inject(function ($injector) {
                github = $injector.get('github');
                $rootScope = $injector.get('$rootScope');
            }));


            it('Should call github.markdown.render', function () {
                var comment = new Comment(commentData);
                var expectedCallArgs = {
                    text : commentData.content,
                    mode : 'gfm'
                };
                var githubSpy = spyOn(github.markdown, 'render');
                comment.preview();
                expect(githubSpy.calls.argsFor(0)[0]).toEqual(expectedCallArgs);
            });

            it('Should set comment.mode to "preview" comment.previewHtml to resp.data and $rootScope.$apply', function () {
                var comment = new Comment(commentData);
                var githubSpy = spyOn(github.markdown, 'render');
                var scopeSpy = spyOn($rootScope, '$apply');
                comment.preview();
                var callback = githubSpy.calls.argsFor(0)[1];
                callback(null, {data: '<p>Test</p>'});
                expect(scopeSpy).toHaveBeenCalled();
                expect(comment.mode).toBe('preview');
                expect(comment.previewHtml).toBe('<p>Test</p>');
            });
        });

        describe('.edit', function () {
            var github, $rootScope;

            beforeEach(mocks.inject(function ($injector) {
                github = $injector.get('github');
                $rootScope = $injector.get('$rootScope');
            }));


            it('Should call github.repos.getCommitComment', function () {
                var comment = new Comment(commentData);
                var expectedCallArgs = {
                    user : commentData.editInformations.user,
                    repo : commentData.editInformations.repo,
                    id : commentData.id
                };
                var githubSpy = spyOn(github.repos, 'getCommitComment');
                comment.edit();
                expect(githubSpy.calls.argsFor(0)[0]).toEqual(expectedCallArgs);
            });

            it('Should set comment.mode to "edit" comment.content to resp.body and $rootScope.$apply', function () {
                var comment = new Comment(commentData);
                var githubSpy = spyOn(github.repos, 'getCommitComment');
                var scopeSpy = spyOn($rootScope, '$apply');
                comment.edit();
                var callback = githubSpy.calls.argsFor(0)[1];
                callback(null, {body: 'Test'});
                expect(scopeSpy).toHaveBeenCalled();
                expect(comment.mode).toBe('edit');
                expect(comment.content).toBe('Test');
            });
        });

        describe('.remove', function () {
            var github, $rootScope;

            beforeEach(mocks.inject(function ($injector) {
                github = $injector.get('github');
                $rootScope = $injector.get('$rootScope');
            }));


            it('Should call github.repos.deleteCommitComment', function () {
                var comment = new Comment(commentData);
                var expectedCallArgs = {
                    user : commentData.editInformations.user,
                    repo : commentData.editInformations.repo,
                    id : commentData.id
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
                callback(null, {body: 'Test'});
                expect(scopeSpy).toHaveBeenCalled();
                expect(comment.mode).toBe('edit');
                expect(comment.content).toBe('Test');
            });
        });

        describe('.saveChanges', function () {
            var github, $rootScope;

            beforeEach(mocks.inject(function ($injector) {
                github = $injector.get('github');
                $rootScope = $injector.get('$rootScope');
            }));


            it('Should call github.repos.updateCommitComment', function () {
                var comment = new Comment(commentData);
                var expectedCallArgs = {
                    user : commentData.editInformations.user,
                    repo : commentData.editInformations.repo,
                    id : commentData.id,
                    body: commentData.content
                };
                var githubSpy = spyOn(github.repos, 'updateCommitComment');
                comment.saveChanges();
                expect(githubSpy.calls.argsFor(0)[0]).toEqual(expectedCallArgs);
            });

            xit('Should set comment.mode to "edit" comment.content to resp.body and $rootScope.$apply', function () {
                var comment = new Comment(commentData);
                var githubSpy = spyOn(github.repos, 'getCommitComment');
                var scopeSpy = spyOn($rootScope, '$apply');
                comment.edit();
                var callback = githubSpy.calls.argsFor(0)[1];
                callback(null, {body: 'Test'});
                expect(scopeSpy).toHaveBeenCalled();
                expect(comment.mode).toBe('edit');
                expect(comment.content).toBe('Test');
            });
        });

    });
});