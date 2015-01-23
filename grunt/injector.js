(function () {
  'use strict';
  module.exports = {
    options: {},
    // Inject application script files into index.html (doesn't include bower)
    scripts: {
      options: {
        transform: function (filePath) {
          filePath = filePath.replace('/client/', '');
          filePath = filePath.replace('/.tmp/', '');
          return '<script src="' + filePath + '"></script>';
        },
        starttag: '<!-- injector:js -->',
        endtag: '<!-- endinjector -->'
      },
      files: {
        '<%= config.app %>/index.html': [
          ['{.tmp,<%= config.app %>}/{app,components}/**/*.js',
            '!{.tmp,<%= config.app %>}/app/app.js',
            '!{.tmp,<%= config.app %>}/app/options.js',
            '!{.tmp,<%= config.app %>}/worker/**/*.js',
            '!{.tmp,<%= config.app %>}/{app,components}/**/*.spec.js',
            '!{.tmp,<%= config.app %>}/{app,components}/**/*.mock.js']
        ]
      }
    },
    less: {
      options: {
        transform: function (filePath) {
          filePath = filePath.replace('/client/app/', '');
          filePath = filePath.replace('/client/components/', '');
          return '@import \'' + filePath + '\';';
        },
        starttag: '// injector',
        endtag: '// endinjector'
      },
      files: {
        '<%= config.app %>/app/app.less': [
          '<%= config.app %>/{app,components}/**/*.less',
          '!<%= config.app %>/app/app.less'
        ]
      }
    }
  };
}());
