(function () {
  'use strict';
  module.exports = {
    dist: {
      files: [
        {
          dot: true,
          src: [
            '<%= config.dist %>/*'
          ]
        }
      ]
    },
    dev: {
      files: [
        {
          dot: true,
          src: [
            '<%= config.dev %>/*'
          ]
        }
      ]
    }
  };
}());
