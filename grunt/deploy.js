(function () {
  'use strict';

  var exec = require('child_process').exec,
    path = require('path'),
    tmpPath = path.resolve('.tmp'),
    pagesPath = path.join(tmpPath, 'gh-review.pages');

  module.exports = function (grunt) {

    grunt.registerTask('setNewVersion', function () {
      var packageJson = grunt.file.readJSON('package.json'),
        version = packageJson.version.split('.');

      version[2] = parseInt(version[2], 10) + 1;
      packageJson.version = version[0] + '.' + version[1] + '.' + version[2];
      grunt.file.write('package.json', JSON.stringify(packageJson, null, 2));
    });

    grunt.registerTask('checkoutWebsite', function () {
      var done = this.async();

      exec('git clone --reference ./ --branch gh-pages git@github.com:Dica-Developer/gh-review.git ' + pagesPath, function(error){
        if (error !== null) {
          grunt.log.error('rm error: ' + error);
          done(false);
        } else {
          done();
        }
      });
    });

    grunt.registerTask('cleanDeploy', function () {
      var done = this.async();
      exec('rm -r ' + pagesPath + '/*', function (error) {
        if (error !== null) {
          grunt.log.error('rm error: ' + error);
          done(false);
        } else {
          done();
        }
      });
    });

    grunt.registerTask('commitAndPush', function () {
      var done = this.async();
      exec('cd '+ pagesPath +' && git add --all . && git commit -m "* deploy release" && git push', function (error, stdout, stderr) {
        var result = true;
        if (stdout) {
          grunt.log.writeln(stdout);
        }
        if (stderr) {
          grunt.log.writeln(stderr);
        }
        if (error !== null) {
          grunt.log.error(error);
          result = false;
        }
        done(result);
      });
    });

    grunt.registerTask('deploy', [
      'jshint',
      'karma:dev',
      'processTmpl:dist',
      'build',
      'setNewVersion',
      'checkoutWebsite',
      'cleanDeploy',
      'copy:deploy',
      'commitAndPush'
    ]);

  };

}());
