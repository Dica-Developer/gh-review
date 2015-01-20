(function(){
  'use strict';
  module.exports = {
    'prepare': {
      'app': {
        'src': '<%= config.app %>/index.html'
      },
      'oauth': {
        'src': '<%= config.app %>/oauth/index.html',
        'options': {
          'root': '<%= config.app %>/oauth',
          'dest': 'dist/oauth'
        }
      }
    },
    'min': {
      'html': [
        'dist/oauth/index.html',
        'dist/index.html'
      ]
    }
  };
}());