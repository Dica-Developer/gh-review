
(function(){
  'use strict';

  module.exports = function(grunt){
    grunt.registerTask('test', function(target){
      var tasklist = ['jshint', 'processTmpl:dev'];

      if('dev' === target){
        tasklist.push('karma:dev');
      } else if('travis' === target){
        tasklist.push('karma:travis');
        tasklist.push('coveralls');
      }
      grunt.task.run(tasklist);
    });
  };

}());
