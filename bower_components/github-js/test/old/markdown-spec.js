/*global define, describe, it, beforeEach, expect*/
(function () {
    'use strict';
    describe('[markdown]', function () {
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
            github.markdown.render(
                {
                    text: 'Hello world github/linguist#1 **cool**, and #1!',
                    mode: 'gfm',
                    context: 'github/gollem'
                },
                function (err, res) {
                    expect(err).toBeNull();
                    expect(res.data).toBe('<p>Hello world <a href=\"https://github.com/github/linguist/issues/1\" class=\"issue-link\" title=\"Binary detection issues on extensionless files\">github/linguist#1</a> <strong>cool</strong>, and #1!</p>');
                    done();
                }
            );
        });
    });
}());

