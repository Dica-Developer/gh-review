/*global describe, beforeEach, it, expect, xit*/
(function () {
    'use strict';

    describe('gitignore', function () {
        var github;
        var token = '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad';

        beforeEach(function () {
            github = new Github();
            github.authenticate({
                type: 'oauth',
                token: token
            });
        });

        it('should successfully execute GET /gitignore/templates (templates)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                expect(res.length).toBeGreaterThan(0);
                done();
            };

            github.gitignore.templates(
                {},
                callback
            );
        });

        it('should successfully execute GET /gitignore/templates/:name (template)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                expect(res.name).toBe('Java');
                done();
            };

            github.gitignore.template(
                {
                    name: 'Java'
                },
                callback
            );
        });


    });
}());
