(function () {
  'use strict';
  module.exports = {
    dist: {
      files: [{
        dot: true,
        src: [
          '.tmp',
          '<%= config.dist %>'
        ]
      }]
    }
  };
}());
