(function () {
  'use strict';

  module.exports = function (grunt) {
    grunt.registerTask('test', function (target) {
      var tasklist = ['jshint', 'processTmpl:dev'];

      if ('travis' === target) {
        tasklist.push('build');
        tasklist.push('serve:saucelabs');
        tasklist.push('nightwatch:saucelabs');
        tasklist.push('coveralls');
      } else if ('e2e' === target) {
        tasklist.push('serve:e2e');
        tasklist.push('nightwatch');
      } else {
        tasklist.push('karma:dev');
      }
      grunt.task.run(tasklist);
    });
  };

}());
