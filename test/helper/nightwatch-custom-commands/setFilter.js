(function () {
  'use strict';

  exports.command = function (callback) {
    var self = this;

    this.execute(
      function () { // execute application specific code
        localStorage.setItem('ghreview.filter', 'faca30f5-32a0-4b80-b81b-b2a3f0426aba');
        localStorage.setItem('ghreview.filter-faca30f5-32a0-4b80-b81b-b2a3f0426aba', '{"repo":"gh-review","user":"jwebertest","sha":"master","since":{"pattern":"years","amount":1},"until":{},"path":null,"authors":[],"meta":{"isSaved":true,"lastEdited":1422613703826,"customFilter":{"excludeOwnCommits":false,"state":null},"id":"faca30f5-32a0-4b80-b81b-b2a3f0426aba"}}');
        return true;
      },

      [], // arguments array to be passed

      function (result) {
        if (typeof callback === 'function') {
          callback.call(self, result);
        }
      }
    );

    return this; // allows the command to be chained.
  };


}());
