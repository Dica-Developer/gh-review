(function () {
  'use strict';
  module.exports = {
    server: {
      options: {
        livereload: 35729,
        hostname: 'localhost',
        port: 9000,
        open: true,
        base: '<%= config.app %>'
      }
    }
  };
}());