(function () {
  'use strict';

  module.exports = {
    tags: ['logged-in', 'view', 'filter-list', 'with-filter'],
    'before': function (browser) {
      browser
        .url('http://localhost:9000')
        .setFilter()
        .login();
    },
    'beforeEach': function (browser) {
      browser.goTo('filter-list');
    },
    'after': function (browser) {
      browser.end();
    },
    'Schould show list of filter': function (browser) {
      browser.assert.elementPresent('#reviewList');
    },
    'Click on filter entry should forward to commit list': function (browser) {
      browser
        .click('#reviewList a:first-child')
        .waitForElementPresent('ghreview-commit-list', 5000)
        .assert.urlContains('commits');
    },
    'Click on remove icon should delete folder': function (browser) {
      browser
        .assert.elementPresent('#reviewList')
        .waitForElementPresent('#reviewList a:first-child span.destroy', 5000)
        .click('#reviewList a:first-child span.destroy')
        .assert.elementNotPresent('#reviewList');
    },
    'Add filter button should present': function (browser) {
      browser
        .assert.elementPresent('a[href="#/filter/add"]');
    },
    'Click on add filter button should forward to filter add page': function (browser) {
      browser
        .click('a[href="#/filter/add"]')
        .assert.urlContains('filter/add');
    }
  };

}());
