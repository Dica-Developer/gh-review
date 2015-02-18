(function () {
  'use strict';

  exports.command = function (callback) {
    var self = this;

    this.execute(
      function () { // execute application specific code
        localStorage.setItem('ghreview.accessToken', 'f4600eb91d0ee45dc7793be3a2399610cccbece4');
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
