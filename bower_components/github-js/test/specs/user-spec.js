(function () {
    'use strict';

    describe('user', function () {
        var github;
        var token = '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad';
        var sshKey = 'ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAm8TLnlXY+M+FtTEV4crIXpB/AX25jBODpUkIFFokGvIdU1sI4USTwDYX1vOMTQ9o8PFKgj+L2jeTkj0B+lh8Gnl8MF60eMu1Zfadedba6ENF8Ci01EFwtQIFMhKHjgj3f5LNyeDJXV5HAP+JVdwfvk+US+wbjUnBfCcGrr1C7wXB1yeGwd0YV5XSG9jOOt0g9L/DoZQ9XIzckpMed0YrR7rYFqxVoRMkkpsPOZyYLj5bmncZw8J5dD+8g8RPB/viRpvk6xPODbp/hW8A64qb4lJZDYevufyzAGI+pj9U1EAEYjmeJbn6eJbPveL+/jIT/xylcDoPGq0a6lE6L+JyXQ== horus381@gmx.de';

        beforeEach(function () {
            github = new Github();
            github.authenticate({
                type: 'oauth',
                token: token
            });
        });

        it('should successfully execute GET /users/:user (getFrom)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                expect(res.login).toBe('JayGray');
                done();
            };

            github.user.getFrom(
                {
                    user: 'JayGray'
                },
                callback
            );
        });

        it('should successfully execute GET /user (get)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                expect(res.login).toBe('jwebertest');
                done();
            };

            github.user.get(
                {},
                callback
            );
        });

        xit('should successfully execute PATCH /user (update)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.user.update(
                {
                    name: 'String',
                    email: 'String',
                    blog: 'String',
                    company: 'String',
                    location: 'String',
                    hireable: 'Boolean',
                    bio: 'String'
                },
                callback
            );
        });

        it('should successfully execute GET /user/orgs (getOrgs)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                expect(res.length).toBe(0);
                done();
            };

            github.user.getOrgs({},
                callback
            );
        });

        it('should successfully execute GET /user/teams (getTeams)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                expect(res.length).toBe(0);
                done();
            };

            github.user.getTeams({},
                callback
            );
        });

        it('should successfully execute GET /user/emails (getEmails)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                expect(res.length).toBe(1);
                expect(res[0].verified).toBe(true);
                done();
            };

            github.user.getEmails({},
                callback
            );
        });

        xit('should successfully execute POST /user/emails (addEmails)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                github.user.deleteEmails(
                    {
                        'email': ['info@dica-developer.org']
                    }, function(err, res){
                        expect(err).toBeNull();
                        done();
                    }
                );
            };

            github.user.addEmails(
                {
                    email: ['info@dica-developer.org']
                },
                callback
            );
        });

        xit('should successfully execute DELETE /user/emails (deleteEmails)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.user.deleteEmails(
                {},
                callback
            );
        });

        it('should successfully execute GET /users/:user/followers (getFollowers)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                expect(res.length).toBeGreaterThan(0);
                done();
            };

            github.user.getFollowers(
                {
                    user: 'JayGray'
                },
                callback
            );
        });

        it('should successfully execute GET /users/:user/following (getFollowingFromUser)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                expect(res.length).toBeGreaterThan(0);
                done();
            };

            github.user.getFollowingFromUser(
                {
                    user: 'JayGray'
                },
                callback
            );
        });

        it('should successfully execute GET /user/following (getFollowing)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.user.getFollowing({},
                callback
            );
        });

        it('should successfully execute GET /user/following/:user (getFollowUser)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.user.getFollowUser(
                {
                    user: 'JayGray'
                },
                callback
            );
        });

        it('should successfully execute PUT /user/following/:user (followUser)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                github.user.getFollowUser(
                    {
                        user: 'mschaaf'
                    },
                    function(err, res){
                        expect(err).toBeNull();
                        github.user.unFollowUser(
                            {
                                user: 'mschaaf'
                            },
                            function(err, res){
                                expect(err).toBeNull();
                                github.user.getFollowUser(
                                    {
                                        user: 'mschaaf'
                                    },
                                    function(err, res){
                                        expect(err).not.toBeNull();
                                        done();
                                    })
                            }
                        );
                    }
                );
            };

            github.user.followUser(
                {
                    user: 'mschaaf'
                },
                callback
            );
        });

        it('should successfully execute DELETE /user/following/:user (unFollowUser)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                github.user.getFollowUser(
                    {
                        user: 'mschaaf'
                    },
                    function(err, res){
                        expect(err).toBeNull();
                        github.user.unFollowUser(
                            {
                                user: 'mschaaf'
                            },
                            function(err, res){
                                expect(err).toBeNull();
                                github.user.getFollowUser(
                                    {
                                        user: 'mschaaf'
                                    },
                                    function(err, res){
                                        expect(err).not.toBeNull();
                                        done();
                                    })
                            }
                        );
                    }
                );
            };

            github.user.followUser(
                {
                    user: 'mschaaf'
                },
                callback
            );
        });

        it('should successfully execute GET /user/keys (getKeys)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.user.getKeys({},
                callback
            );
        });

        it('should successfully execute GET /users/:user/keys (getKeysFromUser)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                expect(res.length).toBeGreaterThan(0);
                done();
            };

            github.user.getKeysFromUser(
                {
                    user: 'JayGray'
                },
                callback
            );
        });

        it('should successfully execute GET /user/keys/:id (getKey)', function (done) {

            var callback = function (err, res) {
                expect(err).toBeNull();
                github.user.getKey(
                    {
                        id: res.id
                    },
                    function(err, res){
                        expect(err).toBeNull();
                        github.user.deleteKey(
                            {
                                id: res.id
                            },
                            function(err, res){
                                expect(err).toBeNull();
                                done();
                            }
                        );
                    }
                );
            };


            github.user.createKey(
                {
                    title: 'Test Key',
                    key: sshKey
                },
                callback
            );
        });

        it('should successfully execute POST /user/keys (createKey)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                github.user.deleteKey(
                    {
                        id: res.id
                    },
                    function(err, res){
                        expect(err).toBeNull();
                        done();
                    }
                );
            };

            github.user.createKey(
                {
                    title: 'Test Key',
                    key: sshKey
                },
                callback
            );
        });

        xit('should successfully execute PATCH /user/keys/:id (updateKey)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.user.updateKey(
                {
                    id: 'String',
                    title: 'String',
                    key: 'String'
                },
                callback
            );
        });

        it('should successfully execute DELETE /user/keys/:id (deleteKey)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                github.user.deleteKey(
                    {
                        id: res.id
                    },
                    function(err, res){
                        expect(err).toBeNull();
                        done();
                    }
                );
            };

            github.user.createKey(
                {
                    title: 'Test Key',
                    key: sshKey
                },
                callback
            );
        });


    });
}());
