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
    injectLess: {
      files: [
        '<%= config.app%>/{app,components}/**/*.less'],
      tasks: ['injector:less']
    },
    jsTest: {
      files: [
        '<%= config.app %>/{app,components}/**/*.spec.js',
        '<%= config.app %>/{app,components}/**/*.mock.js'
      ],
      tasks: ['karma']
    },
    less: {
      files: [
        '<%= config.app %>/{app,components}/**/*.less'],
      tasks: ['less:dev']
    },
    gruntfile: {
      files: ['Gruntfile.js']
    },
    bower: {
      files: ['bower.json'],
      tasks: ['wiredep']
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