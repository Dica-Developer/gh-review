/*global define, describe, it, expect, beforeEach*/
(function () {
    'use strict';
    describe('[search]', function () {
        var github;
        var token = '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad';

        beforeEach(function () {
            github = new Github();
            github.authenticate({
                type: 'oauth',
                token: token
            });
        });

        it('should successfully execute GET /legacy/issues/search/:user/:repo/:state/:keyword (issues)', function (done) {
            github.search.issues(
                {
                    user: 'jwebertest',
                    repo: 'forTestUseOnly',
                    state: 'closed',
                    keyword: 'Event'
                },
                function (err, res) {
                    expect(err).toBeNull();
                    expect(res.issues.length).toBe(1);
                    var issue = res.issues[0];
                    expect(issue.title).toBe('Create Event');
                    expect(issue.position).toBe(1);
                    expect(issue.state).toBe('closed');

                    done();
                }
            );
        });

        it('should successfully execute GET /legacy/repos/search/:keyword (repos)', function (done) {
            github.search.repos(
                {
                    keyword: 'pasta',
                    language: 'JavaScript'
                },
                function (err, res) {
                    expect(err).toBeNull();
                    expect(res.repositories.length).toBeGreaterThan(0);
                    expect(res.repositories[0].language).toBe('JavaScript');

                    done();
                }
            );
        });

        it('should successfully execute GET /legacy/user/search/:keyword (users)', function (done) {
            github.search.users({ keyword: 'mikedeboer' },
                function (err, res) {
                    expect(err).toBeNull();
                    expect(res.users.length).toBe(2);
                    var user = res.users[0];
                    expect(user.name).toBe('Mike de Boer');
                    expect(user.username.indexOf('mikedeboer')).toBe(0);

                    done();
                }
            );
        });

        it('should successfully execute GET /legacy/user/search/code ', function (done) {
            github.search.code({
                    q: 'test repo:dica-developer/gh-review'
                },
                function (err, res) {
                    expect(err).toBeNull();
                    expect(res.items.length).toBe(12);
                    var result = res.items[1];
                    expect(result.name).toBe('dev.karma.conf.js');
                    expect(result.path).toBe('test/dev.karma.conf.js');
                    expect(result.sha).toBe('55a9e77bd5d055bd3513ffcc0ac2b82a438427b3');

                    done();
                }
            );
        });

    });
}());
