(function () {
    'use strict';

    describe('gitdata', function () {
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
                    expect(res.object.sha).toBe('d3b6073e7716d159b45595b8ee0f577d5d3661f1');
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
                    expect(ref.object.sha).toBe('d3b6073e7716d159b45595b8ee0f577d5d3661f1');
                    done();
                }
            );
        });

        it('should successfully execute POST /repos/:user/:repo/git/refs (createReference)', function (done) {
            github.gitdata.createReference(
                {
                    user: 'jwebertest',
                    repo: 'forTestUseOnly',
                    ref: 'refs/heads/createReferenceTest',
                    sha: 'd3b6073e7716d159b45595b8ee0f577d5d3661f1'
                },
                function (err, res) {
                    expect(err).toBeNull();
                    expect(res.ref).toBe('refs/heads/createReferenceTest');
                    expect(res.object.sha).toBe('d3b6073e7716d159b45595b8ee0f577d5d3661f1');
                    github.gitdata.deleteReference(
                        {
                            user: 'jwebertest',
                            repo: 'forTestUseOnly',
                            ref: 'heads/createReferenceTest'
                        },
                        function (err) {
                            expect(err).toBeNull();
                            done();
                        }
                    );
                }
            );
        });

        xit('should successfully execute PATCH /repos/:user/:repo/git/refs/:ref (updateReference)', function (done) {
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

        xit('should successfully execute DELETE /repos/:user/:repo/git/refs/:ref (deleteReference)', function (done) {
            github.gitdata.createReference(
                {
                    user: 'jwebertest',
                    repo: 'forTestUseOnly',
                    ref: 'heads/tagliatelle',
                    sha: '17e0734295ffd8174f91f04ba8e8f8e51954b793'
                },
                function (err, res) {
                    Assert.equal(err, null);

                    // other assertions go here
                    github.gitdata.deleteReference(
                        {
                            user: 'jwebertest',
                            repo: 'forTestUseOnly',
                            ref: 'heads/tagliatelle'
                        },
                        function (err, res) {
                            Assert.equal(err, null);
                            // other assertions go here
                            done();
                        }
                    );
                }
            );
        });

        it('should successfully execute GET /repos/:user/:repo/git/tags/:sha (getTag)', function (done) {
            github.gitdata.createTag(
                {
                    user: 'jwebertest',
                    repo: 'forTestUseOnly',
                    tag: 'test-pasta',
                    message: 'Grandma\'s secret sauce',
                    object: 'master',
                    type: 'commit',
                    tagger: {
                        name: 'test-chef',
                        email: 'test-chef@pasta-nirvana.it',
                        date: '2008-07-09T16:13:30+12:00'
                    }
                },
                function (err, res) {
                    expect(err).toBeNull();
                    var sha = res.sha;

                    github.gitdata.getTag(
                        {
                            user: 'jwebertest',
                            repo: 'forTestUseOnly',
                            sha: sha
                        },
                        function (err, res) {
                            expect(err).toBeNull();
                            expect(res.tag).toBe('test-pasta');
                            expect(res.message).toBe('Grandma\'s secret sauce');
                            expect(res.sha).toBe(sha);
                            expect(res.tagger.name).toBe('test-chef');
                            expect(res.tagger.email).toBe('test-chef@pasta-nirvana.it');
                            done();
                        }
                    );
                }
            );
        });

        it('should successfully execute POST /repos/:user/:repo/git/tags (createTag)', function (done) {
            github.gitdata.createTag(
                {
                    user: 'jwebertest',
                    repo: 'forTestUseOnly',
                    tag: 'test-pasta',
                    message: 'Grandma\'s secret sauce',
                    object: 'master',
                    type: 'commit',
                    tagger: {
                        name: 'test-chef',
                        email: 'test-chef@pasta-nirvana.it',
                        date: '2008-07-09T16:13:30+12:00'
                    }
                },
                function (err, res) {
                    expect(err).toBeNull();
                    expect(res.tag).toBe('test-pasta');
                    expect(res.message).toBe('Grandma\'s secret sauce');
                    expect(res.tagger.name).toBe('test-chef');
                    expect(res.tagger.email).toBe('test-chef@pasta-nirvana.it');
                    done();
                }
            );
        });

        it('should successfully execute GET /repos/:user/:repo/git/trees/:sha (getTree)', function (done) {
            github.gitdata.getTree(
                {
                    user: 'jwebertest',
                    repo: 'forTestUseOnly',
                    sha: 'd3b6073e7716d159b45595b8ee0f577d5d3661f1',
                    recursive: false
                },
                function (err, res) {
                    expect(err).toBeNull();
                    expect(res.tree.length).toBeGreaterThan(1);
                    expect(res.tree[0].type).toBe('blob');
                    expect(res.tree[0].path).toBe('README.md');
                    expect(res.tree[0].sha).toBe('146f1f36d75aabe528bcca418d866c301ac73cd5');
                    expect(res.tree[0].mode).toBe('100644');
                    expect(res.tree[0].size).toBe(30);
                    done();
                }
            );
        });

        it('should successfully execute POST /repos/:user/:repo/git/trees (createTree)', function (done) {
            github.gitdata.getTree(
                {
                    user: 'jwebertest',
                    repo: 'forTestUseOnly',
                    sha: 'd3b6073e7716d159b45595b8ee0f577d5d3661f1',
                    recursive: false
                },
                function (err, res) {
                    expect(err).toBeNull();
                    var file = res.tree[0];

                    github.gitdata.createTree(
                        {
                            base_tree: 'd3b6073e7716d159b45595b8ee0f577d5d3661f1',
                            user: 'jwebertest',
                            repo: 'forTestUseOnly',
                            tree: [
                                {
                                    path: file.path,
                                    mode: '100755',
                                    type: file.type,
                                    sha: file.sha
                                }
                            ]
                        },
                        function (err, res) {
                            expect(err).toBeNull();
                            var sha = res.sha;

                            github.gitdata.getTree(
                                {
                                    user: 'jwebertest',
                                    repo: 'forTestUseOnly',
                                    sha: sha,
                                    recursive: true
                                },
                                function (err, res) {
                                    expect(err).toBeNull();
                                    expect(res.tree[0].type).toBe('blob');
                                    expect(res.tree[0].path).toBe('README.md');
                                    expect(res.tree[0].sha).toBe('146f1f36d75aabe528bcca418d866c301ac73cd5');
                                    expect(res.tree[0].mode).toBe('100755');
                                    expect(res.tree[0].size).toBe(30);

                                    done();
                                }
                            );
                        }
                    );
                }
            );
        });
    });

    xdescribe('gitdata failure', function () {
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
}());
