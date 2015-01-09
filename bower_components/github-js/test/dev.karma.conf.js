module.exports = function(config) {
    'use strict';

    config.set({
        basePath: '..',
        frameworks: ['jasmine'],

        files: [
            'dist/github.js',
            'test/specs/*-spec.js'
        ],

        browsers: ['Firefox'],
        reporters: ['story', 'coverage'],
        preprocessors: {
            'dist/github.js': ['coverage']
        },
        coverageReporter: {
            type : 'html',
            dir : 'test/coverage'
        },

        logLevel: config.LOG_INFO,

        autoWatch: false,
        singleRun: true
    });
};
