(function () {
  'use strict';
  module.exports = {
    'dev': {
      'configFile': '<%= config.test %>/dev.karma.conf.js'
    },
    'travis': {
      'configFile': '<%= config.test %>/travis.karma.conf.js'
    }
  };
}());