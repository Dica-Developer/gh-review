(function () {
  'use strict';

  module.exports = {
    tags: ['logged-in', 'view', 'filter-list', 'no-filter'],
    'before': function (browser) {
      browser.url('http://localhost:9000').login();
    },
    'beforeEach': function (browser) {
      browser.goTo('filter-list');
    },
    'after': function (browser) {
      browser.end();
    },
    'Schould forward to add filter view if no filter exists': function (browser) {
      browser.assert.urlContains('filter/add');
    }
  };

}());
