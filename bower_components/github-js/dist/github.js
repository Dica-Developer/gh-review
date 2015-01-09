/*global URL*/
(function(root){

    var Util = function () {
    };

    Util.prototype.escapeRegExp = function (str) {
        return str.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
    };

    Util.prototype.toCamelCase = function (str, upper) {
        upper = upper || false;
        str = str.toLowerCase().replace(/(?:(^.)|(\s+.)|(-.))/g, function (match) {
            return match.charAt(match.length - 1).toUpperCase();
        });
        if (!upper) {
            str = str.charAt(0).toLowerCase() + str.substr(1);
        }
        return str;
    };

    Util.prototype.isTrue = function (value) {
        return (value === true || value === 'true' || value === 'on' || typeof value === 'number' && value > 0 || value === '1');
    };

    Util.prototype.isFalse = function (value) {
        return (value === false || value === 'false' || value === 'off' || value === 0 || value === '0');
    };

    var consoleTypes = ['info', 'log', 'warn', 'error'];

    consoleTypes.forEach(function (type) {
        Util.prototype[type] = function () {
            if (typeof console !== 'undefined' && typeof console[type] !== 'undefined') {
                return console[type].apply(console, arguments);
            } else {
                return null;
            }
        };
    });

    var util = new Util();

    var statusCodes = {
        400: 'Bad Request',
        401: 'Unauthorized',
        402: 'Payment Required',
        403: 'Forbidden',
        404: 'Not Found',
        405: 'Method Not Allowed',
        406: 'Not Acceptable',
        407: 'Proxy Authentication Required',
        408: 'Request Timeout',
        409: 'Conflict',
        410: 'Gone',
        411: 'Length Required',
        412: 'Precondition Failed',
        413: 'Request Entity Too Large',
        414: 'Request-URI Too Long',
        415: 'Unsupported Media Type',
        416: 'Requested Range Not Satisfiable',
        417: 'Expectation Failed',
        420: 'Enhance Your Calm',
        422: 'Unprocessable Entity',
        423: 'Locked',
        424: 'Failed Dependency',
        425: 'Unordered Collection',
        426: 'Upgrade Required',
        428: 'Precondition Required',
        429: 'Too Many Requests',
        431: 'Request Header Fields Too Large',
        444: 'No Response',
        449: 'Retry With',
        499: 'Client Closed Request',
        500: 'Internal Server Error',
        501: 'Not Implemented',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        504: 'Gateway Timeout',
        505: 'HTTP Version Not Supported',
        506: 'Variant Also Negotiates',
        507: 'Insufficient Storage',
        508: 'Loop Detected',
        509: 'Bandwidth Limit Exceeded',
        510: 'Not Extended',
        511: 'Network Authentication Required'
    };

    var HttpError = function (message, code) {
        this.message = message;
        this.code = code;
        this.defaultMessage = statusCodes[code];
    };

    HttpError.prototype.toString = function () {
        return this.message;
    };

    HttpError.prototype.toJSON = function () {
        return {
            code: this.code,
            status: this.defaultMessage,
            message: this.message
        };
    };

    var handler = function (afterRequest) {
        return function (msg, block, callback) {
            var self = this;
            this.client.httpSend(msg, block, function (err, res) {
                if (err) {
                    return self.sendError(err, null, msg, callback);
                }

                var ret;
                if (typeof res.headers !== 'undefined' && typeof res.headers['content-type'] !== 'undefined' && (res.headers['content-type'].indexOf('text/html') > -1 || res.headers['content-type'].indexOf('application/vnd.github.v3.raw') > -1)) {
                    ret = {
                        data: res.data
                    };
                } else {
                    try {
                        ret = res.data && JSON.parse(res.data);
                    } catch (ex) {
                        if (callback) {
                            callback(new Error(ex), res);
                        }
                        return;
                    }
                }
                ret = afterRequest(ret, res);
                if (callback) {
                    callback(null, ret);
                }
            });
        };
    };

    var gists = {};


    var gistsgetAllAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gists.getAll = handler(gistsgetAllAfterRequest);
    var gistsgetFromUserAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gists.getFromUser = handler(gistsgetFromUserAfterRequest);
    var gistscreateAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gists.create = handler(gistscreateAfterRequest);
    var gistseditAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gists.edit = handler(gistseditAfterRequest);
    var gistspublicAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gists.public = handler(gistspublicAfterRequest);
    var gistsstarredAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gists.starred = handler(gistsstarredAfterRequest);
    var gistsgetAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gists.get = handler(gistsgetAfterRequest);
    var gistsstarAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gists.star = handler(gistsstarAfterRequest);
    var gistsdeleteStarAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gists.deleteStar = handler(gistsdeleteStarAfterRequest);
    var gistscheckStarAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gists.checkStar = handler(gistscheckStarAfterRequest);
    var gistsforkAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gists.fork = handler(gistsforkAfterRequest);
    var gistsdeleteAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gists.delete = handler(gistsdeleteAfterRequest);
    var gistsgetCommentsAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gists.getComments = handler(gistsgetCommentsAfterRequest);
    var gistsgetCommentAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gists.getComment = handler(gistsgetCommentAfterRequest);
    var gistscreateCommentAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gists.createComment = handler(gistscreateCommentAfterRequest);
    var gistseditCommentAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gists.editComment = handler(gistseditCommentAfterRequest);
    var gistsdeleteCommentAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gists.deleteComment = handler(gistsdeleteCommentAfterRequest);




    var gitdata = {};


    var gitdatagetBlobAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gitdata.getBlob = handler(gitdatagetBlobAfterRequest);
    var gitdatacreateBlobAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gitdata.createBlob = handler(gitdatacreateBlobAfterRequest);
    var gitdatagetCommitAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gitdata.getCommit = handler(gitdatagetCommitAfterRequest);
    var gitdatacreateCommitAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gitdata.createCommit = handler(gitdatacreateCommitAfterRequest);
    var gitdatagetReferenceAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gitdata.getReference = handler(gitdatagetReferenceAfterRequest);
    var gitdatagetAllReferencesAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gitdata.getAllReferences = handler(gitdatagetAllReferencesAfterRequest);
    var gitdatacreateReferenceAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gitdata.createReference = handler(gitdatacreateReferenceAfterRequest);
    var gitdataupdateReferenceAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gitdata.updateReference = handler(gitdataupdateReferenceAfterRequest);
    var gitdatadeleteReferenceAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gitdata.deleteReference = handler(gitdatadeleteReferenceAfterRequest);
    var gitdatagetTagAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gitdata.getTag = handler(gitdatagetTagAfterRequest);
    var gitdatacreateTagAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gitdata.createTag = handler(gitdatacreateTagAfterRequest);
    var gitdatagetTreeAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gitdata.getTree = handler(gitdatagetTreeAfterRequest);
    var gitdatacreateTreeAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gitdata.createTree = handler(gitdatacreateTreeAfterRequest);




    var issues = {};


    var issuesgetAllAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    issues.getAll = handler(issuesgetAllAfterRequest);
    var issuesrepoIssuesAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    issues.repoIssues = handler(issuesrepoIssuesAfterRequest);
    var issuesgetRepoIssueAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    issues.getRepoIssue = handler(issuesgetRepoIssueAfterRequest);
    var issuescreateAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    issues.create = handler(issuescreateAfterRequest);
    var issueseditAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    issues.edit = handler(issueseditAfterRequest);
    var issuesrepoCommentsAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    issues.repoComments = handler(issuesrepoCommentsAfterRequest);
    var issuesgetCommentsAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    issues.getComments = handler(issuesgetCommentsAfterRequest);
    var issuesgetCommentAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    issues.getComment = handler(issuesgetCommentAfterRequest);
    var issuescreateCommentAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    issues.createComment = handler(issuescreateCommentAfterRequest);
    var issueseditCommentAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    issues.editComment = handler(issueseditCommentAfterRequest);
    var issuesdeleteCommentAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    issues.deleteComment = handler(issuesdeleteCommentAfterRequest);
    var issuesgetEventsAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    issues.getEvents = handler(issuesgetEventsAfterRequest);
    var issuesgetRepoEventsAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    issues.getRepoEvents = handler(issuesgetRepoEventsAfterRequest);
    var issuesgetEventAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    issues.getEvent = handler(issuesgetEventAfterRequest);
    var issuesgetLabelsAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    issues.getLabels = handler(issuesgetLabelsAfterRequest);
    var issuesgetLabelAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    issues.getLabel = handler(issuesgetLabelAfterRequest);
    var issuescreateLabelAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    issues.createLabel = handler(issuescreateLabelAfterRequest);
    var issuesupdateLabelAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    issues.updateLabel = handler(issuesupdateLabelAfterRequest);
    var issuesdeleteLabelAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    issues.deleteLabel = handler(issuesdeleteLabelAfterRequest);
    var issuesgetIssueLabelsAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    issues.getIssueLabels = handler(issuesgetIssueLabelsAfterRequest);
    var issuesgetAllMilestonesAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    issues.getAllMilestones = handler(issuesgetAllMilestonesAfterRequest);
    var issuesgetMilestoneAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    issues.getMilestone = handler(issuesgetMilestoneAfterRequest);
    var issuescreateMilestoneAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    issues.createMilestone = handler(issuescreateMilestoneAfterRequest);
    var issuesupdateMilestoneAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    issues.updateMilestone = handler(issuesupdateMilestoneAfterRequest);
    var issuesdeleteMilestoneAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    issues.deleteMilestone = handler(issuesdeleteMilestoneAfterRequest);




    var authorization = {};


    var authorizationgetAllAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    authorization.getAll = handler(authorizationgetAllAfterRequest);
    var authorizationgetAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    authorization.get = handler(authorizationgetAfterRequest);
    var authorizationcreateAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    authorization.create = handler(authorizationcreateAfterRequest);
    var authorizationupdateAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    authorization.update = handler(authorizationupdateAfterRequest);
    var authorizationdeleteAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    authorization.delete = handler(authorizationdeleteAfterRequest);




    var orgs = {};


    var orgsgetFromUserAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    orgs.getFromUser = handler(orgsgetFromUserAfterRequest);
    var orgsgetAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    orgs.get = handler(orgsgetAfterRequest);
    var orgsupdateAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    orgs.update = handler(orgsupdateAfterRequest);
    var orgsgetMembersAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    orgs.getMembers = handler(orgsgetMembersAfterRequest);
    var orgsgetMemberAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    orgs.getMember = handler(orgsgetMemberAfterRequest);
    var orgsremoveMemberAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    orgs.removeMember = handler(orgsremoveMemberAfterRequest);
    var orgsgetPublicMembersAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    orgs.getPublicMembers = handler(orgsgetPublicMembersAfterRequest);
    var orgsgetPublicMemberAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    orgs.getPublicMember = handler(orgsgetPublicMemberAfterRequest);
    var orgspublicizeMembershipAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    orgs.publicizeMembership = handler(orgspublicizeMembershipAfterRequest);
    var orgsconcealMembershipAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    orgs.concealMembership = handler(orgsconcealMembershipAfterRequest);
    var orgsgetTeamsAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    orgs.getTeams = handler(orgsgetTeamsAfterRequest);
    var orgsgetTeamAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    orgs.getTeam = handler(orgsgetTeamAfterRequest);
    var orgscreateTeamAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    orgs.createTeam = handler(orgscreateTeamAfterRequest);
    var orgsupdateTeamAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    orgs.updateTeam = handler(orgsupdateTeamAfterRequest);
    var orgsdeleteTeamAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    orgs.deleteTeam = handler(orgsdeleteTeamAfterRequest);
    var orgsgetTeamMembersAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    orgs.getTeamMembers = handler(orgsgetTeamMembersAfterRequest);
    var orgsgetTeamMemberAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    orgs.getTeamMember = handler(orgsgetTeamMemberAfterRequest);
    var orgsaddTeamMemberAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    orgs.addTeamMember = handler(orgsaddTeamMemberAfterRequest);
    var orgsdeleteTeamMemberAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    orgs.deleteTeamMember = handler(orgsdeleteTeamMemberAfterRequest);
    var orgsgetTeamReposAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    orgs.getTeamRepos = handler(orgsgetTeamReposAfterRequest);
    var orgsgetTeamRepoAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    orgs.getTeamRepo = handler(orgsgetTeamRepoAfterRequest);
    var orgsaddTeamRepoAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    orgs.addTeamRepo = handler(orgsaddTeamRepoAfterRequest);
    var orgsdeleteTeamRepoAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    orgs.deleteTeamRepo = handler(orgsdeleteTeamRepoAfterRequest);




    var statuses = {};


    var statusesgetAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    statuses.get = handler(statusesgetAfterRequest);
    var statusescreateAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    statuses.create = handler(statusescreateAfterRequest);




    var pullRequests = {};


    var pullRequestsgetAllAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    pullRequests.getAll = handler(pullRequestsgetAllAfterRequest);
    var pullRequestsgetAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    pullRequests.get = handler(pullRequestsgetAfterRequest);
    var pullRequestscreateAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    pullRequests.create = handler(pullRequestscreateAfterRequest);
    var pullRequestscreateFromIssueAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    pullRequests.createFromIssue = handler(pullRequestscreateFromIssueAfterRequest);
    var pullRequestsupdateAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    pullRequests.update = handler(pullRequestsupdateAfterRequest);
    var pullRequestsgetCommitsAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    pullRequests.getCommits = handler(pullRequestsgetCommitsAfterRequest);
    var pullRequestsgetFilesAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    pullRequests.getFiles = handler(pullRequestsgetFilesAfterRequest);
    var pullRequestsgetMergedAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    pullRequests.getMerged = handler(pullRequestsgetMergedAfterRequest);
    var pullRequestsmergeAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    pullRequests.merge = handler(pullRequestsmergeAfterRequest);
    var pullRequestsgetCommentsAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    pullRequests.getComments = handler(pullRequestsgetCommentsAfterRequest);
    var pullRequestsgetCommentAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    pullRequests.getComment = handler(pullRequestsgetCommentAfterRequest);
    var pullRequestscreateCommentAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    pullRequests.createComment = handler(pullRequestscreateCommentAfterRequest);
    var pullRequestscreateCommentReplyAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    pullRequests.createCommentReply = handler(pullRequestscreateCommentReplyAfterRequest);
    var pullRequestsupdateCommentAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    pullRequests.updateComment = handler(pullRequestsupdateCommentAfterRequest);
    var pullRequestsdeleteCommentAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    pullRequests.deleteComment = handler(pullRequestsdeleteCommentAfterRequest);




    var repos = {};


    var reposgetAllAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getAll = handler(reposgetAllAfterRequest);
    var reposgetFromUserAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getFromUser = handler(reposgetFromUserAfterRequest);
    var reposgetFromOrgAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getFromOrg = handler(reposgetFromOrgAfterRequest);
    var reposcreateAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.create = handler(reposcreateAfterRequest);
    var reposcreateFromOrgAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.createFromOrg = handler(reposcreateFromOrgAfterRequest);
    var reposgetAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.get = handler(reposgetAfterRequest);
    var reposoneAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.one = handler(reposoneAfterRequest);
    var reposupdateAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.update = handler(reposupdateAfterRequest);
    var reposdeleteAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.delete = handler(reposdeleteAfterRequest);
    var reposmergeAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.merge = handler(reposmergeAfterRequest);
    var reposgetContributorsAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getContributors = handler(reposgetContributorsAfterRequest);
    var reposgetLanguagesAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getLanguages = handler(reposgetLanguagesAfterRequest);
    var reposgetTeamsAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getTeams = handler(reposgetTeamsAfterRequest);
    var reposgetTagsAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getTags = handler(reposgetTagsAfterRequest);
    var reposgetBranchesAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getBranches = handler(reposgetBranchesAfterRequest);
    var reposgetBranchAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getBranch = handler(reposgetBranchAfterRequest);
    var reposgetCollaboratorsAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getCollaborators = handler(reposgetCollaboratorsAfterRequest);
    var reposgetCollaboratorAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getCollaborator = handler(reposgetCollaboratorAfterRequest);
    var reposaddCollaboratorAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.addCollaborator = handler(reposaddCollaboratorAfterRequest);
    var reposremoveCollaboratorAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.removeCollaborator = handler(reposremoveCollaboratorAfterRequest);
    var reposgetCommitsAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getCommits = handler(reposgetCommitsAfterRequest);
    var reposgetCommitAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getCommit = handler(reposgetCommitAfterRequest);
    var reposgetAllCommitCommentsAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getAllCommitComments = handler(reposgetAllCommitCommentsAfterRequest);
    var reposgetCommitCommentsAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getCommitComments = handler(reposgetCommitCommentsAfterRequest);
    var reposcreateCommitCommentAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.createCommitComment = handler(reposcreateCommitCommentAfterRequest);
    var reposgetCommitCommentAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getCommitComment = handler(reposgetCommitCommentAfterRequest);
    var reposupdateCommitCommentAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.updateCommitComment = handler(reposupdateCommitCommentAfterRequest);
    var reposcompareCommitsAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.compareCommits = handler(reposcompareCommitsAfterRequest);
    var reposdeleteCommitCommentAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.deleteCommitComment = handler(reposdeleteCommitCommentAfterRequest);
    var reposgetReadmeAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getReadme = handler(reposgetReadmeAfterRequest);
    var reposgetContentAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getContent = handler(reposgetContentAfterRequest);
    var reposcreateContentAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.createContent = handler(reposcreateContentAfterRequest);
    var reposcreateFileAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.createFile = handler(reposcreateFileAfterRequest);
    var reposupdateFileAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.updateFile = handler(reposupdateFileAfterRequest);
    var reposdeleteFileAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.deleteFile = handler(reposdeleteFileAfterRequest);
    var reposgetArchiveLinkAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getArchiveLink = handler(reposgetArchiveLinkAfterRequest);
    var reposgetDownloadsAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getDownloads = handler(reposgetDownloadsAfterRequest);
    var reposgetDownloadAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getDownload = handler(reposgetDownloadAfterRequest);
    var reposdeleteDownloadAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.deleteDownload = handler(reposdeleteDownloadAfterRequest);
    var reposgetForksAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getForks = handler(reposgetForksAfterRequest);
    var reposforkAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.fork = handler(reposforkAfterRequest);
    var reposgetKeysAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getKeys = handler(reposgetKeysAfterRequest);
    var reposgetKeyAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getKey = handler(reposgetKeyAfterRequest);
    var reposcreateKeyAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.createKey = handler(reposcreateKeyAfterRequest);
    var reposupdateKeyAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.updateKey = handler(reposupdateKeyAfterRequest);
    var reposdeleteKeyAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.deleteKey = handler(reposdeleteKeyAfterRequest);
    var reposgetStargazersAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getStargazers = handler(reposgetStargazersAfterRequest);
    var reposgetStarredAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getStarred = handler(reposgetStarredAfterRequest);
    var reposgetStarredFromUserAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getStarredFromUser = handler(reposgetStarredFromUserAfterRequest);
    var reposgetStarringAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getStarring = handler(reposgetStarringAfterRequest);
    var reposstarAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.star = handler(reposstarAfterRequest);
    var reposunStarAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.unStar = handler(reposunStarAfterRequest);
    var reposgetWatchersAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getWatchers = handler(reposgetWatchersAfterRequest);
    var reposgetWatchedAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getWatched = handler(reposgetWatchedAfterRequest);
    var reposgetWatchedFromUserAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getWatchedFromUser = handler(reposgetWatchedFromUserAfterRequest);
    var reposgetWatchingAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getWatching = handler(reposgetWatchingAfterRequest);
    var reposwatchAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.watch = handler(reposwatchAfterRequest);
    var reposunWatchAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.unWatch = handler(reposunWatchAfterRequest);
    var reposgetHooksAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getHooks = handler(reposgetHooksAfterRequest);
    var reposgetHookAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.getHook = handler(reposgetHookAfterRequest);
    var reposcreateHookAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.createHook = handler(reposcreateHookAfterRequest);
    var reposupdateHookAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.updateHook = handler(reposupdateHookAfterRequest);
    var repostestHookAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.testHook = handler(repostestHookAfterRequest);
    var reposdeleteHookAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    repos.deleteHook = handler(reposdeleteHookAfterRequest);




    var user = {};


    var usergetFromAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    user.getFrom = handler(usergetFromAfterRequest);
    var usergetAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    user.get = handler(usergetAfterRequest);
    var userupdateAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    user.update = handler(userupdateAfterRequest);
    var usergetOrgsAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    user.getOrgs = handler(usergetOrgsAfterRequest);
    var usergetTeamsAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    user.getTeams = handler(usergetTeamsAfterRequest);
    var usergetEmailsAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    user.getEmails = handler(usergetEmailsAfterRequest);
    var useraddEmailsAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    user.addEmails = handler(useraddEmailsAfterRequest);
    var userdeleteEmailsAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    user.deleteEmails = handler(userdeleteEmailsAfterRequest);
    var usergetFollowersAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    user.getFollowers = handler(usergetFollowersAfterRequest);
    var usergetFollowingFromUserAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    user.getFollowingFromUser = handler(usergetFollowingFromUserAfterRequest);
    var usergetFollowingAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    user.getFollowing = handler(usergetFollowingAfterRequest);
    var usergetFollowUserAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    user.getFollowUser = handler(usergetFollowUserAfterRequest);
    var userfollowUserAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    user.followUser = handler(userfollowUserAfterRequest);
    var userunFollowUserAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    user.unFollowUser = handler(userunFollowUserAfterRequest);
    var usergetKeysAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    user.getKeys = handler(usergetKeysAfterRequest);
    var usergetKeysFromUserAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    user.getKeysFromUser = handler(usergetKeysFromUserAfterRequest);
    var usergetKeyAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    user.getKey = handler(usergetKeyAfterRequest);
    var usercreateKeyAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    user.createKey = handler(usercreateKeyAfterRequest);
    var userupdateKeyAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    user.updateKey = handler(userupdateKeyAfterRequest);
    var userdeleteKeyAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    user.deleteKey = handler(userdeleteKeyAfterRequest);




    var events = {};


    var eventsgetAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    events.get = handler(eventsgetAfterRequest);
    var eventsgetFromRepoAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    events.getFromRepo = handler(eventsgetFromRepoAfterRequest);
    var eventsgetFromRepoIssuesAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    events.getFromRepoIssues = handler(eventsgetFromRepoIssuesAfterRequest);
    var eventsgetFromRepoNetworkAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    events.getFromRepoNetwork = handler(eventsgetFromRepoNetworkAfterRequest);
    var eventsgetFromOrgAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    events.getFromOrg = handler(eventsgetFromOrgAfterRequest);
    var eventsgetReceivedAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    events.getReceived = handler(eventsgetReceivedAfterRequest);
    var eventsgetReceivedPublicAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    events.getReceivedPublic = handler(eventsgetReceivedPublicAfterRequest);
    var eventsgetFromUserAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    events.getFromUser = handler(eventsgetFromUserAfterRequest);
    var eventsgetFromUserPublicAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    events.getFromUserPublic = handler(eventsgetFromUserPublicAfterRequest);
    var eventsgetFromUserOrgAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    events.getFromUserOrg = handler(eventsgetFromUserOrgAfterRequest);




    var releases = {};


    var releaseslistReleasesAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    releases.listReleases = handler(releaseslistReleasesAfterRequest);
    var releasesgetReleaseAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    releases.getRelease = handler(releasesgetReleaseAfterRequest);
    var releasescreateReleaseAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    releases.createRelease = handler(releasescreateReleaseAfterRequest);
    var releaseseditReleaseAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    releases.editRelease = handler(releaseseditReleaseAfterRequest);
    var releasesdeleteReleaseAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    releases.deleteRelease = handler(releasesdeleteReleaseAfterRequest);
    var releaseslistAssetsAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    releases.listAssets = handler(releaseslistAssetsAfterRequest);
    var releasesgetAssetAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    releases.getAsset = handler(releasesgetAssetAfterRequest);
    var releaseseditAssetAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    releases.editAsset = handler(releaseseditAssetAfterRequest);
    var releasesdeleteAssetAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    releases.deleteAsset = handler(releasesdeleteAssetAfterRequest);




    var search = {};


    var searchissuesAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    search.issues = handler(searchissuesAfterRequest);
    var searchreposAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    search.repos = handler(searchreposAfterRequest);
    var searchusersAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    search.users = handler(searchusersAfterRequest);
    var searchcodeAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    search.code = handler(searchcodeAfterRequest);
    var searchemailAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    search.email = handler(searchemailAfterRequest);




    var markdown = {};


    var markdownrenderAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    markdown.render = handler(markdownrenderAfterRequest);




    var gitignore = {};


    var gitignoretemplatesAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gitignore.templates = handler(gitignoretemplatesAfterRequest);
    var gitignoretemplateAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    gitignore.template = handler(gitignoretemplateAfterRequest);




    var misc = {};


    var miscemojisAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    misc.emojis = handler(miscemojisAfterRequest);
    var miscmetaAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    misc.meta = handler(miscmetaAfterRequest);
    var miscrateLimitAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    misc.rateLimit = handler(miscrateLimitAfterRequest);




    var notifications = {};


    var notificationsgetAllAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    notifications.getAll = handler(notificationsgetAllAfterRequest);
    var notificationsmarkAsReadAfterRequest = function(ret, res){
            ret = ret || {};
            ret.meta = ret.meta || {};
            ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-oauth-scopes', 'x-poll-interval', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                if (res.headers[header]) {
                    ret.meta[header] = res.headers[header];
                }
            });
            return ret;
        };
    notifications.markAsRead = handler(notificationsmarkAsReadAfterRequest);




    var GithubHandler = function (client) {
        this.client = client;
        this.routes = {"gists":{"get-all":{"url":"/gists","method":"GET","params":{"$page":null,"$per_page":null,"$since":null}},"get-from-user":{"url":"/users/:user/gists","method":"GET","params":{"$user":null,"$page":null,"$per_page":null,"$since":null}},"create":{"url":"/gists","method":"POST","params":{"$description":null,"public":{"type":"Boolean","required":true,"validation":"","invalidmsg":"","description":""},"$files":null}},"edit":{"url":"/gists/:id","method":"POST","params":{"$id":null,"$description":null,"$files":null}},"public":{"url":"/gists/public","method":"GET","params":{"$since":null}},"starred":{"url":"/gists/starred","method":"GET","params":{"$since":null}},"get":{"url":"/gists/:id","method":"GET","params":{"$id":null}},"star":{"url":"/gists/:id/star","method":"PUT","params":{"$id":null}},"delete-star":{"url":"/gists/:id/star","method":"DELETE","params":{"$id":null}},"check-star":{"url":"/gists/:id/star","method":"GET","params":{"$id":null}},"fork":{"url":"/gists/:id/fork","method":"POST","params":{"$id":null}},"delete":{"url":"/gists/:id","method":"DELETE","params":{"$id":null}},"get-comments":{"url":"/gists/:gist_id/comments","method":"GET","params":{"$gist_id":null}},"get-comment":{"url":"/gists/:gist_id/comments/:id","method":"GET","params":{"$gist_id":null,"$id":null}},"create-comment":{"url":"/gists/:gist_id/comments","method":"POST","params":{"$gist_id":null,"$body":null}},"edit-comment":{"url":"/gists/:gist_id/comments/:id","method":"POST","params":{"$gist_id":null,"$id":null,"$body":null}},"delete-comment":{"url":"/gists/:gist_id/comments/:id","method":"DELETE","params":{"$gist_id":null,"$id":null}}},"gitdata":{"get-blob":{"url":"/repos/:user/:repo/git/blobs/:sha","method":"GET","params":{"$user":null,"$repo":null,"$sha":null,"$page":null,"$per_page":null}},"create-blob":{"url":"/repos/:user/:repo/git/blobs","method":"POST","params":{"$user":null,"$repo":null,"content":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""},"encoding":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""}}},"get-commit":{"url":"/repos/:user/:repo/git/commits/:sha","method":"GET","params":{"$user":null,"$repo":null,"$sha":null}},"create-commit":{"url":"/repos/:user/:repo/git/commits","method":"POST","params":{"$user":null,"$repo":null,"message":{"type":"String","required":true,"validation":"","invalidmsg":"","description":"String of the commit message"},"tree":{"type":"String","required":true,"validation":"","invalidmsg":"","description":"String of the SHA of the tree object this commit points to"},"parents":{"type":"Array","required":true,"validation":"","invalidmsg":"","description":"Array of the SHAs of the commits that were the parents of this commit. If omitted or empty, the commit will be written as a root commit. For a single parent, an array of one SHA should be provided, for a merge commit, an array of more than one should be provided."},"author":{"type":"Json","required":false,"validation":"","invalidmsg":"","description":""},"committer":{"type":"Json","required":false,"validation":"","invalidmsg":"","description":""}}},"get-reference":{"url":"/repos/:user/:repo/git/refs/:ref","method":"GET","params":{"$user":null,"$repo":null,"$ref":null}},"get-all-references":{"url":"/repos/:user/:repo/git/refs","method":"GET","params":{"$user":null,"$repo":null,"$page":null,"$per_page":null}},"create-reference":{"url":"/repos/:user/:repo/git/refs","method":"POST","params":{"$user":null,"$repo":null,"$ref":null,"$sha":null}},"update-reference":{"url":"/repos/:user/:repo/git/refs/:ref","method":"POST","params":{"$user":null,"$repo":null,"$ref":null,"$sha":null,"force":{"type":"Boolean","required":false,"validation":"","invalidmsg":"","description":"Boolean indicating whether to force the update or to make sure the update is a fast-forward update. The default is false, so leaving this out or setting it to false will make sure you’re not overwriting work."}}},"delete-reference":{"url":"/repos/:user/:repo/git/refs/:ref","method":"DELETE","params":{"$user":null,"$repo":null,"$ref":null}},"get-tag":{"url":"/repos/:user/:repo/git/tags/:sha","method":"GET","params":{"$user":null,"$repo":null,"$sha":null}},"create-tag":{"url":"/repos/:user/:repo/git/tags","method":"POST","params":{"$user":null,"$repo":null,"tag":{"type":"String","required":true,"validation":"","invalidmsg":"","description":"String of the tag"},"message":{"type":"String","required":true,"validation":"","invalidmsg":"","description":"String of the tag message"},"object":{"type":"String","required":true,"validation":"","invalidmsg":"","description":"String of the SHA of the git object this is tagging"},"type":{"type":"String","required":true,"validation":"","invalidmsg":"","description":"String of the type of the object we’re tagging. Normally this is a commit but it can also be a tree or a blob."},"tagger":{"type":"Json","required":true,"validation":"","invalidmsg":"","description":"JSON object that contains the following keys: `name` - String of the name of the author of the tag, `email` - String of the email of the author of the tag, `date` - Timestamp of when this object was tagged"}}},"get-tree":{"url":"/repos/:user/:repo/git/trees/:sha","method":"GET","params":{"$user":null,"$repo":null,"$sha":null,"recursive":{"type":"Boolean","required":false,"validation":"","invalidmsg":"","description":""}}},"create-tree":{"url":"/repos/:user/:repo/git/trees","method":"POST","params":{"$user":null,"$repo":null,"tree":{"type":"Json","required":true,"validation":"","invalidmsg":"","description":"Array of Hash objects (of path, mode, type and sha) specifying a tree structure"},"base_tree":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"String of the SHA1 of the tree you want to update with new data"}}}},"issues":{"get-all":{"url":"/issues","method":"GET","params":{"filter":{"type":"String","required":false,"validation":"^(all|assigned|created|mentioned|subscribed)$","invalidmsg":"","description":""},"state":{"type":"String","required":false,"validation":"^(open|closed|all)$","invalidmsg":"open, closed, all, default: open","description":"open, closed, or all"},"labels":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"String list of comma separated Label names. Example: bug,ui,@high"},"sort":{"type":"String","required":false,"validation":"^(created|updated|comments)$","invalidmsg":"created, updated, comments, default: created.","description":""},"$direction":null,"$since":null,"$page":null,"$per_page":null}},"repo-issues":{"url":"/repos/:user/:repo/issues","method":"GET","params":{"$user":null,"$repo":null,"milestone":{"type":"String","required":false,"validation":"^([0-9]+|none|\\*)$","invalidmsg":"","description":""},"state":{"type":"String","required":false,"validation":"^(open|closed|all)$","invalidmsg":"open, closed, all, default: open","description":"open, closed, or all"},"assignee":{"type":"String","required":false,"validation":"","invalidmsg":"String User login, `none` for Issues with no assigned User. `*` for Issues with any assigned User.","description":"String User login, `none` for Issues with no assigned User. `*` for Issues with any assigned User."},"mentioned":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"String User login."},"labels":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"String list of comma separated Label names. Example: bug,ui,@high"},"sort":{"type":"String","required":false,"validation":"^(created|updated|comments)$","invalidmsg":"created, updated, comments, default: created.","description":""},"$direction":null,"$since":null,"$page":null,"$per_page":null}},"get-repo-issue":{"url":"/repos/:user/:repo/issues/:number","method":"GET","params":{"$user":null,"$repo":null,"$number":null}},"create":{"url":"/repos/:user/:repo/issues","method":"POST","params":{"$user":null,"$repo":null,"title":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""},"body":{"type":"String","required":false,"validation":"","invalidmsg":"","description":""},"assignee":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"Login for the user that this issue should be assigned to."},"milestone":{"type":"Number","required":false,"validation":"^[0-9]+$","invalidmsg":"","description":"Milestone to associate this issue with."},"labels":{"type":"Json","required":true,"validation":"","invalidmsg":"","description":"Array of strings - Labels to associate with this issue."}}},"edit":{"url":"/repos/:user/:repo/issues/:number","method":"POST","params":{"$user":null,"$repo":null,"$number":null,"title":{"type":"String","required":false,"validation":"","invalidmsg":"","description":""},"body":{"type":"String","required":false,"validation":"","invalidmsg":"","description":""},"assignee":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"Login for the user that this issue should be assigned to."},"milestone":{"type":"Number","required":false,"validation":"^[0-9]+$","invalidmsg":"","description":"Milestone to associate this issue with."},"labels":{"type":"Json","required":false,"validation":"","invalidmsg":"","description":"Array of strings - Labels to associate with this issue."},"state":{"type":"String","required":false,"validation":"^(open|closed)$","invalidmsg":"open, closed, default: open","description":"open or closed"}}},"repo-comments":{"url":"/repos/:user/:repo/issues/comments","method":"GET","params":{"$user":null,"$repo":null,"sort":{"type":"String","required":false,"validation":"^(created|updated)$","invalidmsg":"created, updated, default: created.","description":""},"$direction":null,"$since":null,"$page":null,"$per_page":null}},"get-comments":{"url":"/repos/:user/:repo/issues/:number/comments","method":"GET","params":{"$user":null,"$repo":null,"$number":null,"$page":null,"$per_page":null}},"get-comment":{"url":"/repos/:user/:repo/issues/comments/:id","method":"GET","params":{"$user":null,"$repo":null,"$id":null}},"create-comment":{"url":"/repos/:user/:repo/issues/:number/comments","method":"POST","params":{"$user":null,"$repo":null,"$number":null,"body":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""}}},"edit-comment":{"url":"/repos/:user/:repo/issues/comments/:id","method":"POST","params":{"$user":null,"$repo":null,"$id":null,"body":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""}}},"delete-comment":{"url":"/repos/:user/:repo/issues/comments/:id","method":"DELETE","params":{"$user":null,"$repo":null,"$id":null}},"get-events":{"url":"/repos/:user/:repo/issues/:number/events","method":"GET","params":{"$user":null,"$repo":null,"$number":null,"$page":null,"$per_page":null}},"get-repo-events":{"url":"/repos/:user/:repo/issues/events","method":"GET","params":{"$user":null,"$repo":null,"$page":null,"$per_page":null}},"get-event":{"url":"/repos/:user/:repo/issues/events/:id","method":"GET","params":{"$user":null,"$repo":null,"$id":null}},"get-labels":{"url":"/repos/:user/:repo/labels","method":"GET","params":{"$user":null,"$repo":null,"$page":null,"$per_page":null}},"get-label":{"url":"/repos/:user/:repo/labels/:name","method":"GET","params":{"$user":null,"$repo":null,"$name":null}},"create-label":{"url":"/repos/:user/:repo/labels","method":"POST","params":{"$user":null,"$repo":null,"$name":null,"$color":null}},"update-label":{"url":"/repos/:user/:repo/labels/:name","method":"POST","params":{"$user":null,"$repo":null,"$name":null,"$color":null}},"delete-label":{"url":"/repos/:user/:repo/labels/:name","method":"DELETE","params":{"$user":null,"$repo":null,"$name":null}},"get-issue-labels":{"url":"/repos/:user/:repo/issues/:number/labels","method":"GET","params":{"$user":null,"$repo":null,"$number":null}},"get-all-milestones":{"url":"/repos/:user/:repo/milestones","method":"GET","params":{"$user":null,"$repo":null,"$state":null,"sort":{"type":"String","required":false,"validation":"^(due_date|completeness)$","invalidmsg":"due_date, completeness, default: due_date","description":"due_date, completeness, default: due_date"},"$page":null,"$per_page":null}},"get-milestone":{"url":"/repos/:user/:repo/milestones/:number","method":"GET","params":{"$user":null,"$repo":null,"$number":null}},"create-milestone":{"url":"/repos/:user/:repo/milestones","method":"POST","params":{"$user":null,"$repo":null,"title":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""},"$state":null,"$description":null,"due_on":{"type":"Date","required":false,"validation":"","invalidmsg":"Timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ","description":"Timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ"}}},"update-milestone":{"url":"/repos/:user/:repo/milestones/:number","method":"POST","params":{"$user":null,"$repo":null,"$number":null,"title":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""},"$state":null,"$description":null,"due_on":{"type":"Date","required":false,"validation":"","invalidmsg":"Timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ","description":"Timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ"}}},"delete-milestone":{"url":"/repos/:user/:repo/milestones/:number","method":"DELETE","params":{"$user":null,"$repo":null,"$number":null}}},"authorization":{"get-all":{"url":"/authorizations","method":"GET","params":{"$page":null,"$per_page":null}},"get":{"url":"/authorizations/:id","method":"GET","params":{"$id":null}},"create":{"url":"/authorizations","method":"POST","params":{"$scopes":null,"$note":null,"$note_url":null}},"update":{"url":"/authorizations/:id","method":"POST","params":{"$id":null,"$scopes":null,"add_scopes":{"type":"Array","required":false,"validation":"","invalidmsg":"","description":"A list of scopes to add to this authorization."},"remove_scopes":{"type":"Array","required":false,"validation":"","invalidmsg":"","description":"A list of scopes to remove from this authorization."},"$note":null,"$note_url":null}},"delete":{"url":"/authorizations/:id","method":"DELETE","params":{"$id":null}}},"orgs":{"get-from-user":{"url":"/users/:user/orgs","method":"GET","params":{"$user":null,"$page":null,"$per_page":null}},"get":{"url":"/orgs/:org","method":"GET","params":{"$org":null,"$page":null,"$per_page":null}},"update":{"url":"/orgs/:org","method":"POST","params":{"$org":null,"billing_email":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"Billing email address. This address is not publicized."},"company":{"type":"String","required":false,"validation":"","invalidmsg":"","description":""},"email":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"Publicly visible email address."},"location":{"type":"String","required":false,"validation":"","invalidmsg":"","description":""},"name":{"type":"String","required":false,"validation":"","invalidmsg":"","description":""}}},"get-members":{"url":"/orgs/:org/members","method":"GET","params":{"$org":null,"$page":null,"$per_page":null}},"get-member":{"url":"/orgs/:org/members/:user","method":"GET","params":{"$org":null,"$user":null}},"remove-member":{"url":"/orgs/:org/members/:user","method":"DELETE","params":{"$org":null,"$user":null}},"get-public-members":{"url":"/orgs/:org/public_members","method":"GET","params":{"$org":null}},"get-public-member":{"url":"/orgs/:org/public_members/:user","method":"GET","params":{"$org":null,"$user":null}},"publicize-membership":{"url":"/orgs/:org/public_members/:user","method":"PUT","params":{"$org":null,"$user":null}},"conceal-membership":{"url":"/orgs/:org/public_members/:user","method":"DELETE","params":{"$org":null,"$user":null}},"get-teams":{"url":"/orgs/:org/teams","method":"GET","params":{"$org":null,"$page":null,"$per_page":null}},"get-team":{"url":"/teams/:id","method":"GET","params":{"$id":null}},"create-team":{"url":"/orgs/:org/teams","method":"POST","params":{"$org":null,"$name":null,"repo_names":{"type":"Array","required":false,"validation":"","invalidmsg":"","description":"Array of strings"},"$permission":null}},"update-team":{"url":"/teams/:id","method":"POST","params":{"$id":null,"$name":null,"$permission":null}},"delete-team":{"url":"/teams/:id","method":"DELETE","params":{"$id":null}},"get-team-members":{"url":"/teams/:id/members","method":"GET","params":{"$id":null,"$page":null,"$per_page":null}},"get-team-member":{"url":"/teams/:id/members/:user","method":"GET","params":{"$id":null,"$user":null}},"add-team-member":{"url":"/teams/:id/members/:user","method":"PUT","params":{"$id":null,"$user":null}},"delete-team-member":{"url":"/teams/:id/members/:user","method":"DELETE","params":{"$id":null,"$user":null}},"get-team-repos":{"url":"/teams/:id/repos","method":"GET","params":{"$id":null,"$page":null,"$per_page":null}},"get-team-repo":{"url":"/teams/:id/repos/:user/:repo","method":"GET","params":{"$id":null,"$user":null,"$repo":null}},"add-team-repo":{"url":"/teams/:id/repos/:user/:repo","method":"PUT","params":{"$id":null,"$user":null,"$repo":null}},"delete-team-repo":{"url":"/teams/:id/repos/:user/:repo","method":"DELETE","params":{"$id":null,"$user":null,"$repo":null}}},"statuses":{"get":{"url":"/repos/:user/:repo/statuses/:sha","method":"GET","params":{"$user":null,"$repo":null,"$sha":null}},"create":{"url":"/repos/:user/:repo/statuses/:sha","method":"POST","params":{"$user":null,"$repo":null,"$sha":null,"state":{"type":"String","required":true,"validation":"^(pending|success|error|failure)$","invalidmsg":"","description":"State of the status - can be one of pending, success, error, or failure."},"target_url":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"Target url to associate with this status. This URL will be linked from the GitHub UI to allow users to easily see the ‘source’ of the Status."},"description":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"Short description of the status."}}}},"pull-requests":{"get-all":{"url":"/repos/:user/:repo/pulls","method":"GET","params":{"$user":null,"$repo":null,"state":{"type":"String","required":false,"validation":"^(open|closed|all)$","invalidmsg":"open, closed, all, default: open","description":"open, closed, or all"},"$page":null,"$per_page":null,"sort":{"type":"String","required":false,"validation":"^(created|updated|popularity|long-running)$","invalidmsg":"Possible values are: `created`, `updated`, `popularity`, `long-running`, Default: `created`","description":"Possible values are: `created`, `updated`, `popularity`, `long-running`, Default: `created`"},"$direction":null}},"get":{"url":"/repos/:user/:repo/pulls/:number","method":"GET","params":{"$user":null,"$repo":null,"$number":null}},"create":{"url":"/repos/:user/:repo/pulls","method":"POST","params":{"$user":null,"$repo":null,"title":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""},"body":{"type":"String","required":false,"validation":"","invalidmsg":"","description":""},"$base":null,"$head":null}},"create-from-issue":{"url":"/repos/:user/:repo/pulls","method":"POST","params":{"$user":null,"$repo":null,"issue":{"type":"Number","required":true,"validation":"^[0-9]+$","invalidmsg":"","description":""},"$base":null,"$head":null}},"update":{"url":"/repos/:user/:repo/pulls/:number","method":"POST","params":{"$user":null,"$repo":null,"$number":null,"$state":null,"title":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""},"body":{"type":"String","required":false,"validation":"","invalidmsg":"","description":""}}},"get-commits":{"url":"/repos/:user/:repo/pulls/:number/commits","method":"GET","params":{"$user":null,"$repo":null,"$number":null,"$page":null,"$per_page":null}},"get-files":{"url":"/repos/:user/:repo/pulls/:number/files","method":"GET","params":{"$user":null,"$repo":null,"$number":null,"$page":null,"$per_page":null}},"get-merged":{"url":"/repos/:user/:repo/pulls/:number/merge","method":"GET","params":{"$user":null,"$repo":null,"$number":null,"$page":null,"$per_page":null}},"merge":{"url":"/repos/:user/:repo/pulls/:number/merge","method":"PUT","params":{"$user":null,"$repo":null,"$number":null,"commit_message":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"The message that will be used for the merge commit"}}},"get-comments":{"url":"/repos/:user/:repo/pulls/:number/comments","method":"GET","params":{"$user":null,"$repo":null,"$number":null,"$page":null,"$per_page":null}},"get-comment":{"url":"/repos/:user/:repo/pulls/comments/:number","method":"GET","params":{"$user":null,"$repo":null,"$number":null}},"create-comment":{"url":"/repos/:user/:repo/pulls/:number/comments","method":"POST","params":{"$user":null,"$repo":null,"$number":null,"$body":null,"$commit_id":null,"$path":null,"$position":null}},"create-comment-reply":{"url":"/repos/:user/:repo/pulls/:number/comments","method":"POST","params":{"$user":null,"$repo":null,"$number":null,"$body":null,"in_reply_to":{"type":"Number","required":true,"validation":"","invalidmsg":"","description":""}}},"update-comment":{"url":"/repos/:user/:repo/pulls/comments/:number","method":"POST","params":{"$user":null,"$repo":null,"$number":null,"$body":null}},"delete-comment":{"url":"/repos/:user/:repo/pulls/comments/:number","method":"DELETE","params":{"$user":null,"$repo":null,"$number":null}}},"repos":{"get-all":{"url":"/user/repos","method":"GET","params":{"type":{"type":"String","required":false,"validation":"^(all|owner|public|private|member)$","invalidmsg":"Possible values: `all`, `owner`, `public`, `private`, `member`. Default: `all`.","description":"Possible values: `all`, `owner`, `public`, `private`, `member`. Default: `all`."},"sort":{"type":"String","required":false,"validation":"^(created|updated|pushed|full_name)$","invalidmsg":"Possible values: `created`, `updated`, `pushed`, `full_name`. Default: `full_name`.","description":"Possible values: `created`, `updated`, `pushed`, `full_name`. Default: `full_name`."},"$direction":null,"$page":null,"$per_page":null}},"get-from-user":{"url":"/users/:user/repos","method":"GET","params":{"$user":null,"type":{"type":"String","required":false,"validation":"^(all|owner|member)$","invalidmsg":"Possible values: `all`, `owner`, `member`. Default: `public`.","description":"Possible values: `all`, `owner`, `member`. Default: `public`."},"sort":{"type":"String","required":false,"validation":"^(created|updated|pushed|full_name)$","invalidmsg":"Possible values: `created`, `updated`, `pushed`, `full_name`. Default: `full_name`.","description":"Possible values: `created`, `updated`, `pushed`, `full_name`. Default: `full_name`."},"$direction":null,"$page":null,"$per_page":null}},"get-from-org":{"url":"/orgs/:org/repos","method":"GET","params":{"$org":null,"type":{"type":"String","required":false,"validation":"^(all|public|member)$","invalidmsg":"Possible values: `all`, `public`, `member`. Default: `all`.","description":"Possible values: `all`, `public`, `member`. Default: `all`."},"$page":null,"$per_page":null}},"create":{"url":"/user/repos","method":"POST","params":{"$name":null,"$description":null,"$homepage":null,"$private":null,"$has_issues":null,"$has_wiki":null,"$has_downloads":null,"$auto_init":null,"$gitignore_template":null}},"create-from-org":{"url":"/orgs/:org/repos","method":"POST","params":{"$org":null,"$name":null,"$description":null,"$homepage":null,"$private":null,"$has_issues":null,"$has_wiki":null,"$has_downloads":null,"$auto_init":null,"$gitignore_template":null,"team_id":{"type":"Number","required":false,"validation":"^[0-9]+$","invalidmsg":"","description":"The id of the team that will be granted access to this repository. This is only valid when creating a repo in an organization."}}},"get":{"url":"/repos/:user/:repo","method":"GET","params":{"$user":null,"$repo":null}},"one":{"url":"/repositories/:id","method":"GET","params":{"$id":null}},"update":{"url":"/repos/:user/:repo","method":"POST","params":{"$user":null,"$repo":null,"$name":null,"$description":null,"$homepage":null,"$private":null,"$has_issues":null,"$has_wiki":null,"$has_downloads":null,"$default_branch":null}},"delete":{"url":"/repos/:user/:repo","method":"DELETE","params":{"$user":null,"$repo":null}},"merge":{"url":"/repos/:user/:repo/merges","method":"POST","params":{"$user":null,"$repo":null,"$base":null,"$head":null,"commit_message":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"Commit message to use for the merge commit. If omitted, a default message will be used."}}},"get-contributors":{"url":"/repos/:user/:repo/contributors","method":"GET","params":{"$user":null,"$repo":null,"anon":{"type":"Boolean","required":false,"validation":"","invalidmsg":"","description":"Set to 1 or true to include anonymous contributors in results."},"$page":null,"$per_page":null}},"get-languages":{"url":"/repos/:user/:repo/languages","method":"GET","params":{"$user":null,"$repo":null,"$page":null,"$per_page":null}},"get-teams":{"url":"/repos/:user/:repo/teams","method":"GET","params":{"$user":null,"$repo":null,"$page":null,"$per_page":null}},"get-tags":{"url":"/repos/:user/:repo/tags","method":"GET","params":{"$user":null,"$repo":null,"$page":null,"$per_page":null}},"get-branches":{"url":"/repos/:user/:repo/branches","method":"GET","params":{"$user":null,"$repo":null,"$page":null,"$per_page":null}},"get-branch":{"url":"/repos/:user/:repo/branches/:branch","method":"GET","params":{"$user":null,"$repo":null,"$branch":null,"$page":null,"$per_page":null}},"get-collaborators":{"url":"/repos/:user/:repo/collaborators","method":"GET","params":{"$user":null,"$repo":null,"$page":null,"$per_page":null}},"get-collaborator":{"url":"/repos/:user/:repo/collaborators/:collabuser","method":"GET","params":{"$user":null,"$repo":null,"$collabuser":null}},"add-collaborator":{"url":"/repos/:user/:repo/collaborators/:collabuser","method":"PUT","params":{"$user":null,"$repo":null,"$collabuser":null}},"remove-collaborator":{"url":"/repos/:user/:repo/collaborators/:collabuser","method":"DELETE","params":{"$user":null,"$repo":null,"$collabuser":null}},"get-commits":{"url":"/repos/:user/:repo/commits","method":"GET","params":{"$user":null,"$repo":null,"sha":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"Sha or branch to start listing commits from."},"path":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"Only commits containing this file path will be returned."},"author":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"GitHub login or email address by which to filter by commit author."},"$page":null,"$per_page":null,"$since":null,"$until":null}},"get-commit":{"url":"/repos/:user/:repo/commits/:sha","method":"GET","params":{"$user":null,"$repo":null,"$sha":null}},"get-all-commit-comments":{"url":"/repos/:user/:repo/comments","method":"GET","params":{"$user":null,"$repo":null,"$page":null,"$per_page":null}},"get-commit-comments":{"url":"/repos/:user/:repo/commits/:sha/comments","method":"GET","params":{"$user":null,"$repo":null,"$sha":null,"$page":null,"$per_page":null}},"create-commit-comment":{"url":"/repos/:user/:repo/commits/:sha/comments","method":"POST","params":{"$user":null,"$repo":null,"$sha":null,"$body":null,"path":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"Relative path of the file to comment on."},"position":{"type":"Number","required":false,"validation":"","invalidmsg":"","description":"Line index in the diff to comment on."},"line":{"type":"Number","required":false,"validation":"","invalidmsg":"","description":"Line number in the file to comment on. Defaults to 1."}}},"get-commit-comment":{"url":"/repos/:user/:repo/comments/:id","method":"GET","params":{"$user":null,"$repo":null,"$id":null}},"update-commit-comment":{"url":"/repos/:user/:repo/comments/:id","method":"POST","params":{"$user":null,"$repo":null,"$id":null,"$body":null}},"compare-commits":{"url":"/repos/:user/:repo/compare/:base...:head","method":"GET","params":{"$user":null,"$repo":null,"$base":null,"$head":null}},"delete-commit-comment":{"url":"/repos/:user/:repo/comments/:id","method":"DELETE","params":{"$user":null,"$repo":null,"$id":null}},"get-readme":{"url":"/repos/:user/:repo/readme","method":"GET","params":{"$user":null,"$repo":null,"ref":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"The String name of the Commit/Branch/Tag. Defaults to master."}}},"get-content":{"url":"/repos/:user/:repo/contents/:path","method":"GET","params":{"$user":null,"$repo":null,"path":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"The content path."},"ref":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"The String name of the Commit/Branch/Tag. Defaults to master."}}},"create-content":{"url":"/repos/:user/:repo/contents/:path","method":"PUT","params":{"$user":null,"$repo":null,"$content":null,"$message":null,"path":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"The content path."},"ref":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"The String name of the Commit/Branch/Tag. Defaults to master."}}},"create-file":{"url":"/repos/:user/:repo/contents/:path","method":"PUT","params":{"$user":null,"$repo":null,"path":{"type":"String","required":true,"validation":"","invalidmsg":"","description":"The content path."},"message":{"type":"String","required":true,"validation":"","invalidmsg":"","description":"The commit message."},"content":{"type":"String","required":true,"validation":"","invalidmsg":"","description":"The new file content, Base64 encoded."},"branch":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"The branch name. If not provided, uses the repository’s default branch (usually master)."},"author":{"type":"Json","required":false,"validation":"","invalidmsg":"","description":""},"committer":{"type":"Json","required":false,"validation":"","invalidmsg":"","description":""}}},"update-file":{"url":"/repos/:user/:repo/contents/:path","method":"PUT","params":{"$user":null,"$repo":null,"path":{"type":"String","required":true,"validation":"","invalidmsg":"","description":"The content path."},"message":{"type":"String","required":true,"validation":"","invalidmsg":"","description":"The commit message."},"content":{"type":"String","required":true,"validation":"","invalidmsg":"","description":"The updated file content, Base64 encoded."},"sha":{"type":"String","required":true,"validation":"","invalidmsg":"","description":"The blob SHA of the file being replaced."},"branch":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"The branch name. If not provided, uses the repository’s default branch (usually master)."},"author":{"type":"Json","required":false,"validation":"","invalidmsg":"","description":""},"committer":{"type":"Json","required":false,"validation":"","invalidmsg":"","description":""}}},"delete-file":{"url":"/repos/:user/:repo/contents/:path","method":"DELETE","params":{"$user":null,"$repo":null,"path":{"type":"String","required":true,"validation":"","invalidmsg":"","description":"The content path."},"message":{"type":"String","required":true,"validation":"","invalidmsg":"","description":"The commit message."},"sha":{"type":"String","required":true,"validation":"","invalidmsg":"","description":"The blob SHA of the file being removed."},"branch":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"The branch name. If not provided, uses the repository’s default branch (usually master)."},"author":{"type":"Json","required":false,"validation":"","invalidmsg":"","description":""},"committer":{"type":"Json","required":false,"validation":"","invalidmsg":"","description":""}}},"get-archive-link":{"url":"/repos/:user/:repo/:archive_format/:ref","method":"GET","params":{"$user":null,"$repo":null,"ref":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"String of the name of the fully qualified reference (ie: heads/master). If it doesn’t have at least one slash, it will be rejected."},"archive_format":{"type":"String","required":true,"validation":"^(tarball|zipball)$","invalidmsg":"Either tarball or zipball","description":"Either tarball or zipball"}}},"get-downloads":{"url":"/repos/:user/:repo/downloads","method":"GET","params":{"$user":null,"$repo":null,"$page":null,"$per_page":null}},"get-download":{"url":"/repos/:user/:repo/downloads/:id","method":"GET","params":{"$user":null,"$repo":null,"$id":null}},"delete-download":{"url":"/repos/:user/:repo/downloads/:id","method":"DELETE","params":{"$user":null,"$repo":null,"$id":null}},"get-forks":{"url":"/repos/:user/:repo/forks","method":"GET","params":{"$user":null,"$repo":null,"sort":{"type":"String","required":false,"validation":"^(newest|oldest|watchers)$","invalidmsg":"Possible values: `newest`, `oldest`, `watchers`, default: `newest`.","description":"Possible values: `newest`, `oldest`, `watchers`, default: `newest`."},"$page":null,"$per_page":null}},"fork":{"url":"/repos/:user/:repo/forks","method":"POST","params":{"$user":null,"$repo":null,"organization":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"Organization login. The repository will be forked into this organization."}}},"get-keys":{"url":"/repos/:user/:repo/keys","method":"GET","params":{"$user":null,"$repo":null,"$page":null,"$per_page":null}},"get-key":{"url":"/repos/:user/:repo/keys/:id","method":"GET","params":{"$user":null,"$repo":null,"$id":null}},"create-key":{"url":"/repos/:user/:repo/keys","method":"POST","params":{"$user":null,"$repo":null,"$title":null,"$key":null}},"update-key":{"url":"/repos/:user/:repo/keys/:id","method":"PUT","params":{"$user":null,"$repo":null,"$id":null,"$title":null,"$key":null}},"delete-key":{"url":"/repos/:user/:repo/keys/:id","method":"DELETE","params":{"$user":null,"$repo":null,"$id":null}},"get-stargazers":{"url":"/repos/:user/:repo/stargazers","method":"GET","params":{"$user":null,"$repo":null,"$page":null,"$per_page":null}},"get-starred":{"url":"/user/starred","method":"GET","params":{"$page":null,"$per_page":null}},"get-starred-from-user":{"url":"/users/:user/starred","method":"GET","params":{"$user":null,"$page":null,"$per_page":null}},"get-starring":{"url":"/user/starred/:user/:repo","method":"GET","params":{"$user":null,"$repo":null,"$page":null,"$per_page":null}},"star":{"url":"/user/starred/:user/:repo","method":"PUT","params":{"$user":null,"$repo":null}},"un-star":{"url":"/user/starred/:user/:repo","method":"DELETE","params":{"$user":null,"$repo":null}},"get-watchers":{"url":"/repos/:user/:repo/watchers","method":"GET","params":{"$user":null,"$repo":null,"$page":null,"$per_page":null}},"get-watched":{"url":"/user/watched","method":"GET","params":{"$page":null,"$per_page":null}},"get-watched-from-user":{"url":"/users/:user/watched","method":"GET","params":{"$user":null,"$page":null,"$per_page":null}},"get-watching":{"url":"/user/watched/:user/:repo","method":"GET","params":{"$user":null,"$repo":null,"$page":null,"$per_page":null}},"watch":{"url":"/user/watched/:user/:repo","method":"PUT","params":{"$user":null,"$repo":null}},"un-watch":{"url":"/user/watched/:user/:repo","method":"DELETE","params":{"$user":null,"$repo":null}},"get-hooks":{"url":"/repos/:user/:repo/hooks","method":"GET","params":{"$user":null,"$repo":null,"$page":null,"$per_page":null}},"get-hook":{"url":"/repos/:user/:repo/hooks/:id","method":"GET","params":{"$user":null,"$repo":null,"$id":null}},"create-hook":{"url":"/repos/:user/:repo/hooks","method":"POST","params":{"$user":null,"$repo":null,"$name":null,"config":{"type":"Json","required":true,"validation":"","invalidmsg":"","description":"A Hash containing key/value pairs to provide settings for this hook. These settings vary between the services and are defined in the github-services repo. Booleans are stored internally as `1` for true, and `0` for false. Any JSON true/false values will be converted automatically."},"events":{"type":"Array","required":false,"validation":"","invalidmsg":"","description":"Determines what events the hook is triggered for. Default: `['push']`."},"active":{"type":"Boolean","required":false,"validation":"","invalidmsg":"","description":"Determines whether the hook is actually triggered on pushes."}}},"update-hook":{"url":"/repos/:user/:repo/hooks/:id","method":"POST","params":{"$user":null,"$repo":null,"$id":null,"$name":null,"config":{"type":"Json","required":true,"validation":"","invalidmsg":"","description":"A Hash containing key/value pairs to provide settings for this hook. Modifying this will replace the entire config object. These settings vary between the services and are defined in the github-services repo. Booleans are stored internally as `1` for true, and `0` for false. Any JSON true/false values will be converted automatically."},"events":{"type":"Array","required":false,"validation":"","invalidmsg":"","description":"Determines what events the hook is triggered for. This replaces the entire array of events. Default: `['push']`."},"add_events":{"type":"Array","required":false,"validation":"","invalidmsg":"","description":"Determines a list of events to be added to the list of events that the Hook triggers for."},"remove_events":{"type":"Array","required":false,"validation":"","invalidmsg":"","description":"Determines a list of events to be removed from the list of events that the Hook triggers for."},"active":{"type":"Boolean","required":false,"validation":"","invalidmsg":"","description":"Determines whether the hook is actually triggered on pushes."}}},"test-hook":{"url":"/repos/:user/:repo/hooks/:id/test","method":"POST","params":{"$user":null,"$repo":null,"$id":null}},"delete-hook":{"url":"/repos/:user/:repo/hooks/:id","method":"DELETE","params":{"$user":null,"$repo":null,"$id":null}}},"user":{"get-from":{"url":"/users/:user","method":"GET","params":{"$user":null}},"get":{"url":"/user","method":"GET","params":{}},"update":{"url":"/user","method":"POST","params":{"name":{"type":"String","required":false,"validation":"","invalidmsg":"","description":""},"email":{"type":"String","required":false,"validation":"","invalidmsg":"","description":""},"blog":{"type":"String","required":false,"validation":"","invalidmsg":"","description":""},"company":{"type":"String","required":false,"validation":"","invalidmsg":"","description":""},"location":{"type":"String","required":false,"validation":"","invalidmsg":"","description":""},"hireable":{"type":"Boolean","required":false,"validation":"","invalidmsg":"","description":""},"bio":{"type":"String","required":false,"validation":"","invalidmsg":"","description":""}}},"get-orgs":{"url":"/user/orgs","method":"GET","params":{"$page":null,"$per_page":null}},"get-teams":{"url":"/user/teams","method":"GET","params":{"$page":null,"$per_page":null}},"get-emails":{"url":"/user/emails","method":"GET","params":{"$page":null,"$per_page":null}},"add-emails":{"url":"/user/emails","method":"POST","params":{}},"delete-emails":{"url":"/user/emails","method":"DELETE","params":{}},"get-followers":{"url":"/users/:user/followers","method":"GET","params":{"$user":null,"$page":null,"$per_page":null}},"get-following-from-user":{"url":"/users/:user/following","method":"GET","params":{"$user":null,"$page":null,"$per_page":null}},"get-following":{"url":"/user/following","method":"GET","params":{"$page":null,"$per_page":null}},"get-follow-user":{"url":"/user/following/:user","method":"GET","params":{"$user":null,"$page":null,"$per_page":null}},"follow-user":{"url":"/user/following/:user","method":"PUT","params":{"$user":null}},"un-follow-user":{"url":"/user/following/:user","method":"DELETE","params":{"$user":null}},"get-keys":{"url":"/user/keys","method":"GET","params":{"$page":null,"$per_page":null}},"get-keys-from-user":{"url":"/users/:user/keys","method":"GET","params":{"$user":null,"$page":null,"$per_page":null}},"get-key":{"url":"/user/keys/:id","method":"GET","params":{"$id":null}},"create-key":{"url":"/user/keys","method":"POST","params":{"$title":null,"$key":null}},"update-key":{"url":"/user/keys/:id","method":"POST","params":{"$id":null,"$title":null,"$key":null}},"delete-key":{"url":"/user/keys/:id","method":"DELETE","params":{"$id":null}}},"events":{"get":{"url":"/events","method":"GET","params":{"$page":null,"$per_page":null}},"get-from-repo":{"url":"/repos/:user/:repo/events","method":"GET","params":{"$user":null,"$repo":null,"$page":null,"$per_page":null}},"get-from-repo-issues":{"url":"/repos/:user/:repo/issues/events","method":"GET","params":{"$user":null,"$repo":null,"$page":null,"$per_page":null}},"get-from-repo-network":{"url":"/networks/:user/:repo/events","method":"GET","params":{"$user":null,"$repo":null,"$page":null,"$per_page":null}},"get-from-org":{"url":"/orgs/:org/events","method":"GET","params":{"$org":null,"$page":null,"$per_page":null}},"get-received":{"url":"/users/:user/received_events","method":"GET","params":{"$user":null,"$page":null,"$per_page":null}},"get-received-public":{"url":"/users/:user/received_events/public","method":"GET","params":{"$user":null,"$page":null,"$per_page":null}},"get-from-user":{"url":"/users/:user/events","method":"GET","params":{"$user":null,"$page":null,"$per_page":null}},"get-from-user-public":{"url":"/users/:user/events/public","method":"GET","params":{"$user":null,"$page":null,"$per_page":null}},"get-from-user-org":{"url":"/users/:user/events/orgs/:org","method":"GET","params":{"$user":null,"$org":null,"$page":null,"$per_page":null}}},"releases":{"list-releases":{"url":"/repos/:owner/:repo/releases","method":"GET","params":{"owner":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""},"$repo":null,"$page":null,"$per_page":null}},"get-release":{"url":"/repos/:owner/:repo/releases/:id","method":"GET","params":{"owner":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""},"id":{"type":"Number","required":true,"validation":"","invalidmsg":"","description":""},"$repo":null}},"create-release":{"url":"/repos/:owner/:repo/releases","method":"POST","params":{"owner":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""},"$repo":null,"tag_name":{"type":"String","required":true,"validation":"","invalidmsg":"","description":"String of the tag"},"target_commitish":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"Specifies the commitish value that determines where the Git tag is created from. Can be any branch or commit SHA. Unused if the Git tag already exists. Default: the repository's default branch (usually master)."},"name":{"type":"String","required":false,"validation":"","invalidmsg":"","description":""},"body":{"type":"String","required":false,"validation":"","invalidmsg":"","description":""},"draft":{"type":"Boolean","validation":"","invalidmsg":"","description":"true to create a draft (unpublished) release, false to create a published one. Default: false"},"prerelease":{"type":"Boolean","validation":"","invalidmsg":"","description":"true to identify the release as a prerelease. false to identify the release as a full release. Default: false"}}},"edit-release":{"url":"/repos/:owner/:repo/releases/:id","method":"POST","params":{"owner":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""},"id":{"type":"Number","required":true,"validation":"","invalidmsg":"","description":""},"$repo":null,"tag_name":{"type":"String","required":true,"validation":"","invalidmsg":"","description":"String of the tag"},"target_commitish":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"Specifies the commitish value that determines where the Git tag is created from. Can be any branch or commit SHA. Unused if the Git tag already exists. Default: the repository's default branch (usually master)."},"name":{"type":"String","required":false,"validation":"","invalidmsg":"","description":""},"body":{"type":"String","required":false,"validation":"","invalidmsg":"","description":""},"draft":{"type":"Boolean","required":false,"validation":"","invalidmsg":"","description":"true to create a draft (unpublished) release, false to create a published one. Default: false"},"prerelease":{"type":"Boolean","required":false,"validation":"","invalidmsg":"","description":"true to identify the release as a prerelease. false to identify the release as a full release. Default: false"}}},"delete-release":{"url":"/repos/:owner/:repo/releases/:id","method":"DELETE","params":{"owner":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""},"id":{"type":"Number","required":true,"validation":"","invalidmsg":"","description":""},"$repo":null}},"list-assets":{"url":"/repos/:owner/:repo/releases/:id/assets","method":"GET","params":{"owner":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""},"id":{"type":"Number","required":true,"validation":"","invalidmsg":"","description":""},"$repo":null}},"get-asset":{"url":"/repos/:owner/:repo/releases/assets/:id","method":"GET","params":{"owner":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""},"id":{"type":"Number","required":true,"validation":"","invalidmsg":"","description":""},"$repo":null}},"edit-asset":{"url":"/repos/:owner/:repo/releases/assets/:id","method":"POST","params":{"owner":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""},"id":{"type":"Number","required":true,"validation":"","invalidmsg":"","description":""},"$repo":null,"$name":null,"label":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"An alternate short description of the asset. Used in place of the filename."}}},"delete-asset":{"url":"/repos/:owner/:repo/releases/assets/:id","method":"DELETE","params":{"owner":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""},"id":{"type":"Number","required":true,"validation":"","invalidmsg":"","description":""},"$repo":null}}},"search":{"issues":{"url":"/search/issues","method":"GET","params":{"$q":null,"sort":{"type":"String","required":false,"validation":"^(comments|created|updated)$","invalidmsg":"comments, created, or updated","description":"comments, created, or updated"},"$order":null,"$page":null,"$per_page":null}},"repos":{"url":"/search/repositories","method":"GET","params":{"$q":null,"sort":{"type":"String","required":false,"validation":"^(stars|forks|updated)$","invalidmsg":"One of stars, forks, or updated. Default: results are sorted by best match.","description":"stars, forks, or updated"},"$order":null,"$page":null,"$per_page":null}},"users":{"url":"/search/users","method":"GET","params":{"$q":null,"sort":{"type":"String","required":false,"validation":"^(followers|repositories|joined)$","invalidmsg":"Can be followers, repositories, or joined. Default: results are sorted by best match.","description":"followers, repositories, or joined"},"$order":null,"$page":null,"$per_page":null}},"code":{"url":"/search/code","method":"GET","params":{"$q":null,"sort":{"type":"String","required":false,"validation":"^(indexed)$","invalidmsg":"The sort field. Can only be indexed, which indicates how recently a file has been indexed by the GitHub search infrastructure. Default: results are sorted by best match.","description":"The sort field. Can only be indexed, which indicates how recently a file has been indexed by the GitHub search infrastructure. Default: results are sorted by best match."},"$order":null,"$page":null,"$per_page":null}},"email":{"url":"/legacy/user/email/:email","method":"GET","params":{"email":{"type":"String","required":true,"validation":"","invalidmsg":"","description":"Email address"}}}},"markdown":{"render":{"url":"/markdown","method":"POST","params":{"text":{"type":"String","required":true,"validation":"","invalidmsg":"","description":"The Markdown text to render"},"mode":{"type":"String","required":false,"validation":"^(markdown|gfm)$","invalidmsg":"","description":"The rendering mode, `markdown` to render a document as plain Markdown, just like README files are rendered. `gfm` to render a document as user-content, e.g. like user comments or issues are rendered. In GFM mode, hard line breaks are always taken into account, and issue and user mentions are linked accordingly."},"context":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"The repository context, only taken into account when rendering as `gfm`"}}}},"gitignore":{"templates":{"url":"/gitignore/templates","method":"GET","params":{}},"template":{"url":"/gitignore/templates/:name","method":"GET","params":{"name":{"type":"String","required":true,"validation":"","invalidmsg":"","description":"The name of the .gitignore template to get"}}}},"misc":{"emojis":{"url":"/emojis","method":"GET","params":{}},"meta":{"url":"/meta","method":"GET","params":{}},"rate-limit":{"url":"/rate_limit","method":"GET","params":{}}},"notifications":{"get-all":{"url":"/notifications","method":"GET","params":{"all":{"type":"Boolean","required":false,"validation":"","invalidmsg":"","description":"If true, show notifications marked as read. Default: false"},"participating":{"type":"Boolean","required":false,"validation":"","invalidmsg":"","description":"If true, only shows notifications in which the user is directly participating or mentioned. Default: false"},"$since":null}},"mark-as-read":{"url":"/notifications","method":"PUT","params":{"last_read_at":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"Describes the last point that notifications were checked. Anything updated since this time will not be updated. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ. Default: Time.now"}}}},"defines":{"constants":{"name":"Github","description":"A Node.JS module, which provides an object oriented wrapper for the GitHub v3 API.","protocol":"https","host":"api.github.com","port":443,"dateFormat":"YYYY-MM-DDTHH:MM:SSZ","requestFormat":"json","requestMedia":"application/vnd.github.beta+json"},"response-headers":["X-RateLimit-Limit","X-RateLimit-Remaining","X-RateLimit-Reset","X-Oauth-Scopes","X-Poll-Interval","Link","Location","Last-Modified","Etag","Status"],"request-headers":["If-Modified-Since","If-None-Match","Cookie","User-Agent","Accept","X-GitHub-OTP"],"params":{"files":{"type":"Json","required":true,"validation":"","invalidmsg":"","description":"Files that make up this gist. The key of which should be a required string filename and the value another required hash with parameters: 'content'"},"user":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""},"org":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""},"repo":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""},"branch":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""},"sha":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""},"description":{"type":"String","required":false,"validation":"","invalidmsg":"","description":""},"id":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""},"gist_id":{"type":"String","required":true,"validation":"","invalidmsg":"","description":"Id (SHA1 hash) of the gist."},"ref":{"type":"String","required":true,"validation":"","invalidmsg":"","description":"String of the name of the fully qualified reference (ie: heads/master). If it doesn’t have at least one slash, it will be rejected."},"number":{"type":"Number","required":true,"validation":"^[0-9]+$","invalidmsg":"","description":""},"name":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""},"direction":{"type":"String","required":false,"validation":"^(asc|desc)$","invalidmsg":"asc or desc, default: desc.","description":""},"since":{"type":"Date","required":false,"validation":"","invalidmsg":"","description":"Timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ"},"until":{"type":"Date","required":false,"validation":"","invalidmsg":"","description":"Timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ"},"state":{"type":"String","required":false,"validation":"^(open|closed)$","invalidmsg":"open, closed, default: open","description":""},"color":{"type":"String","required":true,"validation":"","invalidmsg":"6 character hex code, without a leading #.","description":"6 character hex code, without a leading #."},"permission":{"type":"String","required":false,"validation":"^(pull|push|admin)$","invalidmsg":"","description":"`pull` - team members can pull, but not push or administer this repositories (Default), `push` - team members can pull and push, but not administer this repositores, `admin` - team members can pull, push and administer these repositories."},"base":{"type":"String","required":true,"validation":"","invalidmsg":"","description":"The branch (or git ref) you want your changes pulled into. This should be an existing branch on the current repository. You cannot submit a pull request to one repo that requests a merge to a base of another repo."},"head":{"type":"String","required":true,"validation":"","invalidmsg":"","description":"The branch (or git ref) where your changes are implemented."},"commit_id":{"type":"String","required":true,"validation":"","invalidmsg":"Sha of the commit to comment on.","description":"Sha of the commit to comment on."},"line":{"type":"Number","required":true,"validation":"","invalidmsg":"Line index in the diff to comment on.","description":"Line index in the diff to comment on."},"path":{"type":"String","required":true,"validation":"","invalidmsg":"Relative path of the file to comment on.","description":"Relative path of the file to comment on."},"position":{"type":"Number","required":true,"validation":"","invalidmsg":"Column index in the diff to comment on.","description":"Column index in the diff to comment on."},"body":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""},"homepage":{"type":"String","required":false,"validation":"","invalidmsg":"","description":""},"private":{"type":"Boolean","required":false,"validation":"","invalidmsg":"","description":"True to create a private repository, false to create a public one. Creating private repositories requires a paid GitHub account. Default is false."},"has_issues":{"type":"Boolean","required":false,"validation":"","invalidmsg":"","description":"True to enable issues for this repository, false to disable them. Default is true."},"has_wiki":{"type":"Boolean","required":false,"validation":"","invalidmsg":"","description":"True to enable the wiki for this repository, false to disable it. Default is true."},"has_downloads":{"type":"Boolean","required":false,"validation":"","invalidmsg":"","description":"True to enable downloads for this repository, false to disable them. Default is true."},"default_branch":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"Updates the default branch for this repository."},"collabuser":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""},"title":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""},"key":{"type":"String","required":true,"validation":"","invalidmsg":"","description":""},"page":{"type":"Number","required":false,"validation":"^[0-9]+$","invalidmsg":"","description":"Page number of the results to fetch."},"per_page":{"type":"Number","required":false,"validation":"^[0-9]+$","invalidmsg":"","description":"A custom page size up to 100. Default is 30."},"scopes":{"type":"Array","required":false,"validation":"","invalidmsg":"","description":"A list of scopes that this authorization is in."},"note":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"A note to remind you what the OAuth token is for."},"note_url":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"A URL to remind you what app the OAuth token is for."},"auto_init":{"type":"Boolean","required":false,"validation":"","invalidmsg":"","description":"True to create an initial commit with empty README. Default is false"},"gitignore_template":{"type":"String","required":false,"validation":"","invalidmsg":"","description":"Desired language or platform .gitignore template to apply. Ignored if auto_init parameter is not provided."},"content":{"type":"String","required":false,"validation":"","invalidmsg":"","description":""},"message":{"type":"String","required":false,"validation":"","invalidmsg":"","description":""},"order":{"type":"String","required":false,"validation":"^(asc|desc)$","invalidmsg":"The sort order if sort parameter is provided. One of asc or desc. Default: desc","description":"asc or desc"},"q":{"type":"String","required":true,"validation":"","invalidmsg":"","description":"Search Term","combined":true}}}};
    };

    var proto = {
        sendError: function (err, block, msg, callback) {
            if (this.client.debug) {
                util.log(err, block, msg.user, 'error');
            }
            if (typeof err === 'string') {
                util.error(err);
            }
            if(callback){
                callback(err);
            }
        }
    };

    proto.gists = gists;

    proto.gitdata = gitdata;

    proto.issues = issues;

    proto.authorization = authorization;

    proto.orgs = orgs;

    proto.statuses = statuses;

    proto.pullRequests = pullRequests;

    proto.repos = repos;

    proto.user = user;

    proto.events = events;

    proto.releases = releases;

    proto.search = search;

    proto.markdown = markdown;

    proto.gitignore = gitignore;

    proto.misc = misc;

    proto.notifications = notifications;

    GithubHandler.prototype = proto;


    var Github = function (config) {
        config = config || {};
        this.config = config;
        this.debug = config.debug;

        this.api = new GithubHandler(this);

        this.setupRoutes();
    };

    Github.prototype.setupRoutes = function () {
        var self = this;
        var api = this.api;
        var routes = api.routes;
        var defines = routes.defines;
        this.constants = defines.constants;
        this.requestHeaders = defines['request-headers'].map(function (header) {
            return header.toLowerCase();
        });
        delete routes.defines;

        function trim(s) {
            if (typeof s === 'string') {
                s = s.replace(/^[\s\t\r\n]+/, '').replace(/[\s\t\r\n]+$/, '');
            }
            return s;
        }

        function parseParams(msg, paramsStruct) {
            var params = Object.keys(paramsStruct);
            var paramName, def, value, type;
            for (var i = 0, l = params.length; i < l; i = i + 1) {
                paramName = params[i];
                if (paramName.charAt(0) === '$') {
                    paramName = paramName.substr(1);
                    if (!defines.params[paramName]) {
                        throw('Invalid variable parameter name substitution; param "' +
                            paramName + '" not found in defines block');
                    } else {
                        def = defines.params[paramName];
                    }
                } else {
                    def = paramsStruct[paramName];
                }

                value = trim(msg[paramName]);
                if (typeof value !== 'boolean' && !value) {
                    // we don't need to validation for undefined parameter values
                    // that are not required.
                    if (def.required) {
                        throw('Empty value for parameter "' + paramName + '": ' + value);
                    } else {
                        continue;
                    }
                }

                // validate the value and type of parameter:
                if (def.validation) {
                    if (!new RegExp(def.validation).test(value)) {
                        throw('Invalid value for parameter "' + paramName + '": ' + value);
                    }
                }

                if (def.type) {
                    type = def.type.toLowerCase();
                    if (type === 'number') {
                        value = parseInt(value, 10);
                        if (isNaN(value)) {
                            throw('Invalid value for parameter "' + paramName + '": ' + msg[paramName] + ' is NaN');
                        }
                    } else if (type === 'float') {
                        value = parseFloat(value);
                        if (isNaN(value)) {
                            util.error('Invalid value for parameter "' + paramName + '": ' + msg[paramName] + ' is NaN');
                        }
                    } else if (type === 'json') {
                        if (typeof value === 'string') {
                            try {
                                value = JSON.parse(value);
                            } catch (ex) {
                                util.error('JSON parse error of value for parameter "' + paramName + '": ' + value);
                                throw ex;
                            }
                        }
                    } else if (type === 'date') {
                        value = new Date(value);
                    }
                }
                msg[paramName] = value;
            }
        }

        function prepareApi(struct, baseType) {
            baseType = baseType || '';

            Object.keys(struct).forEach(function (routePart) {
                var block = struct[routePart];
                if (!block) {
                    return;
                }
                var messageType = baseType + '/' + routePart;
                if (block.url && block.params) {
                    // we ended up at an API definition part!
                    var endPoint = messageType.replace(/^[\/]+/g, '');
                    var parts = messageType.split('/');
                    var section = util.toCamelCase(parts[1].toLowerCase());
                    parts.splice(0, 2);
                    var funcName = util.toCamelCase(parts.join('-'));

                    if (!api[section]) {
                        util.error('Unsupported route section, not implemented in version ' +
                            self.version + ' for route "' + endPoint + '" and block: ', block);
                    }

                    if (!api[section][funcName]) {
                        if (self.debug) {
                            util.log('Tried to call ' + funcName);
                        }
                        util.error('Unsupported route, not implemented in version ' +
                            self.version + ' for route "' + endPoint + '" and block: ', block);
                    }

                    if (!self[section]) {
                        self[section] = {};
                        // add a utility function 'getFooApi()', which returns the
                        // section to which functions are attached.
                        self[util.toCamelCase('get-' + section + '-api')] = function () {
                            return self[section];
                        };
                    }

                    self[section][funcName] = function (msg, callback) {
                        try {
                            parseParams(msg, block.params);
                        } catch (ex) {
                            // when the message was sent to the client, we can
                            // reply with the error directly.
                            api.sendError(ex, block, msg, callback);
                            if (self.debug) {
                                util.log(ex.message);
                            }
                            // on error, there's no need to continue.
                            return;
                        }

                        api[section][funcName].call(api, msg, block, callback);
                    };
                } else {
                    // recurse into this block next:
                    prepareApi(block, messageType);
                }
            });
        }

        prepareApi(routes);
        routes.defines = defines;
    };

    Github.prototype.authenticate = function (authConfig) {
        if (!authConfig) {
            util.info('Continuing without authentication');
            this.auth = false;
            return;
        }

        this.auth = authConfig;
        switch(authConfig.type){
        case 'basic':
            if (!authConfig.username || !authConfig.password) {
                util.error('Basic authentication requires both a username and password to be set');
                util.info('Continuing without authentication');
                this.auth = false;
            }
            break;
        case 'oauth':
            if (!authConfig.token) {
                util.error('OAuth2 authentication requires a token to be set');
                util.info('Continuing without authentication');
                this.auth = false;
            }
            break;
        case 'token':
            if (!authConfig.token) {
                util.error('OAuth2 authentication requires a token to be set');
                util.info('Continuing without authentication');
                this.auth = false;
            }
            break;
        default:
            util.error('Invalid authentication type, must be "basic", "oauth" or "token"');
            util.info('Continuing without authentication');
            this.auth = false;
        }
    };

    function _getPageLinks(link) {
        if (typeof link === 'object' && (link.link || link.meta.link)) {
            link = link.link || link.meta.link;
        }

        var links = {
            next: null,
            prev: null,
            first: null,
            last: null
        };
        if (typeof link !== 'string') {
            return links;
        }

        // link format:
        // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
        link.replace(/<([^>]*)>;\s*rel="([\w]*)\"/g, function (m, uri, type) {
            links[type] = uri;
        });
        return links;
    }

    Github.prototype.hasNextPage = function (link) {
        return _getPageLinks(link).next ? true : false;
    };

    Github.prototype.hasPreviousPage = function (link) {
        return _getPageLinks(link).prev ? true : false;
    };

    Github.prototype.hasLastPage = function (link) {
        return _getPageLinks(link).last ? true : false;
    };

    Github.prototype.hasFirstPage = function (link) {
        return _getPageLinks(link).first ? true : false;
    };

    function _getPage(link, which, callback, client) {
        var url = _getPageLinks(link)[which];
        if (!url) {
            util.error('No ' + which + ' page found');
        } else {
            var api = client.api;
            client.httpSendForGetPage(url, function (err, res) {
                if (err) {
                    return api.sendError(err, null, url, callback);
                }

                var ret;
                try {
                    ret = res.data && JSON.parse(res.data);
                } catch (ex) {
                    if (callback) {
                        util.error(ex.message, res);
                    }
                    return;
                }

                if (!ret) {
                    ret = {};
                }
                if (!ret.meta) {
                    ret.meta = {};
                }
                ['x-ratelimit-limit', 'x-ratelimit-remaining', 'link'].forEach(function (header) {
                    if (res.headers[header]) {
                        ret.meta[header] = res.headers[header];
                    }
                });

                if (callback) {
                    callback(null, ret);
                }
            });
        }

    }

    Github.prototype.httpSendForGetPage = function (url, callback) {
        var self = this;
        var headers = [];
        headers['content-type'] = 'application/json; charset=utf-8';
        if (this.auth) {
            switch (this.auth.type) {
            case 'oauth':
                url += (url.indexOf('?') === -1 ? '?' : '&') +
                    'access_token=' + encodeURIComponent(this.auth.token);
                break;
            case 'token':
                headers.authorization = 'token ' + this.auth.token;
                break;
            default:
                break;
            }
        }

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        Object.keys(headers).forEach(function (header) {
            xhr.setRequestHeader(header, headers[header]);
        });
        xhr.onreadystatechange = function () {
            if (self.debug) {
                util.log('STATUS: ' + xhr.status);
            }
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    var res = {
                        headers: {},
                        data: null
                    };
                    var headersSplit = xhr.getAllResponseHeaders().split('\n');
                    for (var i = 0, length = headersSplit.length; i < length; i = i + 1) {
                        var header = headersSplit[i];
                        if (header !== '' && header.indexOf(':') !== -1) {
                            var dividerIndex = header.indexOf(':');
                            var key = header.substring(0, dividerIndex).trim().toLowerCase();
                            res.headers[key] = header.substring(dividerIndex + 1).trim();
                        }
                    }
                    res.data = xhr.responseText;
                    callbackCalled = true;
                    callback(null, res);
                } else if (!callbackCalled && xhr.status >= 400 && xhr.status < 600 || xhr.status < 10) {
                    util.error(xhr.status, xhr.responseText); //TODO use HttpError instead
                }
            }
        };
        xhr.send();
    };

    Github.prototype.getNextPage = function (link, callback) {
        _getPage(link, 'next', callback, this);
    };

    Github.prototype.getPreviousPage = function (link, callback) {
        _getPage(link, 'prev', callback, this);
    };

    Github.prototype.getLastPage = function (link, callback) {
        _getPage(link, 'last', callback, this);
    };

    Github.prototype.getFirstPage = function (link, callback) {
        _getPage(link, 'first', callback, this);
    };

    function _getQueryAndUrl(msg, def, format) {
        var ret = {
            url: def.url,
            query: format === 'json' ? {} : []
        };
        if (!def || !def.params) {
            return ret;
        }
        var url = def.url;
        Object.keys(def.params).forEach(function (paramName) {
            paramName = paramName.replace(/^[$]+/, '');
            if (!(paramName in msg)) {
                return;
            }

            var isUrlParam = url.indexOf(':' + paramName) !== -1;
            var valFormat = isUrlParam || format !== 'json' ? 'query' : format;
            var val;
            if (valFormat !== 'json' && typeof msg[paramName] === 'object') {
                try {
                    msg[paramName] = JSON.stringify(msg[paramName]);
                    val = encodeURIComponent(msg[paramName]);
                } catch (ex) {
                    util.error('httpSend: Error while converting object to JSON: ' + (ex.message || ex));
                }
            } else {
                val = valFormat === 'json' ? msg[paramName] : encodeURIComponent(msg[paramName]);
            }

            if (isUrlParam) {
                url = url.replace(':' + paramName, val);
            } else {
                if (format === 'json') {
                    ret.query[paramName] = val;
                } else {
                    ret.query.push(paramName + '=' + val);
                }
            }
        });
        ret.url = url;
        return ret;
    }

    Github.prototype.httpSend = function (msg, block, callback) {
        var self = this;
        var method = block.method.toLowerCase();
        var hasBody = ('head|get|delete'.indexOf(method) === -1);
        var format = hasBody && this.constants.requestFormat ? this.constants.requestFormat : 'query';
        var obj = _getQueryAndUrl(msg, block, format);
        var query = obj.query;
        var protocol = this.config.protocol || this.constants.protocol || 'http';
        var host = this.config.host || this.constants.host;
        var pathPrefix = protocol + '://' + host;
        var url = this.config.url ? pathPrefix + this.config.url + obj.url : pathPrefix + obj.url;

        var path = (!hasBody && query.length) ? url + '?' + query.join('&') : url;
        var headers = {};
        if (hasBody) {
            if (format === 'json') {
                query = JSON.stringify(query);
            } else {
                query = query.join('&');
            }
            headers['content-type'] = format === 'json' ? 'application/json; charset=utf-8' : 'application/x-www-form-urlencoded; charset=utf-8';
        }
        if (this.auth) {
            switch (this.auth.type) {
            case 'oauth':
                path += (path.indexOf('?') === -1 ? '?' : '&') +
                    'access_token=' + encodeURIComponent(this.auth.token);
                break;
            case 'token':
                headers.authorization = 'token ' + this.auth.token;
                break;
            default:
                break;
            }
        }

        if (!msg.headers) {
            msg.headers = {};
        }
        Object.keys(msg.headers).forEach(function (header) {
            var headerLC = header.toLowerCase();
            //disabled because it overrides also the 'accept' header
//      if (self.requestHeaders.indexOf(headerLC) === -1) {
//        return;
//      }
            headers[headerLC] = msg.headers[header];
        });

        if (this.debug) {
            util.log('REQUEST');
        }

        var xhr = new XMLHttpRequest();
        xhr.open(method, path, true);
        Object.keys(headers).forEach(function (header) {
            xhr.setRequestHeader(header, headers[header]);
        });
        xhr.onreadystatechange = function () {
            if (self.debug) {
                util.log('STATUS: ' + xhr.status);
            }
            if (xhr.readyState === 4) {
                //If using header 'If-None-Match' github returns 304 'Not modified' header
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                    var res = {
                        headers: {},
                        data: null
                    };
                    var headersSplit = xhr.getAllResponseHeaders().split('\n');
                    for (var i = 0, length = headersSplit.length; i < length; i = i + 1) {
                        var header = headersSplit[i];
                        if (header !== '' && header.indexOf(':') !== -1) {
                            var dividerIndex = header.indexOf(':');
                            var key = header.substring(0, dividerIndex).trim().toLowerCase();
                            res.headers[key] = header.substring(dividerIndex + 1).trim();
                        }
                    }
                    res.data = xhr.responseText || false;
                    callback(null, res);
                } else if (xhr.status >= 400 && xhr.status < 600 || xhr.status < 10) {
                    util.error(method, path, query, xhr.responseText); //TODO use HttpError instead
                    callback(new HttpError(xhr.responseText, xhr.status, xhr), null);
                }
            }
        };
        xhr.send(hasBody ? query : null);
    };

    if ( typeof define === 'function' && define.amd ) {
        define(function() {
            return Github;
        });
    } else {
        root.Github = Github;
    }

}(this));
