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
    coveralls: require('./grunt/coveralls')
  });

  grunt.registerTask('server-keepalive', 'Keep grunt running', function() {
    this.async();
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist', 'server-keepalive']);
    }

    grunt.task.run([
      'jshint',
      'processTmpl:dev',
      'injector:scripts',
      'injector:less',
      'less:dev',
      'connect:dev',
      'watch'
    ]);
  });

  grunt.registerTask('processTmpl', function (target) {
    var options = config.build.dist;
    var tmpl = grunt.file.read('grunt/options.tmpl');
    var pkg = grunt.file.readJSON('package.json');
    if ('dev' === target) {
      options = config.build.dev;
    }
    options.version = pkg.version;
    var processedTmpl = grunt.template.process(tmpl, {
      data: options
    });
    grunt.file.write('client/app/options.js', processedTmpl);
  });

  grunt.registerTask('checkoutWebsite', function() {
    var done = this.async();
    var childProcess = require('child_process');
    var exec = childProcess.exec;
    exec('rm -fr /tmp/gh-review.pages/ 2> /dev/null && git clone --reference ./ -b gh-pages git@github.com:Dica-Developer/gh-review.git /tmp/gh-review.pages', function(error, stdout, stderr) {
      var result = true;
      if (stdout) {
        grunt.log.write(stdout);
      }
      if (stderr) {
        grunt.log.write(stderr);
      }
      if (error !== null) {
        grunt.log.error(error);
        result = false;
      }
      done(result);
    });
  });

  grunt.registerTask('cleanDeploy', function() {
    var done = this.async();
    var childProcess = require('child_process');
    var exec = childProcess.exec;
    exec('rm -r /tmp/gh-review.pages/*', function() {
      done(true);
    });
  });

  grunt.registerTask('commitAndPush', function() {
    var done = this.async();
    var childProcess = require('child_process');
    var exec = childProcess.exec;
    exec('cd /tmp/gh-review.pages && git add --all . && git commit -m "* deploy release" && git push', function(error, stdout, stderr) {
      var result = true;
      if (stdout) {
        grunt.log.write(stdout);
      }
      if (stderr) {
        grunt.log.write(stderr);
      }
      if (error !== null) {
        grunt.log.error(error);
        result = false;
      }
      done(result);
    });
  });

  grunt.registerTask('postProcess', function() {
    var done = this.async();
    var fs = require('fs');
    var collectorJs = fs.readFileSync('dist/worker/collector.js', {
      encoding: 'UTF8'
    });
    collectorJs = collectorJs.replace('../../bower_components/lodash/dist/lodash.min.js', '../lodash.min.js');
    fs.writeFileSync('dist/worker/collector.js', collectorJs, {
      encoding: 'UTF8'
    });
    done();
  });

  grunt.registerTask('dist', function(template) {
    grunt.task.run([
      'clean:dist',
      'less:dist',
      'processTmpl:' + (template || 'dist'),
      'copy:dist',
      'useminPrepare',
      'concat:generated',
      'uglify:generated',
      'usemin',
      'postProcess'
    ]);
  });

  grunt.registerTask('devWatch', [
    'jshint',
    'less:dev',
    'copy:dev'
  ]);

  grunt.registerTask('test', [
    'jshint',
    'karma:dev'
  ]);

  grunt.registerTask('travis', [
    'processTmpl:dev',
    'karma:travis',
    'coveralls'
  ]);

  grunt.registerTask('setNewVersion', function() {
    var packageJson = grunt.file.readJSON('package.json');
    var version = packageJson.version.split('.');
    version[2] = parseInt(version[2], 10) + 1;
    packageJson.version = version[0] + '.' + version[1] + '.' + version[2];
    grunt.file.write('package.json', JSON.stringify(packageJson, null, 2));
  });

  grunt.registerTask('deploy', [
    'karma:travis',
    'setNewVersion',
    'dist',
    'checkoutWebsite',
    'cleanDeploy',
    'copy:deploy',
    'commitAndPush'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'injector:less',
    'concurrent:dist',
    'injector',
    'wiredep',
    'useminPrepare',
    'autoprefixer',
    'ngtemplates',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin'
  ]);
};
