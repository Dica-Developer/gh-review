# Usage

Install with [bower](http://bower.io/)

    bower install requirejs-base64

In your [requirejs](http://requirejs.org/) configuration:

    require.config({
        paths: {
            base64: 'lib/requirejs-base64/base64',
        },
        //...
    });

Require base64 as a dependency in your [module](http://requirejs.org/docs/whyamd.html#amd).

    define(['base64'], function(base64) {

        var encoded = base64.encode('Hello World!');
        console.log("Encoded: " + encoded);

        var decoded = base64.encode(encoded);
        console.log("Decoded: " + decoded);
    });

# Heads up

I created this project as I wanted a clean solution with requirejs managed by bower.  I haven't extensively tested this code though I have been using it for a while and it works solid.
