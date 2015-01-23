(function () {
  'use strict';
  module.exports = {
    'prepare': {
      html: ['<%= config.app %>/index.html', '<%= config.app %>/oauth/index.html'],
      options: {
        dest: '<%= config.dist %>'
      }
    },
    'min': {
      html: ['<%= config.dist %>/{,*/}*.html'],
      css: ['<%= config.dist %>/{,*/}*.css'],
      js: ['<%= config.dist %>/{,*/}*.js'],
      options: {
        assetsDirs: [
          '<%= config.dist %>',
          '<%= config.dist %>/assets/images'
        ],
        // This is so we update image references in our ng-templates
        patterns: {
          js: [
            [/(assets\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
          ],
          html: [
            [/(oauth.*?\.(?:js))/gm, 'Update the HTML to reference oauth', null, function (path) {
              return path.replace('oauth/', '');
            }]
          ],
          css: [
            [/(assets\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the CSS to reference our revved images'],
            [/(assets\/fonts\/.*?\.(?:eot|svg|ttf|woff))/gm, 'Update the CSS to reference our revved fonts']
          ]
        }
      }
    }
  };
}());