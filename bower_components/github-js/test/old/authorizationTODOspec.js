/*global describe, it, expect, beforeEach*/
/*
 * Copyright 2012 Cloud9 IDE, Inc.
 *
 * This product includes software developed by
 * Cloud9 IDE, Inc (http://c9.io).
 *
 * Author: Mike de Boer <info@mikedeboer.nl>
 */

define(['githubjs'], function (Client) {
    'use strict';

    describe('[authorization]', function () {
        var client;
        var token = '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad';

        beforeEach(function () {
            client = new Client();
            client.authenticate({
                type: 'oauth',
                token: token
            });
        });

        it('should successfully execute GET /authorizations (getAll)', function (done) {
            var id;

            function getAllClbk2(err, res) {
                expect(err).toBeNull();
                expect(res.length).toBe(0);
                done();
            }

            function authGetAllClbk(err, res) {
                expect(err).toBeNull();
                expect(res.length).toBe(1);

                client.authorization['delete']({ id: id },
                    function (err) {
                        expect(err).toBeNull();
                        client.authorization.getAll({ page: '1', per_page: '100'}, getAllClbk2);
                    }
                );
            }

            function authCreateClbk(err, res) {
                expect(err).toBeNull();
                id = res.id;
                client.authorization.getAll({ page: '1', per_page: '100' }, authGetAllClbk);
            }

            client.authorization.create(
                {
                    scopes: ['user', 'public_repo', 'repo', 'repo:status', 'delete_repo', 'gist'],
                    note: 'Authorization created to unit tests auth',
                    note_url: 'https://github.com/jwebertest/forTestOnly'
                }, authCreateClbk);
        });

//        it('should successfully execute GET /authorizations/:id (get)', function (next) {
//            client.authorization.create(
//                {
//                    scopes: ['user', 'public_repo', 'repo', 'repo:status', 'delete_repo', 'gist'],
//                    note: 'Authorization created to unit tests auth',
//                    note_url: 'https://github.com/ajaxorg/node-github'
//                },
//                function (err, res) {
//                    Assert.equal(err, null);
//                    var id = res.id;
//
//                    client.authorization.get(
//                        {
//                            id: id
//                        },
//                        function (err, res) {
//                            Assert.equal(err, null);
//                            Assert.equal(res.id, id);
//                            Assert.equal(res.note, 'Authorization created to unit tests auth');
//                            Assert.equal(res.note_url, 'https://github.com/ajaxorg/node-github');
//
//                            client.authorization['delete'](
//                                {
//                                    id: id
//                                },
//                                function (err, res) {
//                                    Assert.equal(err, null);
//
//                                    client.authorization.get(
//                                        {
//                                            id: id
//                                        },
//                                        function (err, res) {
//                                            Assert.equal(err.code, 404);
//                                            next();
//                                        }
//                                    );
//                                }
//                            );
//                        }
//                    );
//                }
//            );
//        });
//
//        it('should successfully execute POST /authorizations (create)', function (next) {
//            client.authorization.create(
//                {
//                    scopes: ['user', 'public_repo', 'repo', 'repo:status', 'delete_repo', 'gist'],
//                    note: 'Authorization created to unit tests auth',
//                    note_url: 'https://github.com/ajaxorg/node-github'
//                },
//                function (err, res) {
//                    Assert.equal(err, null);
//                    var id = res.id;
//
//                    client.authorization.get(
//                        {
//                            id: id
//                        },
//                        function (err, res) {
//                            Assert.equal(err, null);
//                            Assert.equal(res.id, id);
//                            Assert.equal(res.note, 'Authorization created to unit tests auth');
//                            Assert.equal(res.note_url, 'https://github.com/ajaxorg/node-github');
//
//                            client.authorization['delete'](
//                                {
//                                    id: id
//                                },
//                                function (err, res) {
//                                    Assert.equal(err, null);
//
//                                    client.authorization.get(
//                                        {
//                                            id: id
//                                        },
//                                        function (err, res) {
//                                            Assert.equal(err.code, 404);
//                                            next();
//                                        }
//                                    );
//                                }
//                            );
//                        }
//                    );
//                }
//            );
//        });
//
//        it('should successfully execute PATCH /authorizations/:id (update)', function (next) {
//            client.authorization.create(
//                {
//                    scopes: ['user', 'public_repo', 'repo', 'repo:status', 'delete_repo', 'gist'],
//                    note: 'Authorization created to unit tests auth',
//                    note_url: 'https://github.com/ajaxorg/node-github'
//                },
//                function (err, res) {
//                    Assert.equal(err, null);
//                    var id = res.id;
//
//                    client.authorization.update(
//                        {
//                            id: id,
//                            remove_scopes: ['repo'],
//                            note: 'changed'
//                        },
//                        function (err, res) {
//                            Assert.equal(err, null);
//
//                            client.authorization.get(
//                                {
//                                    id: id
//                                },
//                                function (err, res) {
//                                    Assert.equal(err, null);
//                                    Assert.equal(res.id, id);
//                                    Assert.ok(res.scopes.indexOf('repo') === -1);
//                                    Assert.equal(res.note, 'changed');
//                                    Assert.equal(res.note_url, 'https://github.com/ajaxorg/node-github');
//
//                                    client.authorization['delete'](
//                                        {
//                                            id: id
//                                        },
//                                        function (err, res) {
//                                            Assert.equal(err, null);
//
//                                            client.authorization.get(
//                                                {
//                                                    id: id
//                                                },
//                                                function (err, res) {
//                                                    Assert.equal(err.code, 404);
//                                                    next();
//                                                }
//                                            );
//                                        }
//                                    );
//                                }
//                            );
//                        }
//                    );
//                }
//            );
//        });
//
//        it('should successfully execute DELETE /authorizations/:id (delete)', function (next) {
//            client.authorization.create(
//                {
//                    scopes: ['user', 'public_repo', 'repo', 'repo:status', 'delete_repo', 'gist'],
//                    note: 'Authorization created to unit tests auth',
//                    note_url: 'https://github.com/ajaxorg/node-github'
//                },
//                function (err, res) {
//                    Assert.equal(err, null);
//                    var id = res.id;
//
//                    client.authorization['delete'](
//                        {
//                            id: id
//                        },
//                        function (err, res) {
//                            Assert.equal(err, null);
//
//                            client.authorization.get(
//                                {
//                                    id: id
//                                },
//                                function (err, res) {
//                                    Assert.equal(err.code, 404);
//                                    next();
//                                }
//                            );
//                        }
//                    );
//                }
//            );
//        });
    });
});