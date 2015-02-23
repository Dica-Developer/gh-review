(function () {
  'use strict';

  /*jshint camelcase:false*/
  module.exports = {
    options: {
      access_token: process.env.DROPBOX_ACCESS_TOKEN,
      version_name: process.env.TRAVIS_BUILD_NUMBER || 'DEV-' + new Date().getTime()
    },
    dev: {
      files: {
        'build-artifacts': ['<%= config.test %>/report/screenshots/*.*']
      }
    }
  };

}());
