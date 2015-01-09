# github-js

## Rewrite of [Mike de Boer](https://github.com/mikedeboer)'s fantastic [node-github](https://github.com/mikedeboer/node-github) to work in browser

## Installation

  Install via git clone:
```shell
$ git clone git://github.com/JayGray/node-github.git
$ cd node-github
```

## Documentation

You can find the docs for the API of this client at [http://mikedeboer.github.com/node-github/](http://mikedeboer.github.com/node-github/)

Additionally, the [official Github documentation](http://developer.github.com/)
is a very useful resource.

## Example

Print all followers of the user "mikedeboer" to the console.
```javascript
var GitHubApi = require("github");

var github = new GitHubApi({
    debug: true,
    protocol: "https",
    host: "github.my-GHE-enabled-company.com",
    pathPrefix: "/api/v3", // for some GHEs
    timeout: 5000
});
github.user.getFollowingFromUser({
    // optional:
    // headers: {
    //     "cookie": "blahblah"
    // },
    user: "mikedeboer"
}, function(err, res) {
    console.log(JSON.stringify(res));
});
```

First the _GitHubApi_ class is imported from the _node-github_ module. This class provides
access to all of GitHub's APIs (e.g. user, issues or repo APIs). The _getFollowingFromUser_
method lists all followers of a given GitHub user. Is is part of the user API. It
takes the user name as first argument and a callback as last argument. Once the
follower list is returned from the server, the callback is called.

Like in Node.JS, callbacks are always the last argument. If the functions fails an
error object is passed as first argument to the callback.

## Authentication

Most GitHub API calls don't require authentication. As a rule of thumb: If you
can see the information by visiting the site without being logged in, you don't
have to be authenticated to retrieve the same information through the API. Of
course calls, which change data or read sensitive information have to be authenticated.

You need the GitHub user name and the API key for authentication. The API key can
be found in the user's _Account Settings_ page.

This example shows how to authenticate and then change _location_ field of the
account settings to _Argentina_:
```javascript
github.authenticate({
    type: "basic",
    username: username,
    password: password
});
github.user.update({
    location: "Argentina"
}, function(err) {
    console.log("done!");
});
```
Note that the _authenticate_ method is synchronous because it only stores the
credentials for the next request.

Other examples for the various authentication methods:
```javascript
// OAuth2
github.authenticate({
    type: "oauth",
    token: token
});

// Deprecated Gihub API token (seems not to be working with the v3 API)
github.authenticate({
    type: "token",
    token: token
});
```

### Creating tokens for your application
[Create a new authorization](http://developer.github.com/v3/oauth/#create-a-new-authorization) for your application giving it access to the wanted scopes you need instead of relying on username / password and is the way to go if you have [two-factor authentication](https://github.com/blog/1614-two-factor-authentication) on.

For example:

1. Use github.authenticate() to auth with GitHub using your username / password
2. Create an application token programmatically with the scopes you need and, if you use two-factor authentication send the `X-GitHub-OTP` header with the one-time-password you get on your token device.

```javascript

github.authorization.create({
    scopes: ["user", "public_repo", "repo", "repo:status", "gist"],
    note: "what this auth is for",
    note_url: "http://url-to-this-auth-app",
    headers: {
        "X-GitHub-OTP": "two-factor-code"
    }
}, function(err, res) {
    if (res.token) {
        //save and use res.token as in the Oauth process above from now on
    }
});

```
### For Developers

Client can load any version of the [[github]] client API, with the
requirement that a valid routes.json definition file is present in the
`api/[VERSION]` directory and that the routes found in this file are
implemented as well.

Upon instantiation of the {@link Client} class, the routes.json file is loaded
from the API version specified in the configuration and, parsed and from it
the routes for HTTP requests are extracted. For each HTTP endpoint to the
HTTP server, a method is generated which accepts a Javascript Object
with parameters and an optional callback to be invoked when the API request
returns from the server or when the parameters could not be validated.

When an HTTP endpoint is processed and a method is generated as described
above, {@link Client} also sets up parameter validation with the rules as
defined in the routes.json. A full example that illustrates how this works
is shown below:

First, we look at a listing of a sample routes.json routes definition file:
```javascript
   {
       "defines": {
           "constants": {
               "name": "Github",
               "description": "A Node.JS module, which provides an object oriented wrapper for the GitHub v3 API.",
               "protocol": "https",
               "host": "api.github.com",
               "port": 443,
               "dateFormat": "YYYY-MM-DDTHH:MM:SSZ",
               "requestFormat": "json"
           },
           "response-headers": [
               "X-RateLimit-Limit",
               "X-RateLimit-Remaining",
               "Link"
           ],
           "params": {
               "files": {
                   "type": "Json",
                   "required": true,
                   "validation": "",
                   "invalidmsg": "",
                   "description": "Files that make up this gist. The key of which should be a required string filename and the value another required hash with parameters: 'content'"
               },
               "user": {
                   "type": "String",
                   "required": true,
                   "validation": "",
                   "invalidmsg": "",
                   "description": ""
               },
               "description": {
                   "type": "String",
                   "required": false,
                   "validation": "",
                   "invalidmsg": "",
                   "description": ""
               },
               "page": {
                   "type": "Number",
                   "required": false,
                   "validation": "^[0-9]+$",
                   "invalidmsg": "",
                   "description": "Page number of the results to fetch."
               },
               "per_page": {
                   "type": "Number",
                   "required": false,
                   "validation": "^[0-9]+$",
                   "invalidmsg": "",
                   "description": "A custom page size up to 100. Default is 30."
               }
           }
       },

       "gists": {
           "get-from-user": {
               "url": ":user/gists",
               "method": "GET",
               "params": {
                   "$user": null,
                   "$page": null,
                   "$per_page": null
               }
           },

           "create": {
               "url": "/gists",
               "method": "POST",
               "params": {
                   "$description": null,
                   "public": {
                       "type": "Boolean",
                       "required": true,
                       "validation": "",
                       "invalidmsg": "",
                       "description": ""
                   },
                   "$files": null
               }
           }
       }
    }
```

You probably noticed that the definition is quite verbose and the decision
for its design was made to be verbose whilst still allowing for basic variable
definitions and substitions for request parameters.

There are two sections; 'defines' and 'gists' in this example.

The `defines` section contains a list of `constants` that will be used by the
[[Client]] to make requests to the right URL that hosts the API.
The `gists` section defines the endpoints for calls to the API server, for
gists specifically in this example, but the other API sections are defined in
the exact same way.
These definitions are parsed and methods are created that the client can call
to make an HTTP request to the server.
there is one endpoint defined: .
In this example, the endpoint `gists/get-from-user` will be exposed as a member
on the [[Client]] object and may be invoked with

```javascript
   client.getFromUser({
       "user": "bob"
   }, function(err, ret) {
       // do something with the result here.
   });

   // or to fetch a specfic page:
   client.getFromUser({
       "user": "bob",
       "page": 2,
       "per_page": 100
   }, function(err, ret) {
       // do something with the result here.
   });
```

All the parameters as specified in the Object that is passed to the function
as first argument, will be validated according to the rules in the `params`
block of the route definition.
Thus, in the case of the `user` parameter, according to the definition in
the `params` block, it's a variable that first needs to be looked up in the
`params` block of the `defines` section (at the top of the JSON file). Params
that start with a `$` sign will be substituted with the param with the same
name from the `defines/params` section.
There we see that it is a required parameter (needs to hold a value). In other
words, if the validation requirements are not met, an HTTP error is passed as
first argument of the callback.

Implementation Notes: the `method` is NOT case sensitive, whereas `url` is.
The `url` parameter also supports denoting parameters inside it as follows:

```javascript
   "get-from-user": {
       "url": ":user/gists",
       "method": "GET"
       ...
   }
```

## Implemented GitHub APIs

* Gists: 100%
* Git Data: 100%
* Issues: 100%
* Orgs: 100%
* Pull Requests: 100%
* Repos: 100%
* Users: 100%
* Events: 100%
* Search: 100%
* Markdown: 100%

## Running the Tests

The unit tests are based on the [mocha](http://visionmedia.github.com/mocha/)
module, which may be installed via npm. To run the tests make sure that the
npm dependencies are installed by running `npm install` from the project directory.

Before running unit tests:
```shell
npm install mocha -g
```
At the moment, test classes can only be run separately. This will e.g. run the Issues Api test:
```shell
mocha api/v3.0.0/issuesTest.js
```
Note that a connection to the internet is required to run the tests.

## LICENSE

MIT license. See the LICENSE file for details.
