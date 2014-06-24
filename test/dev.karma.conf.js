module.exports = function (config) {
    config.set({
        basePath: '../',
        frameworks: ['jasmine', 'requirejs'],
        files: [
            {pattern: 'app/js/**/*.js', included: false},
            {pattern: 'test/unit.js', included: false},
            {pattern: 'test/unit/**/*.js', included: false},
            {pattern: 'app/bower_components/**/*.js', included: false},
            {pattern: 'test/unit/**/*Spec.js', included: false },
            // needs to be last http://karma-runner.github.io/0.10/plus/requirejs.html
            'test/main-test.js'
        ],

        reporters: ['dots', 'coverage'],
        preprocessors: {
            'app/js/**/*.js': ['coverage']
        },
        coverageReporter: {
            type: 'html',
            dir: 'coverage/'
        },

        autoWatch: true,

        LogLevel: config.LOG_DEBUG,

        browsers: ['Chrome']
    });
};
