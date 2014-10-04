// conf.js
exports.config = {
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  capabilities: {
    'browserName': 'firefox',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Protractor Tests'
  },
  baseUrl: 'http://localhost:9001',
  suites: {
//        startWithoutToken: 'startPage/withoutToken.js',
    startWithToken: 'startPage/withToken.js',
    reviewModules: 'reviewPage/modules.js'
  }
};