[![Stories in Ready](https://badge.waffle.io/dica-developer/gh-review.png?label=ready&title=Ready)](https://waffle.io/dica-developer/gh-review)
[![Build Status](https://travis-ci.org/Dica-Developer/gh-review.png?branch=master)](https://travis-ci.org/Dica-Developer/gh-review)  [![Coverage Status](https://coveralls.io/repos/Dica-Developer/gh-review/badge.png?branch=master)](https://coveralls.io/r/Dica-Developer/gh-review?branch=master)
- - -
# GitHub Review #


## Required Software ##

You need to have [node.js](http://nodejs.org/ "Node.js"), [bower.io](http://bower.io/) and [grunt](http://gruntjs.com/) installed, to start working with GitHub Review.

## Installation ##

After installing [node.js](http://nodejs.org/ "Node.js"), you have to run the following commands:

    git clone git@github.com:Dica-Developer/gh-review.git
    cd gh-review
    npm install
    bower install

## Development ##

To start development run the following command in the gh-review folder:

    grunt dev

It starts the application and opens the start page in a browser. Every change change you made to the application will be automatically incorporated in the test system.
Changes that did not pass the jshint stage will not be applied.

## Testing ##

To run tests automatically for every change during development run the following command:

    grunt test

## Build ##

To build a distribution run the following commands corresponding to your operating system:

    grunt dist

The app can then be found under:

    ./dist/

## Color ranges ##

http://jsfiddle.net/V5BHc/

## License ##

GitHub Review - Source code review Tool.
Copyright (C) 2014  Dica-Developer
