(function () {
  'use strict';

  module.exports = {
    'WhoAmI per shortcut': function (browser) {
      browser
        .url('http://localhost:9000')
        .login()
        .waitForElementVisible('body', 1000)
        .click('.navbar-brand')
        .keys(['g', 'w'])
        .assert.urlContains('whoami')
        .end();
    }
  };

}());
