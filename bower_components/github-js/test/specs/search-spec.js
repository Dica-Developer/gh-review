(function () {
    'use strict';

    describe('search', function () {
        var github;
        var token = '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad';

        beforeEach(function () {
            github = new Github();
            github.authenticate({
                type: 'oauth',
                token: token
            });
        });

        it('should successfully execute GET /search/issues (issues)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                expect(res.items.length).toBeGreaterThan(0);
                done();
            };

            github.search.issues(
                {
                    q: 'repo:dica-developer/gh-review',
                    sort: 'created',
                    order: 'asc'
                },
                callback
            );
        });

        it('should successfully execute GET /search/repositories (repos)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                expect(res.items.length).toBeGreaterThan(0);
                done();
            };

            github.search.repos(
                {
                    q: 'gh-review'
                },
                callback
            );
        });

        it('should successfully execute GET /search/users (users)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                expect(res.items.length).toBe(1);
                done();
            };

            github.search.users(
                {
                    q: 'jwebertest'
                },
                callback
            );
        });

        it('should successfully execute GET /search/code (code)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                expect(res.items.length).toBeGreaterThan(0);
                done();
            };

            github.search.code(
                {
                    q: 'Events repo:dica-developer/gh-review'
                },
                callback
            );
        });

        xit('should successfully execute GET /legacy/user/email/:email (email)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.search.email(
                {
                    email: 'horus381@gmx.de'
                },
                callback
            );
        });


    });
}());
