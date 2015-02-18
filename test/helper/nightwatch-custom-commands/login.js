(function () {
  'use strict';

  exports.command = function (callback) {
    var self = this;

    this.execute(
      function () { // execute application specific code
        localStorage.setItem('ghreview.accessToken', 'a3109910c7c197a729d6bcf5935a7badfe19f825');
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
