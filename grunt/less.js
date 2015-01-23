(function () {
  'use strict';
  module.exports = {
    options: {
      paths: [
        '<%= config.app %>/bower_components',
        '<%= config.app %>/app',
        '<%= config.app %>/components'
      ]
    },
    dist: {
      files: {
        '<%= config.temp %>/app/app.css': '<%= config.app %>/app/app.less'
      }
    },
    'dev': {
      'files': {
        '<%= config.app %>/app/app.css': '<%= config.app %>/app/app.less'
      }
    }
    //'dist': {
    //  'options': {
    //    plugins: [ new (require('less-plugin-clean-css'))({advanced: true}) ]
    //  },
    //  'files': {
    //    '<%= config.dist %>/app/app.css': '<%= config.app %>/app/app.less'
    //  }
    //}
  };
}());