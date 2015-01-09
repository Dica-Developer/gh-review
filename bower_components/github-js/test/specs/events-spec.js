/*global describe, beforeEach, it, expect, xit*/
(function () {
    'use strict';

    describe('events', function () {
        var github;
        var token = '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad';

        beforeEach(function () {
            github = new Github();
            github.authenticate({
                type: 'oauth',
                token: token
            });
        });

        it('should successfully execute GET /events (get)', function (done) {
            function callback(err, res) {
                expect(err).toBeNull();
                expect(res.length).toBeGreaterThan(1);
                var res0 = res[0];
                expect(typeof res0.type).toBe('string');
                expect(typeof res0.created_at).toBe('string');
                expect(typeof res0.public).toBe('boolean');
                expect(typeof res0.id).toBe('string');
                expect('actor' in res0).toBeTruthy();
                expect('actor' in res0).toBeTruthy();
                done();
            }

            github.events.get({ page: 1, per_page: 30 }, callback);
        });

        it('should successfully execute GET /repos/:user/:repo/events (getFromRepo)', function (done) {
            function callback(err, res) {
                expect(err).toBeNull();
                expect(res.length).toBe(1);
                var last = res.pop();
                expect(last.type).toBe('CreateEvent');
                expect(last.created_at).toBe('2014-03-16T01:37:42Z');
                expect(last.id).toBe('2017326039');
                expect(last.public).toBeTruthy();
                expect(last.actor.login).toBe('jwebertest');
                expect(last.repo.name).toBe('jwebertest/gh-review');
                done();
            }

            github.events.getFromRepo({
                user: 'jwebertest',
                repo: 'gh-review'
            }, callback);
        });

        it('should successfully execute GET /repos/:user/:repo/issues/events (getFromRepoIssues)', function (done) {
            function callback(err, res) {
                expect(err).toBeNull();
                expect(res.length).toBeGreaterThan(1);
                var last = res.pop();
                expect(last.event).toBe('closed');
                expect(last.created_at).toBe('2014-03-15T00:40:10Z');
                expect(last.id).toBe(102261965);
                expect(last.actor.login).toBe('jwebertest');
                expect(last.issue.title).toBe('Create Event');
                expect(last.issue.number).toBe(1);
                expect(last.issue.state).toBe('closed');
                done();
            }

            github.events.getFromRepoIssues({
                user: 'jwebertest',
                repo: 'forTestUseOnly'
            }, callback);
        });

        it('should successfully execute GET /networks/:user/:repo/events (getFromRepoNetwork)', function (done) {
            function callback(err, res) {
                expect(err).toBeNull();
//                expect(res.length).toBe(5);
                var last = res.pop();
                expect(typeof last.id).toBe('string');
                expect(typeof last.created_at).toBe('string');
                expect(typeof last.actor).toBe('object');
                done();
            }

            github.events.getFromRepoNetwork({
                user: 'jwebertest',
                repo: 'forTestUseOnly'
            }, callback);
        });

        it('should successfully execute GET /users/:user/received_events/public (getReceivedPublic)', function (done) {
            function callback(err, res) {
                expect(err).toBeNull();
                expect(res.length).toBeGreaterThan(0);
                done();
            }

            github.events.getReceivedPublic({ user: 'jwebertest' }, callback);
        });

        it('should successfully execute GET /orgs/:org/events (getFromOrg)', function (done) {
            function callback(err, res) {
                expect(err).toBeNull();
                expect(res.length).toBe(30); //30 = default page length
                var last = res.pop();
                expect(typeof last.id).toBe('string');
                expect(typeof last.created_at).toBe('string');
                expect(typeof last.actor).toBe('object');
                done();
            }

            github.events.getFromOrg({ org: 'dica-developer' }, callback);
        });

        it('should successfully execute GET /users/:user/received_events (getReceived)', function (done) {
            function callback(err, res) {
                expect(err).toBeNull();
                expect(res.length).toBeGreaterThan(0);
                done();
            }

            github.events.getReceived({ user: 'jwebertest' }, callback);
        });



        it('should successfully execute GET /users/:user/events (getFromUser)', function (done) {
            function callback(err, res) {
                expect(err).toBeNull();
                expect(res.length).toBeGreaterThan(1);
                var last = res.pop();
                expect(typeof last.id).toBe('string');
                expect(typeof last.created_at).toBe('string');
                expect(typeof last.actor).toBe('object');
                done();
            }

            github.events.getFromUser({ user: 'jwebertest' }, callback);
        });

        it('should successfully execute GET /users/:user/events/public (getFromUserPublic)', function (done) {
            function callback(err, res) {
                expect(err).toBeNull();
                expect(res.length).toBeGreaterThan(1);
                var last = res.pop();
                expect(typeof last.id).toBe('string');
                expect(typeof last.created_at).toBe('string');
                expect(typeof last.actor).toBe('object');
                done();
            }

            github.events.getFromUserPublic({ user: 'jwebertest' }, callback);
        });

        it('should successfully execute GET /users/:user/events/orgs/:org (getFromUserOrg)', function (done) {
            function callback(err) {
                // we're not logged in as `jweber` right now, so github API does not allow
                // us to see the resource.
                expect(err.code).toBe(404);
                done();
            }

            github.events.getFromUserOrg({
                user: 'jweber',
                org: 'dica-developer'
            }, callback);
        });
    });
}());
