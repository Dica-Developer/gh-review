(function () {
  'use strict';

  exports.command = function (menuEntry) {
    var self = this;

    self
      .click('.dropdown-toggle.ng-binding')
      .click('#submenu-' + menuEntry);

    return this; // allows the command to be chained.
  };


}());
