
(function(){
  'use strict';

  module.exports = function(grunt){
    grunt.registerTask('test', function(target){
      var tasklist = ['jshint', 'processTmpl:dev'];

      if('travis' === target){
        tasklist.push('karma:travis');
        tasklist.push('coveralls');
      } else{
        tasklist.push('karma:dev');
      }
      grunt.task.run(tasklist);
    });
  };

}());
