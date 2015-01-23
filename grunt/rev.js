(function () {
  'use strict';

  module.exports = {
    dist: {
      files: {
        src: [
          '<%= config.dist %>/{,*/}*.js',
          '!<%= config.dist %>/worker/*.js',
          '<%= config.dist %>/{,*/}*.css',
          '<%= config.dist %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= config.dist %>/assets/fonts/*'
        ]
      }
    }
  };

}());
