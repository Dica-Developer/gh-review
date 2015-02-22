(function () {
  'use strict';

  module.exports = {
    'WhoAmI per shortcut': function (browser) {
      browser
        .url('http://localhost:9000')
        .login()
        .click('.navbar-brand')
        .waitForElementVisible('body', 1000)
        .pause(2000)
        .keys(['g', 'w'])
        .waitForElementVisible('ul.list-group', 5000)
        .assert.urlContains('whoami')
        .end();
    }
  };

}());
