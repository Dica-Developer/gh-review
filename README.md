[![Stories in Ready](https://badge.waffle.io/dica-developer/gh-review.png?label=ready&title=Ready)](https://waffle.io/dica-developer/gh-review)[![Open Issues](http://img.shields.io/github/issues/Dica-Developer/gh-review.svg?style=flat-square&label=Open%20Issues)](https://github.com/Dica-Developer/gh-review/issues)[![Build Status](http://img.shields.io/travis/Dica-Developer/gh-review/master.svg?style=flat-square&label=Travis%20CI)](https://travis-ci.org/Dica-Developer/gh-review)[![Coverage Status](http://img.shields.io/coveralls/Dica-Developer/gh-review/master.svg?style=flat-square&label=Test%20Coverage)](https://coveralls.io/r/Dica-Developer/gh-review?branch=master)
[![Coverage Status](http://img.shields.io/coveralls/Dica-Developer/gh-review/master.svg?style=flat-square&label=Test%20Coverage)](https://coveralls.io/r/Dica-Developer/gh-review?branch=master)
[![Code Climate](https://img.shields.io/codeclimate/github/Dica-Developer/gh-review.svg?style=flat-square)](https://codeclimate.com/github/Dica-Developer/gh-review)
- - -
# GitHub Review #

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Dica-Developer/gh-review?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


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

    grunt serve

It starts the application and opens the start page in a browser. Every change change you made to the application will be automatically incorporated in the test system.
Changes that did not pass the jshint stage will not be applied.

## Testing ##

To run tests automatically for every change during development run the following command:

    grunt test

## Build ##

To build a distribution run the following commands corresponding to your operating system:

    grunt build

The app can then be found under:

    ./dist/
    
or run a server with the dist build:

    grunt serve:dist

## Color ranges ##

http://jsfiddle.net/V5BHc/

## License ##

GitHub Review - Source code review Tool.
Copyright (C) 2014  Dica-Developer
