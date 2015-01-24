(function () {
  'use strict';
  module.exports = {
    dev: {
      options: {
        livereload: 35729,
        hostname: 'localhost',
        port: 9000,
        open: true,
        base: ['<%= config.tmp %>', '<%= config.app %>']
      }
    },
    dist: {
      options: {
        hostname: 'localhost',
        port: 9000,
        open: true,
        base: '<%= config.dist %>'
      }
    },
    e2e: {
      options: {
        hostname: 'localhost',
        port: 9000,
        base: ['<%= config.tmp %>', '<%= config.app %>']
      }
    }
  };
}());