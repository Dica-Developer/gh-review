(function(){
  'use strict';
  module.exports = {
    'dev': {
      'configFile': 'dev.karma.conf.js'
    },
    'travis': {
      'configFile': '<%= config.test %>/travis.karma.conf.js'
    }
  };
}());