(function(){
  'use strict';
  module.exports = {
    'dev': {
      'files': {
        '<%= config.app %>/app/app.css': '<%= config.app %>/app/app.less'
      }
    },
    'dist': {
      'options': {
        plugins: [ new (require('less-plugin-clean-css'))({advanced: true}) ]
      },
      'files': {
        '<%= config.dist %>/app/app.css': '<%= config.app %>/app/app.less'
      }
    }
  };
}());