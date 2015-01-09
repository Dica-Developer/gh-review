(function () {
    'use strict';

    describe('orgs', function () {
        var github;
        var token = '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad';

        beforeEach(function () {
            github = new Github();
            client.authenticate({
                type: 'oauth',
                token: token
            });
        });

        it('should successfully execute GET /users/:user/orgs (getFromUser)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.orgs.getFromUser(
                {
                    user: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /orgs/:org (get)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.orgs.get(
                {
                    org: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute PATCH /orgs/:org (update)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.orgs.update(
                {
                    org: 'String',
                    billing_email: 'String',
                    company: 'String',
                    email: 'String',
                    location: 'String',
                    name: 'String'
                },
                callback
            );
        });

        it('should successfully execute GET /orgs/:org/members (getMembers)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.orgs.getMembers(
                {
                    org: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /orgs/:org/members/:user (getMember)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.orgs.getMember(
                {
                    org: 'String',
                    user: 'String'
                },
                callback
            );
        });

        it('should successfully execute DELETE /orgs/:org/members/:user (removeMember)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.orgs.removeMember(
                {
                    org: 'String',
                    user: 'String'
                },
                callback
            );
        });

        it('should successfully execute GET /orgs/:org/public_members (getPublicMembers)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.orgs.getPublicMembers(
                {
                    org: 'String'
                },
                callback
            );
        });

        it('should successfully execute GET /orgs/:org/public_members/:user (getPublicMember)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.orgs.getPublicMember(
                {
                    org: 'String',
                    user: 'String'
                },
                callback
            );
        });

        it('should successfully execute PUT /orgs/:org/public_members/:user (publicizeMembership)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.orgs.publicizeMembership(
                {
                    org: 'String',
                    user: 'String'
                },
                callback
            );
        });

        it('should successfully execute DELETE /orgs/:org/public_members/:user (concealMembership)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.orgs.concealMembership(
                {
                    org: 'String',
                    user: 'String'
                },
                callback
            );
        });

        it('should successfully execute GET /orgs/:org/teams (getTeams)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.orgs.getTeams(
                {
                    org: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /teams/:id (getTeam)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.orgs.getTeam(
                {
                    id: 'String'
                },
                callback
            );
        });

        it('should successfully execute POST /orgs/:org/teams (createTeam)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.orgs.createTeam(
                {
                    org: 'String',
                    name: 'String',
                    repo_names: 'Array',
                    permission: 'String'
                },
                callback
            );
        });

        it('should successfully execute PATCH /teams/:id (updateTeam)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.orgs.updateTeam(
                {
                    id: 'String',
                    name: 'String',
                    permission: 'String'
                },
                callback
            );
        });

        it('should successfully execute DELETE /teams/:id (deleteTeam)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.orgs.deleteTeam(
                {
                    id: 'String'
                },
                callback
            );
        });

        it('should successfully execute GET /teams/:id/members (getTeamMembers)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.orgs.getTeamMembers(
                {
                    id: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /teams/:id/members/:user (getTeamMember)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.orgs.getTeamMember(
                {
                    id: 'String',
                    user: 'String'
                },
                callback
            );
        });

        it('should successfully execute PUT /teams/:id/members/:user (addTeamMember)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.orgs.addTeamMember(
                {
                    id: 'String',
                    user: 'String'
                },
                callback
            );
        });

        it('should successfully execute DELETE /teams/:id/members/:user (deleteTeamMember)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.orgs.deleteTeamMember(
                {
                    id: 'String',
                    user: 'String'
                },
                callback
            );
        });

        it('should successfully execute GET /teams/:id/repos (getTeamRepos)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.orgs.getTeamRepos(
                {
                    id: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /teams/:id/repos/:user/:repo (getTeamRepo)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.orgs.getTeamRepo(
                {
                    id: 'String',
                    user: 'String',
                    repo: 'String'
                },
                callback
            );
        });

        it('should successfully execute PUT /teams/:id/repos/:user/:repo (addTeamRepo)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.orgs.addTeamRepo(
                {
                    id: 'String',
                    user: 'String',
                    repo: 'String'
                },
                callback
            );
        });

        it('should successfully execute DELETE /teams/:id/repos/:user/:repo (deleteTeamRepo)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.orgs.deleteTeamRepo(
                {
                    id: 'String',
                    user: 'String',
                    repo: 'String'
                },
                callback
            );
        });


    });
}());
