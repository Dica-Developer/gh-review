(function () {
  'use strict';

  exports.command = function (callback) {
    var self = this;

    this.executeAsync(
      function (token) { // execute application specific code
        localStorage.setItem('ghreview.accessToken', token);
        return localStorage.getItem('ghreview.accessToken') !== null;
      },

      [process.env.GITHUB_ACCESS_TOKEN], // arguments array to be passed

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
