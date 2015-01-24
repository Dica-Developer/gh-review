/*jshint camelcase:false*/
(function () {
  'use strict';
  module.exports = {
    options: {
      standalone: true,
      //jar_url: 'http://selenium-release.storage.googleapis.com/2.44/selenium-server-standalone-2.44.0.jar',
      jar_path: '<%= config.test %>/helper/selenium-server-standalone-2.44.0.jar',
      src_folders: ['<%= config.test %>/e2e'],
      output_folder: '<%= config.test %>/report',
      custom_commands_path: '<%= config.test %>/helper/nightwatch-custom-commands',
      test_settings: {},
      selenium: {}
    }
  };
}());