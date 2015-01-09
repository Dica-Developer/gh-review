(function () {
    'use strict';

    describe('markdown', function () {
        var github;
        var token = '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad';

        beforeEach(function () {
            github = new Github();
            github.authenticate({
                type: 'oauth',
                token: token
            });
        });

        it('should successfully execute POST /markdown (render)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                expect(res.data).toBeDefined();
                done();
            };

            github.markdown.render(
                {
                    "text": "Hello world github/linguist#1 **cool**, and #1!",
                    "mode": "gfm",
                    "context": "jwebertest/forTestUseOnly"
                },
                callback
            );
        });


    });
}());
