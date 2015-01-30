(function () {
  'use strict';

  exports.command = function (view) {
    var self = this, viewMap = {
      'modules': '#/filter/modules',
      'filter-list': '#/filter'
    };

    self.urlHash(viewMap[view]);

    return this;
  };


}());
