/*global URL*/
(function(root){

<%= util %>

<%= httpError %>

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

<%= api %>


    var GithubHandler = function (client) {
        this.client = client;
        this.routes = <%= routes %>;
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
<% sections.forEach(function(section){%>
    proto.<%= section %> = <%= section %>;
<%});%>
    GithubHandler.prototype = proto;


<%= github %>
}(this));
