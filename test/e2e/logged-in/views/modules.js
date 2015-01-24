(function () {
  'use strict';

  module.exports = {
    'before': function(browser){
      browser.url('http://localhost:9000').login();
    },
    'beforeEach': function (browser) {
      browser.goTo('Modules').waitForElementPresent('#searchValue', 5000);
    },
    'after': function(browser){
      browser.end();
    },
    'Search field should be empty': function (browser) {
      browser.assert.value('#searchValue', '');
    },
    'Searchstring "review modules repo:Dica-Developer/gh-review" should display list of results': function(browser){
      browser
        .setValue('#searchValue', 'review modules repo:Dica-Developer/gh-review')
        .click('#searchButton')
        .waitForElementPresent('#commitList a', 5000)
        .assert.elementsPresentMin('#commitList a', 1);
    },
    'Click on result list item should forward to file view': function(browser){
      browser
        .setValue('#searchValue', 'review modules repo:Dica-Developer/gh-review')
        .click('#searchButton')
        .waitForElementPresent('#commitList a', 5000)
        .click('#commitList a:first-child')
        .waitForElementPresent('.div-table.github', 10000)
        .assert.urlContains('Dica-Developer/gh-review/blob');
    },
  };

}());
