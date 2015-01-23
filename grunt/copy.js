(function () {
  'use strict';
  module.exports = {
    'deploy': {
      'files': [
        {
          'expand': true,
          'cwd': '<%= config.dist %>',
          'dest': '<%= config.temp %>/gh-review.pages',
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
    dist: {
      files: [{
        expand: true,
        dot: true,
        cwd: '<%= config.app %>',
        dest: '<%= config.dist %>',
        src: [
          '*.{ico,png,txt}',
          '.htaccess',
          'assets/images/{,*/}*.{webp}',
          'assets/fonts/**/*',
          'worker/**/*',
          'oauth/**/*',
          'index.html'
        ]
      }, {
        expand: true,
        cwd: '.tmp/images',
        dest: '<%= config.dist %>/assets/images',
        src: ['generated/*']
      }]
    }
  };
}());