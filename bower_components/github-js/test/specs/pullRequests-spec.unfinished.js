(function () {
    'use strict';

    describe('pullRequests', function () {
        var github;
        var token = '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad';

        beforeEach(function () {
            github = new Github();
            client.authenticate({
                type: 'oauth',
                token: token
            });
        });

        it('should successfully execute GET /repos/:user/:repo/pulls (getAll)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.pullRequests.getAll(
                {
                    user: 'String',
                    repo: 'String',
                    state: 'String',
                    page: 'Number',
                    per_page: 'Number',
                    sort: 'String',
                    direction: 'String'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/pulls/:number (get)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.pullRequests.get(
                {
                    user: 'String',
                    repo: 'String',
                    number: 'Number'
                },
                callback
            );
        });

        it('should successfully execute POST /repos/:user/:repo/pulls (create)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.pullRequests.create(
                {
                    user: 'String',
                    repo: 'String',
                    title: 'String',
                    body: 'String',
                    base: 'String',
                    head: 'String'
                },
                callback
            );
        });

        it('should successfully execute POST /repos/:user/:repo/pulls (createFromIssue)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.pullRequests.createFromIssue(
                {
                    user: 'String',
                    repo: 'String',
                    issue: 'Number',
                    base: 'String',
                    head: 'String'
                },
                callback
            );
        });

        it('should successfully execute PATCH /repos/:user/:repo/pulls/:number (update)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.pullRequests.update(
                {
                    user: 'String',
                    repo: 'String',
                    number: 'Number',
                    state: 'String',
                    title: 'String',
                    body: 'String'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/pulls/:number/commits (getCommits)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.pullRequests.getCommits(
                {
                    user: 'String',
                    repo: 'String',
                    number: 'Number',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/pulls/:number/files (getFiles)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.pullRequests.getFiles(
                {
                    user: 'String',
                    repo: 'String',
                    number: 'Number',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/pulls/:number/merge (getMerged)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.pullRequests.getMerged(
                {
                    user: 'String',
                    repo: 'String',
                    number: 'Number',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute PUT /repos/:user/:repo/pulls/:number/merge (merge)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.pullRequests.merge(
                {
                    user: 'String',
                    repo: 'String',
                    number: 'Number',
                    commit_message: 'String'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/pulls/:number/comments (getComments)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.pullRequests.getComments(
                {
                    user: 'String',
                    repo: 'String',
                    number: 'Number',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/pulls/comments/:number (getComment)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.pullRequests.getComment(
                {
                    user: 'String',
                    repo: 'String',
                    number: 'Number'
                },
                callback
            );
        });

        it('should successfully execute POST /repos/:user/:repo/pulls/:number/comments (createComment)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.pullRequests.createComment(
                {
                    user: 'String',
                    repo: 'String',
                    number: 'Number',
                    body: 'String',
                    commit_id: 'String',
                    path: 'String',
                    position: 'Number'
                },
                callback
            );
        });

        it('should successfully execute POST /repos/:user/:repo/pulls/:number/comments (createCommentReply)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.pullRequests.createCommentReply(
                {
                    user: 'String',
                    repo: 'String',
                    number: 'Number',
                    body: 'String',
                    in_reply_to: 'Number'
                },
                callback
            );
        });

        it('should successfully execute PATCH /repos/:user/:repo/pulls/comments/:number (updateComment)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.pullRequests.updateComment(
                {
                    user: 'String',
                    repo: 'String',
                    number: 'Number',
                    body: 'String'
                },
                callback
            );
        });

        it('should successfully execute DELETE /repos/:user/:repo/pulls/comments/:number (deleteComment)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.pullRequests.deleteComment(
                {
                    user: 'String',
                    repo: 'String',
                    number: 'Number'
                },
                callback
            );
        });


    });
}());
