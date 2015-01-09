(function () {
    'use strict';

    describe('authorization', function () {
        var github;
        var token = '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad';

        beforeEach(function () {
            github = new Github();
            client.authenticate({
                type: 'oauth',
                token: token
            });
        });

        it('should successfully execute GET /authorizations (getAll)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.authorization.getAll(
                {
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /authorizations/:id (get)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.authorization.get(
                {
                    id: 'String'
                },
                callback
            );
        });

        it('should successfully execute POST /authorizations (create)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.authorization.create(
                {
                    scopes: 'Array',
                    note: 'String',
                    note_url: 'String'
                },
                callback
            );
        });

        it('should successfully execute PATCH /authorizations/:id (update)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.authorization.update(
                {
                    id: 'String',
                    scopes: 'Array',
                    add_scopes: 'Array',
                    remove_scopes: 'Array',
                    note: 'String',
                    note_url: 'String'
                },
                callback
            );
        });

        it('should successfully execute DELETE /authorizations/:id (delete)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.authorization.delete(
                {
                    id: 'String'
                },
                callback
            );
        });


    });
}());
