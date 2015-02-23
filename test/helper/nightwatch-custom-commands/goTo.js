(function () {
  'use strict';

  module.exports.command = function (view) {
    var self = this, viewMap = {
      'modules': '#/filter/modules',
      'filter-list': '#/filter'
    };

    self.urlHash(viewMap[view]);

    return this;
  };


}());
