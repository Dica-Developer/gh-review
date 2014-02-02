/*jshint camelcase: false*/

module.exports = function (grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-browserify');
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  var config = {
    app: 'app',
    dev: 'dev',
    dist: 'dist'
  };

  grunt.initConfig({
    config: config,
    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // Change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      dev: {
        options: {
          open: true,
          base: '<%= config.dev %>',
          livereload: false
        }
      }
    },
    watch: {
      options: {
        nospawn: true
      },
      dev: {
        files: [
          '<%= config.app %>/css/*',
          '<%= config.app %>/js/**/*',
          '<%= config.app %>/*.html',
          '!<%= config.app %>/bower_components/*'
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
        options: {
          yuicompress: true
        },
        files: {
          '<%= config.dev %>/css/main.css': '<%= config.app %>/css/main.less'
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
      dev: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dev %>',
          src: '**'
        },{
          expand: true,
          cwd: '<%= config.app %>/bower_components/bootstrap/dist/fonts',
          dest: '<%= config.dev %>/fonts',
          src: '*'
        }]
      }
    },
    requirejs: {
      options:{
        loglevel: 5,
        findNestedDependencies: true,
        inlineText: true,
        mainConfigFile: 'app/js/main.js'
//        optimizeAllPluginResources: true
      },
      dev: {
        options: {
          dir: '<%= config.dev %>/node-webkit.app/Contents/Resources/app.nw/js',
          optimize: 'none',
          modules: [
            {name: 'main'}
          ]
        }
      }
    }
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
    'copy:dev'
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
    'copy:dev',
    'less:dev',
    'connect:dev',
    'watch:dev'
  ]);

};