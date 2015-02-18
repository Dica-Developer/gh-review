(function () {
  'use strict';

  exports.command = function (callback) {
    var self = this;

    this.execute(
      function () { // execute application specific code
        localStorage.setItem('ghreview.accessToken', '6867f021346fd59d3df8972b186c5ded726ad4da');
        return true;
      },

      [], // arguments array to be passed

      function (result) {
        if (typeof callback === 'function') {
          callback.call(self, result);
        }
      }
    )
      .refresh()
      .waitForElementVisible('#submenu-authenticated', 5000, 'Application ready in %d ms');

    return this; // allows the command to be chained.
  };


}());
