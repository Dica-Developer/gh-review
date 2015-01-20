(function(){
  'use strict';
  module.exports = {
    'deploy': {
      'files': [
        {
          'expand': true,
          'cwd': './dist',
          'dest': '/tmp/gh-review.pages',
          'src': '**'
        }
      ]
    },
    'dev': {
      'files': [
        {
          'expand': true,
          'cwd': '<%= config.app %>',
          'dest': '<%= config.dev %>',
          'src': '**'
        },
        {
          'expand': true,
          'cwd': '<%= config.app %>/bower_components/bootstrap/dist/fonts',
          'dest': '<%= config.dev %>/fonts',
          'src': '*'
        }
      ]
    },
    'dist': {
      'files': [
        {
          'expand': true,
          'cwd': '<%= config.app %>',
          'dest': '<%= config.dist %>',
          'src': ['worker/*', 'images/**/*', 'templates/**/*', 'fonts/**/*', '*.html', 'oauth/*.html']
        },
        {
          'expand': true,
          'cwd': '<%= config.app %>/bower_components/bootstrap/dist/fonts',
          'dest': '<%= config.dist %>/fonts',
          'src': '*'
        },
        {
          'expand': true,
          'cwd': '<%= config.app %>/bower_components/lodash/dist',
          'dest': '<%= config.dist %>/js',
          'src': 'lodash.min.js'
        },
        {
          'expand': true,
          'cwd': 'worker',
          'dest': '<%= config.dist %>/worker',
          'src': '*'
        }
      ]
    }
  };
}());