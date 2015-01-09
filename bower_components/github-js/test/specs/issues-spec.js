(function () {
    'use strict';

    describe('issues', function () {
        var github;
        var token = '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad';

        beforeEach(function () {
            github = new Github();
            github.authenticate({
                type: 'oauth',
                token: token
            });
        });

        it('should successfully execute GET /issues (getAll)', function (done) {
            github.issues.getAll(
                {
                    filter: 'created',
                    state: 'open',
                    labels: '',
                    sort: 'updated',
                    direction: 'asc'
                },
                function (err, res) {
                    expect(err).toBeNull();
                    expect(res.length).toBeGreaterThan(0);
                    var issue = res.pop();

                    expect(issue.title).toBe('An open ticket for unit tests');
                    expect(issue.number).toBe(2);
                    expect(issue.state).toBe('open');
                    expect(issue.body).toBe('An open ticket for unit tests');
                    expect(issue.assignee.login).toBe('jwebertest');

                    done();
                }
            );
        });

        it('should successfully execute GET /repos/:user/:repo/issues (repoIssues)', function (done) {
            github.issues.repoIssues(
                {
                    user: 'jwebertest',
                    repo: 'forTestUseOnly',
                    state: 'open',
                    sort: 'updated',
                    direction: 'asc'
                },
                function (err, res) {
                    expect(err).toBeNull();
                    expect(res.length).toBeGreaterThan(0);
                    var issue = res.pop();
                    expect(issue.title).toBe('An open ticket for unit tests');
                    expect(issue.number).toBe(2);
                    expect(issue.state).toBe('open');
                    expect(issue.body).toBe('An open ticket for unit tests');
                    expect(issue.assignee.login).toBe('jwebertest');

                    done();
                }
            );
        });

        it('should successfully execute GET /repos/:user/:repo/issues/:number (getRepoIssue)', function (done) {
            github.issues.getRepoIssue(
                {
                    user: 'jwebertest',
                    repo: 'forTestUseOnly',
                    number: 2
                },
                function (err, res) {
                    expect(err).toBeNull();
                    expect(res.title).toBe('An open ticket for unit tests');
                    expect(res.number).toBe(2);
                    expect(res.state).toBe('open');
                    expect(res.body).toBe('An open ticket for unit tests');
                    expect(res.assignee.login).toBe('jwebertest');

                    done();
                }
            );
        });

        xit('should successfully execute POST /repos/:user/:repo/issues (create)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                expect(res.title).toBe('Test generated Issue');
                done();
            };

            github.issues.create(
                {
                    user: 'jwebertest',
                    repo: 'forTestUseOnly',
                    title: 'Test generated Issue',
                    body: 'Test generated Issue',
                    labels: []
                },
                callback
            );
        });

        xit('should successfully execute PATCH /repos/:user/:repo/issues/:number (edit)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.issues.edit(
                {
                    user: 'String',
                    repo: 'String',
                    number: 'Number',
                    title: 'String',
                    body: 'String',
                    assignee: 'String',
                    milestone: 'Number',
                    labels: 'Json',
                    state: 'String'
                },
                callback
            );
        });

        xit('should successfully execute GET /repos/:user/:repo/issues/comments (repoComments)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.issues.repoComments(
                {
                    user: 'String',
                    repo: 'String',
                    sort: 'String',
                    direction: 'String',
                    since: 'Date',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        xit('should successfully execute GET /repos/:user/:repo/issues/:number/comments (getComments)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.issues.getComments(
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

        xit('should successfully execute GET /repos/:user/:repo/issues/comments/:id (getComment)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.issues.getComment(
                {
                    user: 'String',
                    repo: 'String',
                    id: 'String'
                },
                callback
            );
        });

        xit('should successfully execute POST /repos/:user/:repo/issues/:number/comments (createComment)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.issues.createComment(
                {
                    user: 'String',
                    repo: 'String',
                    number: 'Number',
                    body: 'String'
                },
                callback
            );
        });

        xit('should successfully execute PATCH /repos/:user/:repo/issues/comments/:id (editComment)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.issues.editComment(
                {
                    user: 'String',
                    repo: 'String',
                    id: 'String',
                    body: 'String'
                },
                callback
            );
        });

        xit('should successfully execute DELETE /repos/:user/:repo/issues/comments/:id (deleteComment)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.issues.deleteComment(
                {
                    user: 'String',
                    repo: 'String',
                    id: 'String'
                },
                callback
            );
        });

        xit('should successfully execute GET /repos/:user/:repo/issues/:number/events (getEvents)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.issues.getEvents(
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

        xit('should successfully execute GET /repos/:user/:repo/issues/events (getRepoEvents)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.issues.getRepoEvents(
                {
                    user: 'String',
                    repo: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        xit('should successfully execute GET /repos/:user/:repo/issues/events/:id (getEvent)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.issues.getEvent(
                {
                    user: 'String',
                    repo: 'String',
                    id: 'String'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/labels (getLabels)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                expect(res.length).toBeGreaterThan(0);
                done();
            };

            github.issues.getLabels(
                {
                    user: 'jwebertest',
                    repo: 'forTestUseOnly'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/labels/:name (getLabel)', function (done) {

            var callback = function (err, res) {
                expect(err).toBeNull();
                expect(res.name).toBe('TestLabel');

                github.issues.getLabel(
                    {
                        user: 'jwebertest',
                        repo: 'forTestUseOnly',
                        name: 'TestLabel'
                    },
                    function(err, res){
                        expect(err).toBeNull();
                        expect(res.color).toBe('003399');
                        expect(res.name).toBe('TestLabel');

                        github.issues.deleteLabel(
                            {
                                user: 'jwebertest',
                                repo: 'forTestUseOnly',
                                name: 'TestLabel'
                            }, function(){
                                expect(err).toBeNull();
                                done();
                            })

                    }
                );
            };

            github.issues.createLabel(
                {
                    user: 'jwebertest',
                    repo: 'forTestUseOnly',
                    name: 'TestLabel',
                    color: '003399'
                },
                callback
            );
        });

        it('should successfully execute POST /repos/:user/:repo/labels (createLabel)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                expect(res.name).toBe('TestLabel');
                github.issues.deleteLabel(
                    {
                        user: 'jwebertest',
                        repo: 'forTestUseOnly',
                        name: 'TestLabel'
                    }, function(){
                        expect(err).toBeNull();
                        done();
                    })
            };

            github.issues.createLabel(
                {
                    user: 'jwebertest',
                    repo: 'forTestUseOnly',
                    name: 'TestLabel',
                    color: '003399'
                },
                callback
            );
        });

        it('should successfully execute POST /repos/:user/:repo/labels/:name (updateLabel)', function (done) {

            var callback = function (err, res) {
                expect(err).toBeNull();
                expect(res.name).toBe('TestLabel');
                github.issues.updateLabel(
                    {
                        user: 'jwebertest',
                        repo: 'forTestUseOnly',
                        name: 'TestLabel',
                        color: '993300'
                    },
                    function(err, res){
                        expect(err).toBeNull();
                        expect(res.color).toBe('993300');
                        github.issues.deleteLabel(
                            {
                                user: 'jwebertest',
                                repo: 'forTestUseOnly',
                                name: 'TestLabel'
                            }, function(){
                                expect(err).toBeNull();
                                done();
                            })
                    }
                );
            };

            github.issues.createLabel(
                {
                    user: 'jwebertest',
                    repo: 'forTestUseOnly',
                    name: 'TestLabel',
                    color: '003399'
                },
                callback
            );
        });

        it('should successfully execute DELETE /repos/:user/:repo/labels/:name (deleteLabel)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                expect(res.name).toBe('TestLabel');
                github.issues.deleteLabel(
                    {
                        user: 'jwebertest',
                        repo: 'forTestUseOnly',
                        name: 'TestLabel'
                    }, function(){
                        expect(err).toBeNull();
                        done();
                    })
            };

            github.issues.createLabel(
                {
                    user: 'jwebertest',
                    repo: 'forTestUseOnly',
                    name: 'TestLabel',
                    color: '003399'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/issues/:number/labels (getIssueLabels)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                expect(res.length).toBeGreaterThan(0);
                expect(res[0].color).toBe('e6e6e6');
                done();
            };

            github.issues.getIssueLabels(
                {
                    user: 'jwebertest',
                    repo: 'forTestUseOnly',
                    number: 2
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/milestones (getAllMilestones)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                github.issues.getAllMilestones(
                    {
                        user: 'jwebertest',
                        repo: 'forTestUseOnly',
                        state: 'open'
                    },
                    function(err, res){
                        expect(err).toBeNull();
                        expect(res.length).toBeGreaterThan(0);

                        github.issues.deleteMilestone(
                            {
                                user: 'jwebertest',
                                repo: 'forTestUseOnly',
                                number: '1'
                            },
                            function(err, res){
                                expect(err).toBeNull();
                                done();
                            }
                        );
                    }
                );
            };

            github.issues.createMilestone(
                {
                    user: 'jwebertest',
                    repo: 'forTestUseOnly',
                    title: 'v0.1',
                    state: 'open',
                    description: 'Test generated milestone',
                    due_on: '2012-10-09T23:39:01Z'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/milestones/:number (getMilestone)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                github.issues.getMilestone(
                    {
                        user: 'jwebertest',
                        repo: 'forTestUseOnly',
                        number: 1
                    },
                    function(err, res){
                        expect(err).toBeNull();
                        expect(res.title).toBe('v0.1');

                        github.issues.deleteMilestone(
                            {
                                user: 'jwebertest',
                                repo: 'forTestUseOnly',
                                number: '1'
                            },
                            function(err, res){
                                expect(err).toBeNull();
                                done();
                            }
                        );
                    }
                );
            };

            github.issues.createMilestone(
                {
                    user: 'jwebertest',
                    repo: 'forTestUseOnly',
                    title: 'v0.1',
                    state: 'open',
                    description: 'Test generated milestone',
                    due_on: '2012-10-09T23:39:01Z'
                },
                callback
            );
        });

        it('should successfully execute POST /repos/:user/:repo/milestones (createMilestone)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                expect(res.title).toBe('v0.1');
                github.issues.deleteMilestone(
                    {
                        user: 'jwebertest',
                        repo: 'forTestUseOnly',
                        number: '1'
                    },
                    function(err, res){
                        expect(err).toBeNull();
                        done();
                    }
                );
            };

            github.issues.createMilestone(
                {
                    user: 'jwebertest',
                    repo: 'forTestUseOnly',
                    title: 'v0.1',
                    state: 'open',
                    description: 'Test generated milestone',
                    due_on: '2012-10-09T23:39:01Z'
                },
                callback
            );
        });

        //TODO investigate why PATCH requests doesn't work
        xit('should successfully execute PATCH /repos/:user/:repo/milestones/:number (updateMilestone)', function (done) {

            var callback = function (err, res) {
                expect(err).toBeNull();
                github.issues.updateMilestone(
                    {
                        user: 'jwebertest',
                        repo: 'forTestUseOnly',
                        number: '1',
                        title: 'v0.1',
                        state: 'closed'
                    },
                    function(err, res){
                        expect(err).toBeNull();
                        github.issues.deleteMilestone(
                            {
                                user: 'jwebertest',
                                repo: 'forTestUseOnly',
                                number: '1'
                            },
                            function(err, res){
                                expect(err).toBeNull();
                                done();
                            }
                        );
                    }
                );
            };

            github.issues.createMilestone(
                {
                    user: 'jwebertest',
                    repo: 'forTestUseOnly',
                    title: 'v0.1',
                    state: 'open',
                    description: 'Test generated milestone',
                    due_on: '2012-10-09T23:39:01Z'
                },
                callback
            );
        });

        it('should successfully execute DELETE /repos/:user/:repo/milestones/:number (deleteMilestone)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                github.issues.deleteMilestone(
                    {
                        user: 'jwebertest',
                        repo: 'forTestUseOnly',
                        number: '1'
                    },
                    function(err, res){
                        expect(err).toBeNull();
                        done();
                    }
                );
            };

            github.issues.createMilestone(
                {
                    user: 'jwebertest',
                    repo: 'forTestUseOnly',
                    title: 'v0.1',
                    state: 'open',
                    description: 'Test generated milestone',
                    due_on: '2012-10-09T23:39:01Z'
                },
                callback
            );
        });


    });
}());
