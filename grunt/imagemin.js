(function(){
  'use strict';

  module.exports = {
    dist: {
      files: [{
        expand: true,
        cwd: '<%= config.app %>/assets/images',
        src: '{,*/}*.{png,jpg,jpeg,gif}',
        dest: '<%= config.dist %>/assets/images'
      }]
    }
  };

}());
