/*jshint camelcase:false*/
(function () {
  'use strict';
  module.exports = {
    options: {
      standalone: true,
      jar_path: '<%= config.test %>/helper/selenium-server-standalone-2.48.2.jar',
      src_folders: ['<%= config.test %>/e2e'],
      output_folder: '<%= config.test %>/report',
      custom_commands_path: '<%= config.test %>/helper/nightwatch-custom-commands',
      custom_assertions_path: '<%= config.test %>/helper/nightwatch-custom-assertions',
      test_settings: {
        'default': {
          'launch_url': 'http://localhost:9000/',
          'screenshots' : {
            'enabled' : true,
            'path' : '<%= config.test %>/report/screenshots'
          }
        }
      },
      selenium: {}
    }
  };
}());