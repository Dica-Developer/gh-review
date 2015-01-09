(function () {
    'use strict';

    describe('statuses', function () {
        var github;
        var token = '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad';

        beforeEach(function () {
            github = new Github();
            client.authenticate({
                type: 'oauth',
                token: token
            });
        });

        it('should successfully execute GET /repos/:user/:repo/statuses/:sha (get)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.statuses.get(
                {
                    user: 'String',
                    repo: 'String',
                    sha: 'String'
                },
                callback
            );
        });

        it('should successfully execute POST /repos/:user/:repo/statuses/:sha (create)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.statuses.create(
                {
                    user: 'String',
                    repo: 'String',
                    sha: 'String',
                    state: 'String',
                    target_url: 'String',
                    description: 'String'
                },
                callback
            );
        });


    });
}());
