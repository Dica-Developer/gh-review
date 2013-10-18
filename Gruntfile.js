/*jshint camelcase: false*/

module.exports = function (grunt) {
  'use strict';

  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var config = {
    app: 'app',
    dist: 'dist',
    tmp: 'tmp',
    resources: 'resources'
  };

  grunt.initConfig({
    config: config,
    watch: {
      options: {
        nospawn: true
      },
      dev: {
        files: [
          '<%= config.app %>/templates/*.html',
          '<%= config.app %>/css/{,*/}*.css',
          '<%= config.app %>/css/{,*/}*.less',
          '<%= config.app %>/js/{,*/}*.js'
        ],
        tasks: ['dev']
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= config.dist %>/*',
            '<%= config.tmp %>/*'
          ]
        }]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: '<%= config.app %>/js/{,*/}*.js'
    },
    less: {
      dev: {
        files: {
          '<%= config.app %>/css/main.css': '<%= config.app %>/css/main.less'
        }
      },
      build: {
        options: {
          paths: ['<%= yeoman.app %>/styles'],
          yuicompress: true
        },
        files: {
          '<%= yeoman.dist %>/styles/main.css': '/main.less'
        }
      }
    },
    copy: {
      appMacos: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>/node-webkit.app/Contents/Resources/app.nw',
          src: '**'
        }]
      },
      webkit: {
        files: [{
          expand: true,
          cwd: '<%=config.resources %>/node-webkit/mac-os',
          dest: '<%= config.dist %>/',
          src: '**'
        }]
      }
    },
    compress: {
      appToTmp: {
        options: {
          archive: '<%= config.tmp %>/app.zip'
        },
        files: [
          {
            expand: true,
            cwd:'<%= config.app %>',
            src: ['**']
          }
        ]
      }
    },
    rename: {
      app: {
        files: [
          {
            src: '<%= config.dist %>/node-webkit.app',
            dest: '<%= config.dist %>/JSON Transformer.app'
          }
        ]
      },
      zipToApp: {
        files: [
          {
            src: '<%= config.tmp %>/app.zip',
            dest: '<%= config.tmp %>/app.nw'
          }
        ]
      }
    }
  });

  grunt.registerTask('chmod', 'Add lost Permissions.', function () {
    var fs = require('fs');
    fs.chmodSync('dist/node-webkit.app/Contents/Frameworks/node-webkit Helper EH.app/Contents/MacOS/node-webkit Helper EH', '555');
    fs.chmodSync('dist/node-webkit.app/Contents/Frameworks/node-webkit Helper NP.app/Contents/MacOS/node-webkit Helper NP', '555');
    fs.chmodSync('dist/node-webkit.app/Contents/Frameworks/node-webkit Helper.app/Contents/MacOS/node-webkit Helper', '555');
    fs.chmodSync('dist/node-webkit.app/Contents/MacOS/node-webkit', '555');
  });

  grunt.registerTask('dist', [
    'jshint',
    'clean:dist',
    'copy:webkit',
    'copy:appMacos',
    'chmod'
  ]);

  grunt.registerTask('dev', [
    'jshint',
    'less:dev',
    'copy:appMacos',
    'chmod'
  ]);

};