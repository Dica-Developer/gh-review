/* global module*/
module.exports = function(grunt) {
  'use strict';

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);
  require('./grunt/build')(grunt);
  grunt.loadTasks('./grunt');
  grunt.loadNpmTasks('grunt-karma-coveralls');

  var config = {
    temp: '.tmp',
    app: 'client',
    dist: 'dist',
    test: 'test',
    coverage: 'test/coverage',
    build: grunt.file.readJSON('build.json')
  };

  grunt.initConfig({
    config: config,
    connect: require('./grunt/connect'),
    watch: require('./grunt/watch'),
    clean: require('./grunt/clean'),
    wiredep: require('./grunt/wiredep'),
    injector: require('./grunt/injector'),
    jshint: require('./grunt/jshint'),
    less: require('./grunt/less'),
    autoprefixer: require('./grunt/autoprefixer'),
    copy: require('./grunt/copy'),
    useminPrepare: require('./grunt/usemin').prepare,
    usemin: require('./grunt/usemin').min,
    imagemin: require('./grunt/imagemin'),
    cdnify: require('./grunt/cdnify'),
    karma: require('./grunt/karma'),
    concurrent: require('./grunt/concurrent'),
    ngtemplates: require('./grunt/ngtemplates'),
    ngAnnotate: require('./grunt/ngAnnotate'),
    rev: require('./grunt/rev'),
    coveralls: require('./grunt/coveralls'),
    nightwatch: require('./grunt/nightwatch')
  });

  grunt.registerTask('server-keepalive', 'Keep grunt running', function() {
    this.async();
  });

  grunt.registerTask('serve', function (target) {

    switch (target){
    case 'dist':
      grunt.task.run(['build', 'connect:dist', 'server-keepalive']);
      break;
    case 'e2e':
      grunt.task.run(['connect:e2e']);
      break;
    case 'saucelabs':
      grunt.task.run(['connect:saucelabs']);
      break;
    default:
      grunt.task.run([
        'jshint',
        'processTmpl:dev',
        'injector:scripts',
        'injector:less',
        'less:dev',
        'connect:dev',
        'watch'
      ]);
    }
  });

  grunt.registerTask('processTmpl', function (target) {
    var options = ('dev' === target) ? config.build.dev : config.build.dist,
      tmpl = grunt.file.read('grunt/options.tmpl'),
      pkg = grunt.file.readJSON('package.json'),
      processedTmpl;

    options.version = pkg.version;
    processedTmpl = grunt.template.process(tmpl, { data: options });
    grunt.file.write('.tmp/options.js', processedTmpl);
  });

};
