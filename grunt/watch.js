(function () {
  'use strict';
  module.exports = {
    injectJS: {
      files: ['{.tmp,<%= config.app %>}/{app,components}/**/*.js',
        '!{.tmp,<%= config.app %>}/app/app.js',
        '!{.tmp,<%= config.app %>}/app/options.js',
        '!{.tmp,<%= config.app %>}/worker/**/*.js',
        '!{.tmp,<%= config.app %>}/{app,components}/**/*.spec.js',
        '!{.tmp,<%= config.app %>}/{app,components}/**/*.mock.js'],
      tasks: ['injector:scripts']
    },
    gruntfile: {
      files: ['Gruntfile.js']
    },
    livereload: {
      files: [
        '{.tmp,<%= config.app %>}/{app,components}/**/*.css',
        '{.tmp,<%= config.app %>}/{app,components}/**/*.html',
        '{.tmp,<%= config.app %>}/{app,components}/**/*.js',
        '!{.tmp,<%= config.app %>}{app,components}/**/*.spec.js',
        '!{.tmp,<%= config.app %>}/{app,components}/**/*.mock.js',
        '<%= config.app %>/assets/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
      ],
      options: {
        livereload: 35729
      }
    }
  };
}());