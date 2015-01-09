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
