// conf.js
exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    suites: {
        startWithoutToken: 'withoutToken/**/*.js',
        startWithToken: 'withToken/**/*.js'
    },
    specs: ['*.js']
};