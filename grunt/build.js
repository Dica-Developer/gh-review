(function(){
  'use strict';

  module.exports = function(grunt){
    grunt.registerTask('build', [
      'clean',
      'processTmpl:dev',
      'test:dev',
      'processTmpl:dist',
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

}());
