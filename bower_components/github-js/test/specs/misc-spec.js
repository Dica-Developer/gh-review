(function () {
    'use strict';

    describe('misc', function () {
        var github;
        var token = '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad';

        beforeEach(function () {
            github = new Github();
            github.authenticate({
                type: 'oauth',
                token: token
            });
        });

        it('should successfully execute GET /emojis (emojis)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.misc.emojis(
                {},
                callback
            );
        });

        it('should successfully execute GET /meta (meta)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.misc.meta(
                {},
                callback
            );
        });

        it('should successfully execute GET /rate_limit (rateLimit)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.misc.rateLimit(
                {},
                callback
            );
        });


    });
}());
