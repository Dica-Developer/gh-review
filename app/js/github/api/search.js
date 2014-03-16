/*global define*/
define(function () {
  'use strict';
  /**
   *  mixin search
   *
   *  Copyright 2012 Cloud9 IDE, Inc.
   *
   *  This product includes software developed by
   *  Cloud9 IDE, Inc (http://c9.io).
   *
   *  Author: Mike de Boer <info@mikedeboer.nl>
   **/

  var search = {
    search: {}
  };

  (function () {
    /** section: github
     *  search#issues(msg, callback) -> null
     *      - msg (Object): Object that contains the parameters and their values to be sent to the server.
     *      - callback (Function): function to call when the request is finished with an error as first argument and result data as second argument.
     *
     *  ##### Params on the `msg` object:
     *
     *  - headers (Object): Optional. Key/ value pair of request headers to pass along with the HTTP request. Valid headers are: 'If-Modified-Since', 'If-None-Match', 'Cookie', 'User-Agent'.
     *  - user (String): Required.
     *  - repo (String): Required.
     *  - state (String): Required. open or closed Validation rule: ` ^(open|closed)$ `.
     *  - keyword (String): Required. Search term
     **/
    this.issues = function (msg, block, callback) {
      var self = this;
      this.client.httpSend(msg, block, function (err, res) {
        if (err) {
          return self.sendError(err, null, msg);
        }

        var ret;
        try {
          ret = res.data && JSON.parse(res.data);
        } catch (ex) {
          console.error(ex.message, res);
          return;
        }

        if (!ret) {
          ret = {};
        }
        if (!ret.meta) {
          ret.meta = {};
        }
        ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-oauth-scopes', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function (header) {
          if (res.headers[header]) {
            ret.meta[header] = res.headers[header];
          }
        });

        if (callback) {
          callback(null, ret);
        }
      });
    };

    /** section: github
     *  search#repos(msg, callback) -> null
     *      - msg (Object): Object that contains the parameters and their values to be sent to the server.
     *      - callback (Function): function to call when the request is finished with an error as first argument and result data as second argument.
     *
     *  ##### Params on the `msg` object:
     *
     *  - headers (Object): Optional. Key/ value pair of request headers to pass along with the HTTP request. Valid headers are: 'If-Modified-Since', 'If-None-Match', 'Cookie', 'User-Agent'.
     *  - keyword (String): Required. Search term
     *  - language (String): Optional. Filter results by language, see https://github.com/languages
     *  - start_page (Number): Optional. Page number to fetch Validation rule: ` ^[0-9]+$ `.
     **/
    this.repos = function (msg, block, callback) {
      var self = this;
      this.client.httpSend(msg, block, function (err, res) {
        if (err) {
          return self.sendError(err, null, msg);
        }

        var ret;
        try {
          ret = res.data && JSON.parse(res.data);
        } catch (ex) {
          console.error(ex.message, res);
          return;
        }

        if (!ret) {
          ret = {};
        }
        if (!ret.meta) {
          ret.meta = {};
        }
        ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-oauth-scopes', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function (header) {
          if (res.headers[header]) {
            ret.meta[header] = res.headers[header];
          }
        });

        if (callback) {
          callback(null, ret);
        }
      });
    };

    /** section: github
     *  search#users(msg, callback) -> null
     *      - msg (Object): Object that contains the parameters and their values to be sent to the server.
     *      - callback (Function): function to call when the request is finished with an error as first argument and result data as second argument.
     *
     *  ##### Params on the `msg` object:
     *
     *  - headers (Object): Optional. Key/ value pair of request headers to pass along with the HTTP request. Valid headers are: 'If-Modified-Since', 'If-None-Match', 'Cookie', 'User-Agent'.
     *  - keyword (String): Required. Keyword search parameters
     *  - start_page (Number): Optional. Page number to fetch Validation rule: ` ^[0-9]+$ `.
     **/
    this.users = function (msg, block, callback) {
      var self = this;
      this.client.httpSend(msg, block, function (err, res) {
        if (err) {
          return self.sendError(err, null, msg);
        }

        var ret;
        try {
          ret = res.data && JSON.parse(res.data);
        } catch (ex) {
          console.error(ex.message, res);
          return;
        }

        if (!ret) {
          ret = {};
        }
        if (!ret.meta) {
          ret.meta = {};
        }
        ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-oauth-scopes', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function (header) {
          if (res.headers[header]) {
            ret.meta[header] = res.headers[header];
          }
        });

        if (callback) {
          callback(null, ret);
        }
      });
    };

    /** section: github
     *  search#email(msg, callback) -> null
     *      - msg (Object): Object that contains the parameters and their values to be sent to the server.
     *      - callback (Function): function to call when the request is finished with an error as first argument and result data as second argument.
     *
     *  ##### Params on the `msg` object:
     *
     *  - headers (Object): Optional. Key/ value pair of request headers to pass along with the HTTP request. Valid headers are: 'If-Modified-Since', 'If-None-Match', 'Cookie', 'User-Agent'.
     *  - email (String): Required. Email address
     **/
    this.email = function (msg, block, callback) {
      var self = this;
      this.client.httpSend(msg, block, function (err, res) {
        if (err) {
          return self.sendError(err, null, msg);
        }

        var ret;
        try {
          ret = res.data && JSON.parse(res.data);
        } catch (ex) {
          console.error(ex.message, res);
          return;
        }

        if (!ret) {
          ret = {};
        }
        if (!ret.meta) {
          ret.meta = {};
        }
        ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-oauth-scopes', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function (header) {
          if (res.headers[header]) {
            ret.meta[header] = res.headers[header];
          }
        });

        if (callback) {
          callback(null, ret);
        }
      });
    };

    /** section: github
     *  search#code(msg, callback) -> null
     *      - msg (Object): Object that contains the parameters and their values to be sent to the server.
     *      - callback (Function): function to call when the request is finished with an error as first argument and result data as second argument.
     *
     *  ##### Params on the `msg` object:
     *
     *  - headers (Object): Optional. Key/ value pair of request headers to pass along with the HTTP request. Valid headers are: 'If-Modified-Since', 'If-None-Match', 'Cookie', 'User-Agent'.
     *  - q (String): Required. Keyword search parameters
     *  - sort (String): Optional. The sort field. Can only be indexed, which indicates how recently a file has been indexed by the GitHub search infrastructure. Default: results are sorted by best match.
     *  - order (String): Optional. The sort order if sort parameter is provided. One of asc or desc. Default: desc
     **/
    this.code = function (msg, block, callback) {
      var self = this;
      this.client.httpSend(msg, block, function (err, res) {
        if (err) {
          return self.sendError(err, null, msg);
        }

        var ret;
        try {
          ret = res.data && JSON.parse(res.data);
        } catch (ex) {
          console.error(ex.message, res);
          return;
        }

        if (!ret) {
          ret = {};
        }
        if (!ret.meta) {
          ret.meta = {};
        }
        ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-oauth-scopes', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function (header) {
          if (res.headers[header]) {
            ret.meta[header] = res.headers[header];
          }
        });

        if (callback) {
          callback(null, ret);
        }
      });
    };

  }).call(search.search);
  return search;
});
