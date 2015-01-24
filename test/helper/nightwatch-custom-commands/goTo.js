(function () {
  'use strict';

  exports.command = function (view) {
    var self = this, viewMap = {
      'Modules': '#/filter/modules'
    };

    self.urlHash(viewMap[view]);

    return this;
  };


}());
