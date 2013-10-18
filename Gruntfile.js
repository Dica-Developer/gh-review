/*jshint camelcase: false*/

module.exports = function (grunt) {
  'use strict';

  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var config = {
    app: 'app',
    dev: 'dev',
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
        tasks: ['devWatch']
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
      },
      dev: {
        files: [{
          dot: true,
          src: [
            '<%= config.dev %>/*'
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
      appMacosDist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>/node-webkit.app/Contents/Resources/app.nw',
          src: '**'
        }]
      },
      appMacosDev: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dev %>/node-webkit.app/Contents/Resources/app.nw',
          src: '**'
        }]
      },
      webkitDist: {
        files: [{
          expand: true,
          cwd: '<%=config.resources %>/node-webkit/mac-os',
          dest: '<%= config.dist %>/',
          src: '**'
        }]
      },
      webkitDev: {
        files: [{
          expand: true,
          cwd: '<%=config.resources %>/node-webkit/mac-os',
          dest: '<%= config.dev %>/',
          src: '**'
        }]
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

  grunt.registerTask('chmodDev', 'Add lost Permissions.', function () {
    var fs = require('fs');
    fs.chmodSync('dev/node-webkit.app/Contents/Frameworks/node-webkit Helper EH.app/Contents/MacOS/node-webkit Helper EH', '555');
    fs.chmodSync('dev/node-webkit.app/Contents/Frameworks/node-webkit Helper NP.app/Contents/MacOS/node-webkit Helper NP', '555');
    fs.chmodSync('dev/node-webkit.app/Contents/Frameworks/node-webkit Helper.app/Contents/MacOS/node-webkit Helper', '555');
    fs.chmodSync('dev/node-webkit.app/Contents/MacOS/node-webkit', '555');
  });

  grunt.registerTask('dist', [
    'jshint',
    'clean:dist',
    'copy:webkitDist',
    'copy:appMacosDist',
    'chmod'
  ]);

  grunt.registerTask('devWatch', [
    'jshint',
    'less:dev',
    'copy:appMacosDev'
  ]);

  grunt.registerTask('copyToDev', [
    'copy:webkitDev',
    'copy:appMacosDev'
  ]);

  grunt.registerTask('startApp', 'Starting app for developing', function(){
    var exec = require('child_process').exec;
    var app = exec('dev/node-webkit.app/Contents/MacOS/node-webkit');
    app.stdout.on('data', function(msg){
      grunt.log.write(msg);
    });
    app.stderr.on('data', function(msg){
      grunt.log.error(msg);
    });
  });

  grunt.registerTask('dev', [
    'clean:dev',
    'jshint',
    'less:dev',
    'copyToDev',
    'chmodDev',
    'startApp',
    'watch:dev'
  ]);

};