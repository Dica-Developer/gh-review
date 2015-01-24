(function () {
  'use strict';

  module.exports = {
    'beforeEach': function(browser){
      browser
        .url('http://localhost:9000')
        .login();
    },
    'Menu entries': function (browser) {
      browser
        .assert.elementPresent('#menu-commits')
        .assert.containsText('#menu-commits', 'Commits')
        .assert.elementPresent('#menu-modules')
        .assert.containsText('#menu-modules', 'Modules')
        //We have to make the submenu visible otherwise the text assertion does not work
        .click('.dropdown-toggle.ng-binding')
        .click('.dropdown-toggle.ng-binding')
        .assert.elementPresent('#submenu-whoami')
        .assert.containsText('#submenu-whoami', 'Who Am I')
        .assert.elementPresent('#submenu-bug')
        .assert.containsText('#submenu-bug', 'I found a bug')
        .assert.elementPresent('#submenu-more')
        .assert.containsText('#submenu-more', 'I need more')
        .assert.elementPresent('#submenu-howto')
        .assert.containsText('#submenu-howto', 'How to use')
        .assert.elementPresent('#submenu-about')
        .assert.containsText('#submenu-about', 'About')
        .assert.elementPresent('#submenu-logout')
        .assert.containsText('#submenu-logout', 'Logout')
        .end();
    },
    'Menu entry "Modules"': function (browser) {
      browser
        .click('#menu-modules')
        .waitForElementVisible('#searchValue', 5000)
        .assert.urlContains('#/filter/modules')
        .end();
    },
    'Menu entry "Who Am I"': function (browser) {
      browser
        .subMenu('whoami')
        .assert.urlContains('#/whoami')
        .end();
    },
    'Menu entry "I found a bug"': function (browser) {
      browser
        .subMenu('bug')
        .assert.urlContains('https://github.com/Dica-Developer/gh-review/issues')
        .end();
    },
    'Menu entry "I need more"': function (browser) {
      browser
        .subMenu('more')
        .assert.urlContains('https://github.com/Dica-Developer/gh-review')
        .end();
    },
    'Menu entry "How to use"': function (browser) {
      browser
        .subMenu('howto')
        .assert.urlContains('https://github.com/Dica-Developer/gh-review/wiki')
        .end();
    },
    'Menu entry "Logout"': function (browser) {
      browser
        .subMenu('logout')
        .assert.urlContains('#/welcome')
        .assert.elementPresent('#loginLogoutContainer')
        .end();
    }
  };

}());
