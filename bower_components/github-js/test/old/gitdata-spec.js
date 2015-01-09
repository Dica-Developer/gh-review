/*global define, describe, it, beforeEach, expect*/
(function () {
    'use strict';

    describe('[gitdata]', function () {
        var github;
        var token = '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad';

        beforeEach(function () {
            github = new Github();
            github.authenticate({
                type: 'oauth',
                token: token
            });
        });

        it('should successfully execute GET /repos/:user/:repo/git/blobs/:sha (getBlob)', function (done) {
            // found an object after executing:
            // git rev-list --all | xargs -l1 git diff-tree -r -c -M -C --no-commit-id | awk '{print $3}'
            // [jweber] me too ;-)
            github.gitdata.getBlob(
                {
                    user: 'jwebertest',
                    repo: 'gh-review',
                    sha: '815df25137544e76c442ffdddecb163ff5a456d8'
                },
                function (err, res) {
                    expect(err).toBeNull();
                    expect(res.sha).toBe('815df25137544e76c442ffdddecb163ff5a456d8');
                    expect(res.size).toBe(625);
                    expect(res.encoding).toBe('base64');

                    done();
                }
            );
        });

        it('should successfully execute POST /repos/:user/:repo/git/blobs (createBlob)', function (done) {
            function blobCreateClbk(err, res) {
                expect(err).toBeNull();
                expect(typeof res.sha).toBe('string');
                var sha = res.sha;

                github.gitdata.getBlob(
                    {
                        user: 'jwebertest',
                        repo: 'forTestUseOnly',
                        sha: sha
                    },
                    function (err, res) {
                        expect(err).toBeNull();
                        expect(res.sha).toBe(sha);
                        expect(res.size).toBe(4);
                        expect(res.encoding).toBe('base64');

                        done();
                    }
                );
            }

            github.gitdata.createBlob(
                {
                    user: 'jwebertest',
                    repo: 'forTestUseOnly',
                    content: 'test',
                    encoding: 'utf-8'
                }, blobCreateClbk);
        });

        it('should successfully execute GET /repos/:user/:repo/git/commits/:sha (getCommit)', function (done) {
            github.gitdata.getCommit(
                {
                    user: 'jwebertest',
                    repo: 'gh-review',
                    sha: 'fe537378e0b98a84b9111d62075c8dec5eb7f9e3'
                },
                function (err, res) {
                    expect(err).toBeNull();
                    expect(res.author.date).toBe('2014-02-25T20:46:14Z');
                    expect(res.author.name).toBe('Martin Schaaf');
                    expect(res.parents[0].sha).toBe('a17255ac8a770357cf9e8e817c786397b27b61b1');
                    done();
                }
            );
        });

        it('should successfully execute POST /repos/:user/:repo/git/commits (createCommit)', function (done) {
            // got valid tree reference by executing
            // git cat-file -p HEAD
            github.gitdata.createCommit(
                {
                    user: 'jwebertest',
                    repo: 'gh-review',
                    message: 'test',
                    tree: 'dcd0340f5e51ebe14be2486bc0a398dbff545069',
                    parents: [],
                    author: {
                        name: 'test-chef',
                        email: 'test-chef@pasta-nirvana.it',
                        date: '2008-07-09T16:13:30+12:00'
                    },
                    committer: {
                        name: 'test-minion',
                        email: 'test-minion@pasta-nirvana.it',
                        date: '2008-07-09T16:13:30+12:00'
                    }
                },
                function (err, res) {
                    expect(err).toBeNull();
                    expect(res.author.name).toBe('test-chef');
                    expect(res.author.email).toBe('test-chef@pasta-nirvana.it');
                    expect(res.committer.name).toBe('test-minion');
                    expect(res.committer.email).toBe('test-minion@pasta-nirvana.it');
                    expect(res.message).toBe('test');
                    done();
                }
            );
        });

        it('should successfully execute GET /repos/:user/:repo/git/refs/:ref (getReference)', function (done) {
            github.gitdata.getReference(
                {
                    user: 'jwebertest',
                    repo: 'forTestUseOnly',
                    ref: 'heads/master'
                },
                function (err, res) {
                    expect(err).toBeNull();
                    expect(res.ref).toBe('refs/heads/master');
                    expect(res.object.type).toBe('commit');
                    expect(res.object.sha).toBe('9e635bc0a7348d1df04dbb5a8fd6e0a6fb90fee5');
                    done();
                }
            );
        });

        it('should successfully execute GET /repos/:user/:repo/git/refs (getAllReferences)', function (done) {
            github.gitdata.getAllReferences(
                {
                    user: 'jwebertest',
                    repo: 'forTestUseOnly'
                },
                function (err, res) {
                    expect(err).toBeNull();
                    var ref = res.pop();
                    expect(ref.ref).toBe('refs/heads/master');
                    expect(ref.object.type).toBe('commit');
                    expect(ref.object.sha).toBe('9e635bc0a7348d1df04dbb5a8fd6e0a6fb90fee5');
                    done();
                }
            );
        });

        it('should successfully execute POST /repos/:user/:repo/git/refs (createReference)', function (done) {
            github.gitdata.createReference(
                {
                    user: 'jwebertest',
                    repo: 'forTestUseOnly',
                    ref: 'refs/heads/anotherTest1',
                    sha: '9e635bc0a7348d1df04dbb5a8fd6e0a6fb90fee5'
                },
                function (err, res) {
                    expect(err).toBeNull();
                    expect(res.ref).toBe('refs/heads/anotherTest1');
                    expect(res.object.sha).toBe('9e635bc0a7348d1df04dbb5a8fd6e0a6fb90fee5');
                    github.gitdata.deleteReference(
                        {
                            user: 'jwebertest',
                            repo: 'forTestUseOnly',
                            ref: 'heads/anotherTest1'
                        },
                        function (err) {
                            expect(err).toBeNull();
                            done();
                        }
                    );
                }
            );
        });

        xit('should successfully execute PATCH /repos/:user/:repo/git/refs/:ref (updateReference)', function (next) {
            var sha;

            function updateReferenceClbk(err, res) {
                expect(err).toBeNull();
                expect(res.ref).toBe('refs/heads/master');
                expect(res.object.type).toBe('commit');
                expect(res.object.sha).toBe('9e635bc0a7348d1df04dbb5a8fd6e0a6fb90fee5');

                github.gitdata.updateReference(
                    {
                        user: 'jwebertest',
                        repo: 'forTestUseOnly',
                        ref: 'heads/master',
                        sha: sha,
                        force: false
                    },
                    function (err, res) {
                        expect(err).toBeNull();
                        expect(err, null);
                        expect(res.ref).toBe('refs/heads/master');
                        expect(res.object.type).toBe('commit');
                        expect(res.object.sha).toBe(sha);

                        next();
                    }
                );
            }

            function getReferenceClbk(err, res) {
                console.log(JSON.stringify(res, null, 3));
                expect(err).toBeNull();
                sha = res.object.sha;

                // do `force=true` because we go backward in history, which yields a warning
                // that it's not a reference that can be fast-forwarded to.
                github.gitdata.updateReference(
                    {
                        user: 'jwebertest',
                        repo: 'forTestUseOnly',
                        ref: 'heads/master',
                        sha: '9e635bc0a7348d1df04dbb5a8fd6e0a6fb90fee5',
                        force: true
                    }, updateReferenceClbk);
            }

            github.gitdata.getReference(
                {
                    user: 'jwebertest',
                    repo: 'forTestUseOnly',
                    ref: 'refs/heads/master'
                }, getReferenceClbk);

        });
//        /*
//         DISABLED temporarily due to Internal Server Error from Github!
//
//         it('should successfully execute DELETE /repos/:user/:repo/git/refs/:ref (deleteReference)',  function(next) {
//         client.gitdata.createReference(
//         {
//         user: 'jwebertest',
//         repo: 'forTestUseOnly',
//         ref: 'heads/tagliatelle',
//         sha: '17e0734295ffd8174f91f04ba8e8f8e51954b793'
//         },
//         function(err, res) {
//         Assert.equal(err, null);
//         console.log(res);
//
//         // other assertions go here
//         client.gitdata.deleteReference(
//         {
//         user: 'jwebertest',
//         repo: 'forTestUseOnly',
//         ref: 'heads/tagliatelle'
//         },
//         function(err, res) {
//         Assert.equal(err, null);
//         // other assertions go here
//         next();
//         }
//         );
//         }
//         );
//         });*/
//
//        it('should successfully execute GET /repos/:user/:repo/git/tags/:sha (getTag)', function (next) {
//            client.gitdata.createTag(
//                {
//                    user: 'jwebertest',
//                    repo: 'forTestUseOnly',
//                    tag: 'test-pasta',
//                    message: 'Grandma's secret sauce',
//                    object: '17e0734295ffd8174f91f04ba8e8f8e51954b793',
//                    type: 'commit',
//                    tagger: {
//                        name: 'test-chef',
//                        email: 'test-chef@pasta-nirvana.it',
//                        date: '2008-07-09T16:13:30+12:00'
//                    }
//                },
//                function (err, res) {
//                    Assert.equal(err, null);
//                    var sha = res.sha;
//
//                    client.gitdata.getTag(
//                        {
//                            user: 'jwebertest',
//                            repo: 'forTestUseOnly',
//                            sha: sha
//                        },
//                        function (err, res) {
//                            Assert.equal(err, null);
//                            Assert.equal(res.tag, 'test-pasta');
//                            Assert.equal(res.message, 'Grandma's secret sauce');
//                            Assert.equal(res.sha, sha);
//                            Assert.equal(res.tagger.name, 'test-chef');
//                            Assert.equal(res.tagger.email, 'test-chef@pasta-nirvana.it');
//
//                            // other assertions go here
//                            client.gitdata.deleteReference(
//                                {
//                                    user: 'jwebertest',
//                                    repo: 'forTestUseOnly',
//                                    ref: 'tags/' + sha
//                                },
//                                function (err, res) {
//                                    //Assert.equal(err, null);
//                                    // NOTE: Github return 'Validation Failed' error codes back, which makes no sense to me.
//                                    // ask the guys what's up here...
//                                    Assert.equal(err.code, 422);
//
//                                    next();
//                                }
//                            );
//                        }
//                    );
//                }
//            );
//        });
//
//        it('should successfully execute POST /repos/:user/:repo/git/tags (createTag)', function (next) {
//            client.gitdata.createTag(
//                {
//                    user: 'jwebertest',
//                    repo: 'forTestUseOnly',
//                    tag: 'test-pasta',
//                    message: 'Grandma's secret sauce',
//                    object: '17e0734295ffd8174f91f04ba8e8f8e51954b793',
//                    type: 'commit',
//                    tagger: {
//                        name: 'test-chef',
//                        email: 'test-chef@pasta-nirvana.it',
//                        date: '2008-07-09T16:13:30+12:00'
//                    }
//                },
//                function (err, res) {
//                    Assert.equal(err, null);
//                    var sha = res.sha;
//
//                    client.gitdata.getTag(
//                        {
//                            user: 'jwebertest',
//                            repo: 'forTestUseOnly',
//                            sha: sha
//                        },
//                        function (err, res) {
//                            Assert.equal(err, null);
//                            Assert.equal(res.tag, 'test-pasta');
//                            Assert.equal(res.message, 'Grandma's secret sauce');
//                            Assert.equal(res.sha, sha);
//                            Assert.equal(res.tagger.name, 'test-chef');
//                            Assert.equal(res.tagger.email, 'test-chef@pasta-nirvana.it');
//
//                            // other assertions go here
//                            client.gitdata.deleteReference(
//                                {
//                                    user: 'jwebertest',
//                                    repo: 'forTestUseOnly',
//                                    ref: 'tags/' + sha
//                                },
//                                function (err, res) {
//                                    //Assert.equal(err, null);
//                                    // NOTE: Github return 'Validation Failed' error codes back, which makes no sense to me.
//                                    // ask the guys what's up here...
//                                    Assert.equal(err.code, 422);
//
//                                    next();
//                                }
//                            );
//                        }
//                    );
//                }
//            );
//        });
//
//        it('should successfully execute GET /repos/:user/:repo/git/trees/:sha (getTree)', function (next) {
//            client.gitdata.getTree(
//                {
//                    user: 'jwebertest',
//                    repo: 'forTestUseOnly',
//                    sha: '8ce4393a319b60bc6179509e0c46dee83c179f9f',
//                    recursive: false
//                },
//                function (err, res) {
//                    Assert.equal(err, null);
//                    Assert.equal(res.tree[0].type, 'blob');
//                    Assert.equal(res.tree[0].path, 'LICENSE-MIT');
//                    Assert.equal(res.tree[0].sha, 'f30a31de94635399f42fd05f91f6ed3ff2f013d6');
//                    Assert.equal(res.tree[0].mode, '100644');
//                    Assert.equal(res.tree[0].size, 1075);
//
//                    client.gitdata.getTree(
//                        {
//                            user: 'jwebertest',
//                            repo: 'forTestUseOnly',
//                            sha: '8ce4393a319b60bc6179509e0c46dee83c179f9f',
//                            recursive: true
//                        },
//                        function (err, res) {
//                            Assert.equal(err, null);
//                            Assert.equal(res.tree[0].type, 'blob');
//                            Assert.equal(res.tree[0].path, 'LICENSE-MIT');
//                            Assert.equal(res.tree[0].sha, 'f30a31de94635399f42fd05f91f6ed3ff2f013d6');
//                            Assert.equal(res.tree[0].mode, '100644');
//                            Assert.equal(res.tree[0].size, 1075);
//
//                            next();
//                        }
//                    );
//                }
//            );
//        });
//
//        it('should successfully execute POST /repos/:user/:repo/git/trees (createTree)', function (next) {
//            client.gitdata.getTree(
//                {
//                    user: 'jwebertest',
//                    repo: 'forTestUseOnly',
//                    sha: '8ce4393a319b60bc6179509e0c46dee83c179f9f',
//                    recursive: false
//                },
//                function (err, res) {
//                    Assert.equal(err, null);
//                    var file = res.tree[0];
//
//                    client.gitdata.createTree(
//                        {
//                            base_tree: '8ce4393a319b60bc6179509e0c46dee83c179f9f',
//                            user: 'jwebertest',
//                            repo: 'forTestUseOnly',
//                            tree: [
//                                {
//                                    path: file.path,
//                                    mode: '100755',
//                                    type: file.type,
//                                    sha: file.sha
//                                }
//                            ]
//                        },
//                        function (err, res) {
//                            Assert.equal(err, null);
//                            var sha = res.sha;
//
//                            client.gitdata.getTree(
//                                {
//                                    user: 'jwebertest',
//                                    repo: 'forTestUseOnly',
//                                    sha: sha,
//                                    recursive: true
//                                },
//                                function (err, res) {
//                                    Assert.equal(err, null);
//                                    Assert.equal(res.tree[0].type, 'blob');
//                                    Assert.equal(res.tree[0].path, 'LICENSE-MIT');
//                                    Assert.equal(res.tree[0].sha, 'f30a31de94635399f42fd05f91f6ed3ff2f013d6');
//                                    Assert.equal(res.tree[0].mode, '100755');
//                                    Assert.equal(res.tree[0].size, 1075);
//
//                                    next();
//                                }
//                            );
//                        }
//                    );
//                }
//            );
//        });
    });

    describe('[gitdata] failure', function () {
        var github;

        beforeEach(function () {
            github = new Github();
        });

        it('should successfully execute POST /repos/:user/:repo/git/blobs (createBlob)', function (done) {
            function blobCreateClbk(err) {
                expect(err).not.toBeNull();
                done();
            }

            github.gitdata.createBlob(
                {
                    user: 'jwebertest',
                    repo: 'forTestUseOnly',
                    content: 'test',
                    encoding: 'utf-8'
                }, blobCreateClbk);
        });
    });
}())