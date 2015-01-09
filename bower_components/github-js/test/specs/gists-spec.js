/*global describe, beforeEach, it, expect, xit*/
(function () {
    'use strict';

    var gistTmpl = {
        description: 'Another bowl of pasta',
        public: 'false',
        files: {
            'ravioli.js': {
                'content': 'alert("want some ketchup with that?");'
            }
        }
    };
    
    describe('gists', function () {
        var github;
        var token = '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad';

        beforeEach(function () {
            github = new Github();
            github.authenticate({
                type: 'oauth',
                token: token
            });
        });

        it('should successfully execute GET /gists (getAll)', function (done) {
            github.gists.getAll({},
                function (err, res) {
                    expect(err).toBeNull();
                    expect(res.length).toBe(1);
                    var gist = res.pop();
                    expect(gist.owner.login).toBe('jwebertest');
                    expect(gist.html_url).toBe('https://gist.github.com/1e2f2c21e78106c2cd14');
                    expect(gist.created_at).toBe('2014-03-15T17:44:40Z');
                    expect(gist.public).toBeFalsy();
                    expect(gist.id).toBe('1e2f2c21e78106c2cd14');

                    done();
                }
            );
        });

        it('should successfully execute GET /users/:user/gists (getFromUser)', function (done) {
            github.gists.getFromUser({ user: 'jwebertest' },
                function (err, res) {
                    expect(err).toBeNull();
                    expect(res.length).toBe(1);
                    var gist = res.pop();
                    expect(gist.owner.login).toBe('jwebertest');
                    expect(gist.html_url).toBe('https://gist.github.com/1e2f2c21e78106c2cd14');
                    expect(gist.created_at).toBe('2014-03-15T17:44:40Z');
                    expect(gist.public).toBeFalsy();
                    expect(gist.id).toBe('1e2f2c21e78106c2cd14');
                    done();
                }
            );
        });

        it('should successfully execute POST /gists (create)', function (done) {
            var id;

            function gistGetClbk(err, res) {
                expect(err).toBeNull();
                expect(res.owner.login).toBe('jwebertest');
                expect(res.html_url).toBe('https://gist.github.com/' + id);
                expect(res.public).toBeFalsy();
                expect(res.id).toBe(id);
                expect(res.description).toBe('Another bowl of pasta');

                github.gists.delete({ id: id },
                    function (err) {
                        expect(err).toBeNull();
                        done();
                    }
                );
            }

            function gistCreateCbk(err, res) {
                expect(err).toBeNull();
                id = res.id;
                github.gists.get({ id: id }, gistGetClbk);
            }

            github.gists.create(gistTmpl, gistCreateCbk);
        });

        xit('should successfully execute PATCH /gists/:id (edit)', function (done) {
            var id;

            function gistEditClbk(err) {
                expect(err).toBeNull();

                github.gists.get({ id: id },
                    function (err, res) {
                        expect(err).toBeNull();
                        expect(res.owner.login).toBe('jwebertest');
                        expect(res.html_url).toBe('https://gist.github.com/' + id);
                        expect(res.public).toBeFalsy();
                        expect(res.id).toBe(id);
                        expect(res.description).toBe('changed');
                        expect(res.files['ravioli.js'].content).toBe('alert("no ketchup, please.");');

                        github.gists.delete({ id: id },
                            function (err) {
                                expect(err).toBeNull();
                                done();
                            }
                        );
                    }
                );
            }

            function gistCreateClbk(err, res) {
                expect(err).toBeNull();
                id = res.id;
                github.gists.edit(
                    {
                        id: id,
                        description: 'changed',
                        files: {
                            'ravioli.js': {
                                'content': 'alert("no ketchup, please.");'
                            }
                        }
                    }, gistEditClbk);
            }

            github.gists.create(gistTmpl, gistCreateClbk);
        });

        xit('should successfully execute GET /gists/public (public)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.gists.public(
                {
                    since: 'Date'
                },
                callback
            );
        });

        it('should successfully execute GET /gists/starred (starred)', function (done) {
            github.gists.starred(
                {},
                function (err, res) {
                    expect(err).toBeNull();
                    expect(res.length).toBe(1);
                    var gist = res.pop();
                    expect(gist.owner.login).toBe('jwebertest');
                    expect(gist.html_url).toBe('https://gist.github.com/1e2f2c21e78106c2cd14');
                    expect(gist.created_at).toBe('2014-03-15T17:44:40Z');
                    expect(gist.public).toBeFalsy();
                    expect(gist.id).toBe('1e2f2c21e78106c2cd14');
                    done();
                }
            );
        });

        it('should successfully execute GET /gists/:id (get)', function (done) {
            var id;

            function gistCreateClbk(err, res) {
                expect(err).toBeNull();
                id = res.id;

                github.gists.get({ id: id },
                    function (err, res) {
                        expect(err).toBeNull();
                        expect(res.owner.login).toBe('jwebertest');
                        expect(res.html_url).toBe('https://gist.github.com/' + id);
                        expect(res.public).toBeFalsy();
                        expect(res.id).toBe(id);
                        expect(res.description).toBe('Another bowl of pasta');

                        github.gists.delete({ id: id },
                            function (err) {
                                expect(err).toBeNull();
                                done();
                            }
                        );
                    }
                );
            }

            github.gists.create(gistTmpl, gistCreateClbk);
        });

        it('should successfully execute PUT /gists/:id/star (star)', function (done) {
            var id;

            function gistStarClbk(err) {
                expect(err).toBeNull();
                github.gists.checkStar({ id: id },
                    function (err) {
                        expect(err).toBeNull();
                        //TODO: NO RESULT HERE???

                        github.gists.delete({ id: id },
                            function (err) {
                                expect(err).toBeNull();
                                done();
                            }
                        );
                    }
                );
            }

            function gistCreateClbk(err, res) {
                expect(err).toBeNull();
                id = res.id;
                github.gists.star({ id: id }, gistStarClbk);
            }

            github.gists.create(gistTmpl, gistCreateClbk);
        });

        it('should successfully execute DELETE /gists/:id/star (deleteStar)', function (done) {
            var id;

            function gistCreateClbk(err, res) {
                expect(err).toBeNull();
                id = res.id;

                github.gists.star({ id: id },
                    function (err) {
                        expect(err).toBeNull();
                        github.gists.deleteStar({ id: id },
                            function (err) {
                                expect(err).toBeNull();
                                github.gists.delete({ id: id },
                                    function (err) {
                                        expect(err).toBeNull();
                                        done();
                                    }
                                );
                            }
                        );
                    }
                );
            }

            github.gists.create(gistTmpl, gistCreateClbk);
        });

        it('should successfully execute GET /gists/:id/star (checkStar)', function (done) {
            github.gists.create(gistTmpl,
                function (err, res) {
                    expect(err).toBeNull();
                    var id = res.id;

                    github.gists.star({ id: id },
                        function (err) {
                            expect(err).toBeNull();

                            github.gists.delete({ id: id },
                                function (err) {
                                    expect(err).toBeNull();
                                    done();
                                }
                            );
                        }
                    );
                }
            );
        });

        it('should successfully execute POST /gists/:id/fork (fork)', function (done) {
            github.gists.fork({ id: '3047099' },
                function (err, res) {
                    expect(err).toBeNull();
                    var id = res.id;

                    expect(res.git_pull_url).toBe('https://gist.github.com/' + id + '.git');
                    expect(res.git_push_url).toBe('https://gist.github.com/' + id + '.git');
                    expect(res.description).toBe('Why to call resume() after next()');
                    expect(typeof res.files['resume_after_next.md']).toBe('object');

                    github.gists.delete({ id: id },
                        function (err) {
                            expect(err).toBeNull();
                            done();
                        }
                    );
                }
            );
        });

        it('should successfully execute DELETE /gists/:id (delete)', function (done) {
            github.gists.create(gistTmpl,
                function (err, res) {
                    expect(err).toBeNull();
                    var id = res.id;

                    github.gists.delete({ id: id },
                        function (err) {
                            expect(err).toBeNull();
                            done();
                        }
                    );
                }
            );
        });

        it('should successfully execute GET /gists/:gist_id/comments (getComments)', function (done) {
            github.gists.createComment(
                {
                    gist_id: '1e2f2c21e78106c2cd14',
                    body: 'This is a test comment.'
                },
                function (err, res) {
                    expect(err).toBeNull();
                    var id = res.id;

                    github.gists.getComments({ gist_id: '1e2f2c21e78106c2cd14' },
                        function (err, res) {
                            expect(err).toBeNull();
                            expect(res.length).toBeGreaterThan(0);

                            github.gists.deleteComment(
                                {
                                    gist_id: '1e2f2c21e78106c2cd14',
                                    id: id
                                },
                                function (err) {
                                    expect(err).toBeNull();
                                    done();
                                }
                            );
                        }
                    );
                }
            );
        });

        it('should successfully execute GET /gists/:gist_id/comments/:id (getComment)', function (done) {
            github.gists.createComment(
                {
                    gist_id: '1e2f2c21e78106c2cd14',
                    body: 'This is a test comment.'
                },
                function (err, res) {
                    expect(err).toBeNull();
                    var id = res.id;

                    github.gists.getComment(
                        {
                            gist_id: '1e2f2c21e78106c2cd14',
                            id: id
                        },
                        function (err, res) {
                            expect(err).toBeNull();
                            expect(res.user.login).toBe('jwebertest');
                            expect(res.id).toBe(id);
                            expect(res.body).toBe('This is a test comment.');

                            github.gists.deleteComment(
                                {
                                    gist_id: '1e2f2c21e78106c2cd14',
                                    id: id
                                },
                                function (err) {
                                    expect(err).toBeNull();
                                    done();
                                }
                            );
                        }
                    );
                }
            );
        });

        it('should successfully execute POST /gists/:gist_id/comments (createComment)', function (done) {
            github.gists.createComment(
                {
                    gist_id: '1e2f2c21e78106c2cd14',
                    body: 'This is a test comment.'
                },
                function (err, res) {
                    expect(err).toBeNull();
                    var id = res.id;

                    github.gists.getComment(
                        {
                            gist_id: '1e2f2c21e78106c2cd14',
                            id: id
                        },
                        function (err, res) {
                            expect(err).toBeNull();
                            expect(res.user.login).toBe('jwebertest');
                            expect(res.id).toBe(id);
                            expect(res.body).toBe('This is a test comment.');

                            github.gists.deleteComment(
                                {
                                    gist_id: '1e2f2c21e78106c2cd14',
                                    id: id
                                },
                                function (err) {
                                    expect(err).toBeNull();
                                    done();
                                }
                            );
                        }
                    );
                }
            );
        });

        it('should successfully execute PATCH /gists/:gist_id/comments/:id (editComment)', function (done) {
            github.gists.createComment(
                {
                    gist_id: '1e2f2c21e78106c2cd14',
                    body: 'This is a test comment.'
                },
                function (err, res) {
                    expect(err).toBeNull();
                    var id = res.id;

                    github.gists.editComment(
                        {
                            gist_id: '1e2f2c21e78106c2cd14',
                            id: id,
                            body: 'This comment has been edited.'
                        },
                        function (err, res) {
                            expect(err).toBeNull();
                            var id = res.id;
                            github.gists.getComment(
                                {
                                    gist_id: '1e2f2c21e78106c2cd14',
                                    id: id
                                },
                                function (err, res) {
                                    expect(err).toBeNull();
                                    expect(res.id).toBe(id);
                                    expect(res.body).toBe('This comment has been edited.');

                                    github.gists.deleteComment(
                                        {
                                            gist_id: '1e2f2c21e78106c2cd14',
                                            id: id
                                        },
                                        function (err) {
                                            expect(err).toBeNull();
                                            done();
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            );
        });

        it('should successfully execute DELETE /gists/:gist_id/comments/:id (deleteComment)', function (done) {
            github.gists.createComment(
                {
                    gist_id: '1e2f2c21e78106c2cd14',
                    body: 'This is a test comment.'
                },
                function (err, res) {
                    expect(err).toBeNull();
                    var id = res.id;

                    github.gists.deleteComment(
                        {
                            gist_id: '1e2f2c21e78106c2cd14',
                            id: id
                        },
                        function (err) {
                            expect(err).toBeNull();
                            done();
                        }
                    );
                }
            );
        });

    });

    describe('gists failure', function () {
        var github;

        beforeEach(function () {
            github = new Github();
        });

        it('should successfully execute POST /gists/:gist_id/comments (createComment)', function (done) {
            github.gists.createComment(
                {
                    gist_id: '1e2f2c21e78106c2cd14',
                    body: 'This is a test comment.'
                },
                function (err) {
                    expect(err).not.toBeNull();
                    done();
                }
            );
        });
    });
}());
