(function () {
  'use strict';

  module.exports = {
    tags: ['issues'],
    'before': function (browser) {
      browser
        .url('http://localhost:9000')
        .login();
    },
    'after': function (browser) {
      browser.end();
    },
    'Should redirect to ‘/filter‘ if path is ‘/welcome‘': function (browser) {
      browser
        .urlHash('#/welcome')
        .assert.urlContains('filter');
    }
  };

}());
