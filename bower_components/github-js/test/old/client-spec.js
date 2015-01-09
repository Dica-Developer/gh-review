/*global define, xdescribe, it, expect, beforeEach*/

(function(){
    'use strict';

    /*
    disabled because phantomjs do not provide all response headers returned by github
    eg. missing link header which is used to determine hasNextPage ...
     */
    xdescribe('[client]', function () {
        var client;

        beforeEach(function () {
            client = new Client();
        });

        it('should successfully execute GET /authorizations (getAll)', function (done) {
            // `aseemk` has two pages of followers right now.
            function callback(err, res) {
                var hasNextPage = client.hasNextPage(res);
                var hasLastPage = client.hasLastPage(res);
                var hasPreviousPage = client.hasPreviousPage(res);
                expect(err).toBeNull();
                expect(hasNextPage).toBeTruthy();
                expect(hasLastPage).toBeTruthy();
                expect(hasPreviousPage).toBeFalsy();
                done();
//                Assert.equal(err, null);
//
//                Assert.ok(!!client.hasNextPage(res));
//                Assert.ok(!!client.hasLastPage(res));
//                Assert.ok(!client.hasPreviousPage(res));
//
//                client.getNextPage(res, function (err, res) {
//                    Assert.equal(err, null);
//
//                    Assert.ok(!!client.hasPreviousPage(res));
//                    Assert.ok(!!client.hasFirstPage(res));
//                    Assert.ok(!client.hasNextPage(res));
//                    Assert.ok(!client.hasLastPage(res));
//
//                    client.getPreviousPage(res.meta.link, function (err, res) {
//                        Assert.equal(err, null);
//
//                        Assert.ok(!!client.hasNextPage(res));
//                        Assert.ok(!!client.hasLastPage(res));
//                        Assert.ok(!client.hasPreviousPage(res));
//                    });
//                });
            }

            client.user.getFollowers({ user: 'aseemk' }, callback);
        });
    });
}());
