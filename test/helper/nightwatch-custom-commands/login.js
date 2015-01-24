(function () {
  'use strict';

  exports.command = function (callback) {
    var self = this;

    this.execute(
      function () { // execute application specific code
        localStorage.setItem('ghreview.accessToken', '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad');
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
