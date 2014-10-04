// conf.js
exports.config = {
  capabilities: {
    'browserName': 'firefox',
    'name': 'Protractor Tests'
  },
  baseUrl: 'http://localhost:9001',
  suites: {
//        startWithoutToken: 'startPage/withoutToken.js',
    startWithToken: 'startPage/withToken.js',
    reviewModules: 'reviewPage/modules.js'
  }
};