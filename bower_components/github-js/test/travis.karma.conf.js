module.exports = function(config) {
    'use strict';

    config.set({
        basePath: '..',
        frameworks: ['jasmine'],

        files: [
            {pattern: 'dist/github.js', included: true},
            {pattern: 'test/specs/**/*-spec.js', included: true}
        ],

        browsers: ['Firefox'],
        reporters: ['story', 'coverage'],
        preprocessors: {
            'dist/github.js': ['coverage']
        },
        coverageReporter: {
            type : 'lcov',
            dir : 'test/coverage'
        },

        logLevel: config.LOG_INFO,

        autoWatch: false,
        singleRun: true
    });
};
