(function () {
    'use strict';

    describe('repos', function () {
        var github;
        var token = '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad';

        beforeEach(function () {
            github = new Github();
            client.authenticate({
                type: 'oauth',
                token: token
            });
        });

        it('should successfully execute GET /user/repos (getAll)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getAll(
                {
                    type: 'String',
                    sort: 'String',
                    direction: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /users/:user/repos (getFromUser)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getFromUser(
                {
                    user: 'String',
                    type: 'String',
                    sort: 'String',
                    direction: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /orgs/:org/repos (getFromOrg)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getFromOrg(
                {
                    org: 'String',
                    type: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute POST /user/repos (create)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.create(
                {
                    name: 'String',
                    description: 'String',
                    homepage: 'String',
                    private: 'Boolean',
                    has_issues: 'Boolean',
                    has_wiki: 'Boolean',
                    has_downloads: 'Boolean',
                    auto_init: 'Boolean',
                    gitignore_template: 'String'
                },
                callback
            );
        });

        it('should successfully execute POST /orgs/:org/repos (createFromOrg)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.createFromOrg(
                {
                    org: 'String',
                    name: 'String',
                    description: 'String',
                    homepage: 'String',
                    private: 'Boolean',
                    has_issues: 'Boolean',
                    has_wiki: 'Boolean',
                    has_downloads: 'Boolean',
                    auto_init: 'Boolean',
                    gitignore_template: 'String',
                    team_id: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo (get)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.get(
                {
                    user: 'String',
                    repo: 'String'
                },
                callback
            );
        });

        it('should successfully execute GET /repositories/:id (one)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.one(
                {
                    id: 'String'
                },
                callback
            );
        });

        it('should successfully execute PATCH /repos/:user/:repo (update)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.update(
                {
                    user: 'String',
                    repo: 'String',
                    name: 'String',
                    description: 'String',
                    homepage: 'String',
                    private: 'Boolean',
                    has_issues: 'Boolean',
                    has_wiki: 'Boolean',
                    has_downloads: 'Boolean',
                    default_branch: 'String'
                },
                callback
            );
        });

        it('should successfully execute DELETE /repos/:user/:repo (delete)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.delete(
                {
                    user: 'String',
                    repo: 'String'
                },
                callback
            );
        });

        it('should successfully execute POST /repos/:user/:repo/merges (merge)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.merge(
                {
                    user: 'String',
                    repo: 'String',
                    base: 'String',
                    head: 'String',
                    commit_message: 'String'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/contributors (getContributors)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getContributors(
                {
                    user: 'String',
                    repo: 'String',
                    anon: 'Boolean',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/languages (getLanguages)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getLanguages(
                {
                    user: 'String',
                    repo: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/teams (getTeams)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getTeams(
                {
                    user: 'String',
                    repo: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/tags (getTags)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getTags(
                {
                    user: 'String',
                    repo: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/branches (getBranches)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getBranches(
                {
                    user: 'String',
                    repo: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/branches/:branch (getBranch)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getBranch(
                {
                    user: 'String',
                    repo: 'String',
                    branch: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/collaborators (getCollaborators)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getCollaborators(
                {
                    user: 'String',
                    repo: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/collaborators/:collabuser (getCollaborator)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getCollaborator(
                {
                    user: 'String',
                    repo: 'String',
                    collabuser: 'String'
                },
                callback
            );
        });

        it('should successfully execute PUT /repos/:user/:repo/collaborators/:collabuser (addCollaborator)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.addCollaborator(
                {
                    user: 'String',
                    repo: 'String',
                    collabuser: 'String'
                },
                callback
            );
        });

        it('should successfully execute DELETE /repos/:user/:repo/collaborators/:collabuser (removeCollaborator)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.removeCollaborator(
                {
                    user: 'String',
                    repo: 'String',
                    collabuser: 'String'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/commits (getCommits)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getCommits(
                {
                    user: 'String',
                    repo: 'String',
                    sha: 'String',
                    path: 'String',
                    author: 'String',
                    page: 'Number',
                    per_page: 'Number',
                    since: 'Date',
                    until: 'Date'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/commits/:sha (getCommit)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getCommit(
                {
                    user: 'String',
                    repo: 'String',
                    sha: 'String'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/comments (getAllCommitComments)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getAllCommitComments(
                {
                    user: 'String',
                    repo: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/commits/:sha/comments (getCommitComments)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getCommitComments(
                {
                    user: 'String',
                    repo: 'String',
                    sha: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute POST /repos/:user/:repo/commits/:sha/comments (createCommitComment)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.createCommitComment(
                {
                    user: 'String',
                    repo: 'String',
                    sha: 'String',
                    body: 'String',
                    commit_id: 'String',
                    path: 'String',
                    position: 'Number',
                    line: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/comments/:id (getCommitComment)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getCommitComment(
                {
                    user: 'String',
                    repo: 'String',
                    id: 'String'
                },
                callback
            );
        });

        it('should successfully execute PATCH /repos/:user/:repo/comments/:id (updateCommitComment)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.updateCommitComment(
                {
                    user: 'String',
                    repo: 'String',
                    id: 'String',
                    body: 'String'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/compare/:base...:head (compareCommits)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.compareCommits(
                {
                    user: 'String',
                    repo: 'String',
                    base: 'String',
                    head: 'String'
                },
                callback
            );
        });

        it('should successfully execute DELETE /repos/:user/:repo/comments/:id (deleteCommitComment)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.deleteCommitComment(
                {
                    user: 'String',
                    repo: 'String',
                    id: 'String'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/readme (getReadme)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getReadme(
                {
                    user: 'String',
                    repo: 'String',
                    ref: 'String'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/contents/:path (getContent)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getContent(
                {
                    user: 'String',
                    repo: 'String',
                    path: 'String',
                    ref: 'String'
                },
                callback
            );
        });

        it('should successfully execute PUT /repos/:user/:repo/contents/:path (createContent)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.createContent(
                {
                    user: 'String',
                    repo: 'String',
                    content: 'String',
                    message: 'String',
                    path: 'String',
                    ref: 'String'
                },
                callback
            );
        });

        it('should successfully execute PUT /repos/:user/:repo/contents/:path (createFile)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.createFile(
                {
                    user: 'String',
                    repo: 'String',
                    path: 'String',
                    message: 'String',
                    content: 'String',
                    branch: 'String',
                    author: 'Json',
                    committer: 'Json'
                },
                callback
            );
        });

        it('should successfully execute PUT /repos/:user/:repo/contents/:path (updateFile)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.updateFile(
                {
                    user: 'String',
                    repo: 'String',
                    path: 'String',
                    message: 'String',
                    content: 'String',
                    sha: 'String',
                    branch: 'String',
                    author: 'Json',
                    committer: 'Json'
                },
                callback
            );
        });

        it('should successfully execute DELETE /repos/:user/:repo/contents/:path (deleteFile)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.deleteFile(
                {
                    user: 'String',
                    repo: 'String',
                    path: 'String',
                    message: 'String',
                    sha: 'String',
                    branch: 'String',
                    author: 'Json',
                    committer: 'Json'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/:archive_format/:ref (getArchiveLink)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getArchiveLink(
                {
                    user: 'String',
                    repo: 'String',
                    ref: 'String',
                    archive_format: 'String'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/downloads (getDownloads)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getDownloads(
                {
                    user: 'String',
                    repo: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/downloads/:id (getDownload)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getDownload(
                {
                    user: 'String',
                    repo: 'String',
                    id: 'String'
                },
                callback
            );
        });

        it('should successfully execute DELETE /repos/:user/:repo/downloads/:id (deleteDownload)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.deleteDownload(
                {
                    user: 'String',
                    repo: 'String',
                    id: 'String'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/forks (getForks)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getForks(
                {
                    user: 'String',
                    repo: 'String',
                    sort: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute POST /repos/:user/:repo/forks (fork)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.fork(
                {
                    user: 'String',
                    repo: 'String',
                    organization: 'String'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/keys (getKeys)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getKeys(
                {
                    user: 'String',
                    repo: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/keys/:id (getKey)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getKey(
                {
                    user: 'String',
                    repo: 'String',
                    id: 'String'
                },
                callback
            );
        });

        it('should successfully execute POST /repos/:user/:repo/keys (createKey)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.createKey(
                {
                    user: 'String',
                    repo: 'String',
                    title: 'String',
                    key: 'String'
                },
                callback
            );
        });

        it('should successfully execute PUT /repos/:user/:repo/keys/:id (updateKey)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.updateKey(
                {
                    user: 'String',
                    repo: 'String',
                    id: 'String',
                    title: 'String',
                    key: 'String'
                },
                callback
            );
        });

        it('should successfully execute DELETE /repos/:user/:repo/keys/:id (deleteKey)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.deleteKey(
                {
                    user: 'String',
                    repo: 'String',
                    id: 'String'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/stargazers (getStargazers)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getStargazers(
                {
                    user: 'String',
                    repo: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /user/starred (getStarred)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getStarred(
                {
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /users/:user/starred (getStarredFromUser)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getStarredFromUser(
                {
                    user: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /user/starred/:user/:repo (getStarring)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getStarring(
                {
                    user: 'String',
                    repo: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute PUT /user/starred/:user/:repo (star)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.star(
                {
                    user: 'String',
                    repo: 'String'
                },
                callback
            );
        });

        it('should successfully execute DELETE /user/starred/:user/:repo (unStar)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.unStar(
                {
                    user: 'String',
                    repo: 'String'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/watchers (getWatchers)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getWatchers(
                {
                    user: 'String',
                    repo: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /user/watched (getWatched)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getWatched(
                {
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /users/:user/watched (getWatchedFromUser)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getWatchedFromUser(
                {
                    user: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /user/watched/:user/:repo (getWatching)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getWatching(
                {
                    user: 'String',
                    repo: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute PUT /user/watched/:user/:repo (watch)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.watch(
                {
                    user: 'String',
                    repo: 'String'
                },
                callback
            );
        });

        it('should successfully execute DELETE /user/watched/:user/:repo (unWatch)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.unWatch(
                {
                    user: 'String',
                    repo: 'String'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/hooks (getHooks)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getHooks(
                {
                    user: 'String',
                    repo: 'String',
                    page: 'Number',
                    per_page: 'Number'
                },
                callback
            );
        });

        it('should successfully execute GET /repos/:user/:repo/hooks/:id (getHook)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.getHook(
                {
                    user: 'String',
                    repo: 'String',
                    id: 'String'
                },
                callback
            );
        });

        it('should successfully execute POST /repos/:user/:repo/hooks (createHook)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.createHook(
                {
                    user: 'String',
                    repo: 'String',
                    name: 'String',
                    config: 'Json',
                    events: 'Array',
                    active: 'Boolean'
                },
                callback
            );
        });

        it('should successfully execute PATCH /repos/:user/:repo/hooks/:id (updateHook)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.updateHook(
                {
                    user: 'String',
                    repo: 'String',
                    id: 'String',
                    name: 'String',
                    config: 'Json',
                    events: 'Array',
                    add_events: 'Array',
                    remove_events: 'Array',
                    active: 'Boolean'
                },
                callback
            );
        });

        it('should successfully execute POST /repos/:user/:repo/hooks/:id/test (testHook)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.testHook(
                {
                    user: 'String',
                    repo: 'String',
                    id: 'String'
                },
                callback
            );
        });

        it('should successfully execute DELETE /repos/:user/:repo/hooks/:id (deleteHook)', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.repos.deleteHook(
                {
                    user: 'String',
                    repo: 'String',
                    id: 'String'
                },
                callback
            );
        });


    });
}());
