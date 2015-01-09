(function () {
    'use strict';

    describe('releases', function () {
        var github;
        var token = '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad';

        beforeEach(function () {
            github = new Github();
            client.authenticate({
                type: 'oauth',
                token: token
            });
        });

        it('should successfully execute GET /repos/:owner/:repo/releases (listReleases)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.releases.listReleases(
                {
                    owner: 'String',
                    repo: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:owner/:repo/releases/:id (getRelease)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.releases.getRelease(
                {
                    owner: 'String',
                    id: 'Number',
                    repo: 'String'
                },
                callback
            );
        });

        it('should successfully execute POST /repos/:owner/:repo/releases (createRelease)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.releases.createRelease(
                {
                    owner: 'String',
                    repo: 'String',
                    tag_name: 'String',
                    target_commitish: 'String',
                    name: 'String',
                    body: 'String',
                    draft: 'Boolean',
                    prerelease: 'Boolean'
                },
                callback
            );
        });

        it('should successfully execute PATCH /repos/:owner/:repo/releases/:id (editRelease)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.releases.editRelease(
                {
                    owner: 'String',
                    id: 'Number',
                    repo: 'String',
                    tag_name: 'String',
                    target_commitish: 'String',
                    name: 'String',
                    body: 'String',
                    draft: 'Boolean',
                    prerelease: 'Boolean'
                },
                callback
            );
        });

        it('should successfully execute DELETE /repos/:owner/:repo/releases/:id (deleteRelease)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.releases.deleteRelease(
                {
                    owner: 'String',
                    id: 'Number',
                    repo: 'String'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:owner/:repo/releases/:id/assets (listAssets)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.releases.listAssets(
                {
                    owner: 'String',
                    id: 'Number',
                    repo: 'String'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:owner/:repo/releases/assets/:id (getAsset)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.releases.getAsset(
                {
                    owner: 'String',
                    id: 'Number',
                    repo: 'String'
                },
                callback
            );
        });

        it('should successfully execute PATCH /repos/:owner/:repo/releases/assets/:id (editAsset)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.releases.editAsset(
                {
                    owner: 'String',
                    id: 'Number',
                    repo: 'String',
                    name: 'String',
                    label: 'String'
                },
                callback
            );
        });

        it('should successfully execute DELETE /repos/:owner/:repo/releases/assets/:id (deleteAsset)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.releases.deleteAsset(
                {
                    owner: 'String',
                    id: 'Number',
                    repo: 'String'
                },
                callback
            );
        });


    });
}());
