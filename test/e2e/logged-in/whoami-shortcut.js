(function () {
  'use strict';

  module.exports = {
    'WhoAmI per shortcut': function (browser) {
      browser
        .url('http://localhost:9000')
        .login()
        .waitForElementVisible('.navbar-brand', 5000)
        .click('.navbar-brand')
        .waitForElementVisible('.navbar-brand', 5000)
        .keys(['g', 'w'])
        .waitForElementVisible('ul.list-group', 5000)
        .assert.urlContains('whoami')
        .end();
    }
  };

}());
