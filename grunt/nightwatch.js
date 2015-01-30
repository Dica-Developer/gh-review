/*jshint camelcase:false*/
(function () {
  'use strict';
  module.exports = {
    options: {
      standalone: true,
      jar_path: '<%= config.test %>/helper/selenium-server-standalone-2.44.0.jar',
      src_folders: ['<%= config.test %>/e2e'],
      output_folder: '<%= config.test %>/report',
      custom_commands_path: '<%= config.test %>/helper/nightwatch-custom-commands',
      custom_assertions_path: '<%= config.test %>/helper/nightwatch-custom-assertions',
      test_settings: {
        'default': {
          'launch_url': 'http://localhost:9000/'
        },
        'saucelabs': {
          'selenium_host': 'ondemand.saucelabs.com',
          'selenium_port': 80,
          'launch_url': 'http://localhost:9000',
          'screenshots': {'enabled': true, path: ''},
          'username': '${SAUCE_USERNAME}',
          'access_key': '${SAUCE_ACCESS_KEY}',
          'use_ssl' : false,
          'silent' : true,
          'output' : true,
          'desiredCapabilities': {
            browserName: 'firefox',
            platform: 'Linux',
            version: '35',
            'tunnel-identifier' : '${TRAVIS_JOB_NUMBER}'
          },
          'selenium' : {
            'start_process' : false
          }
        }
      },
      selenium: {}
    }
  };
}());