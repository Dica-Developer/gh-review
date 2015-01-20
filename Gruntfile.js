/* global module*/
module.exports = function (grunt) {
  'use strict';

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-karma-coveralls');

  var config = {
    app: 'client',
    dev: 'dev',
    dist: 'dist',
    test: 'test',
    coverage: 'test/coverage',
    build: grunt.file.readJSON('build.json')
  };

  grunt.initConfig({
    config: config,
    connect: {
      options: {
        livereload: 35729,
        // Change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      dev: {
        options: {
          port: 9000,
          open: true,
          base: '<%= config.dev %>',
          livereload: false
        }
      },
      e2e: {
        options: {
          port: 9001,
          base: '<%= config.dist %>',
          livereload: false
        }
      }
    },
    watch: {
      injectJS: {
        files: ['{.tmp,<%= config.app %>}/{app,components}/**/*.js',
          '!{.tmp,<%= config.app %>}/app/app.js',
          '!{.tmp,<%= config.app %>}/app/options.js',
          '!{.tmp,<%= config.app %>}/worker/**/*.js',
          '!{.tmp,<%= config.app %>}/{app,components}/**/*.spec.js',
          '!{.tmp,<%= config.app %>}/{app,components}/**/*.mock.js'],
        tasks: ['injector:scripts']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        files: [
          '{.tmp,<%= config.app %>}/{app,components}/**/*.css',
          '{.tmp,<%= config.app %>}/{app,components}/**/*.html',
          '{.tmp,<%= config.app %>}/{app,components}/**/*.js',
          '!{.tmp,<%= config.app %>}{app,components}/**/*.spec.js',
          '!{.tmp,<%= config.app %>}/{app,components}/**/*.mock.js',
          '<%= config.app %>/assets/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        options: {
          livereload: true
        }
      }
    },
    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              '<%= config.dist %>/*'
            ]
          }
        ]
      },
      dev: {
        files: [
          {
            dot: true,
            src: [
              '<%= config.dev %>/*'
            ]
          }
        ]
      }
    },
    wiredep: {
      target: {
        src: '<%= config.app %>/index.html',
        ignorePath: '<%= config.app %>/'
      }
    },
    injector: {
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
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: '<%= config.app %>/{app,components,js}/**/*.js'
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
      dist: {
        options: {
          yuicompress: true
        },
        files: {
          '<%= config.dist %>/css/main.css': '<%= config.app %>/css/main.less'
        }
      }
    },
    copy: {
      deploy: {
        files: [
          {
            expand: true,
            cwd: './dist',
            dest: '/tmp/gh-review.pages',
            src: '**'
          }
        ]
      },
      dev: {
        files: [
          {
            expand: true,
            cwd: '<%= config.app %>',
            dest: '<%= config.dev %>',
            src: '**'
          },
          {
            expand: true,
            cwd: '<%= config.app %>/bower_components/bootstrap/dist/fonts',
            dest: '<%= config.dev %>/fonts',
            src: '*'
          }
        ]
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= config.app %>',
            dest: '<%= config.dist %>',
            src: ['worker/*', 'images/**/*', 'templates/**/*', 'fonts/**/*', '*.html', 'oauth/*.html']
          },
          {
            expand: true,
            cwd: '<%= config.app %>/bower_components/bootstrap/dist/fonts',
            dest: '<%= config.dist %>/fonts',
            src: '*'
          },
          {
            expand: true,
            cwd: '<%= config.app %>/bower_components/lodash/dist',
            dest: '<%= config.dist %>/js',
            src: 'lodash.min.js'
          },
          {
            expand: true,
            cwd: 'worker',
            dest: '<%= config.dist %>/worker',
            src: '*'
          }
        ]
      }
    },
    useminPrepare: {
      app: {
        src: '<%= config.app %>/index.html'
      },
      oauth: {
        src: '<%= config.app %>/oauth/index.html',
        options: {
          root: '<%= config.app %>/oauth',
          dest: 'dist/oauth'
        }
      }
    },
    'usemin': {
      html: ['dist/oauth/index.html', 'dist/index.html']
    },
    karma: {
      dev: {
        configFile: '<%= config.test %>/dev.karma.conf.js'
      },
      travis: {
        configFile: '<%= config.test %>/travis.karma.conf.js'
      }
    },
    coveralls: {
      options: {
        debug: false,
        /*jshint camelcase:false*/
        coverage_dir: 'test/coverage',
        force: false
      }
    }
  });

  grunt.registerTask('processTmpl', function (target) {
    var options = config.build.dist;
    var tmpl = grunt.file.read('grunt/options.tmpl');
    var pkg = grunt.file.readJSON('package.json');
    if ('dev' === target) {
      options = config.build.dev;
    }
    options.version = pkg.version;
    var processedTmpl = grunt.template.process(tmpl, {
      data: options
    });
    grunt.file.write('client/app/options.js', processedTmpl);
  });

  grunt.registerTask('checkoutWebsite', function () {
    var done = this.async();
    var childProcess = require('child_process');
    var exec = childProcess.exec;
    exec('rm -fr /tmp/gh-review.pages/ 2> /dev/null && git clone --reference ./ -b gh-pages git@github.com:Dica-Developer/gh-review.git /tmp/gh-review.pages', function (error, stdout, stderr) {
      var result = true;
      if (stdout) {
        grunt.log.write(stdout);
      }
      if (stderr) {
        grunt.log.write(stderr);
      }
      if (error !== null) {
        grunt.log.error(error);
        result = false;
      }
      done(result);
    });
  });

  grunt.registerTask('cleanDeploy', function () {
    var done = this.async();
    var childProcess = require('child_process');
    var exec = childProcess.exec;
    exec('rm -r /tmp/gh-review.pages/*', function () {
      done(true);
    });
  });

  grunt.registerTask('commitAndPush', function () {
    var done = this.async();
    var childProcess = require('child_process');
    var exec = childProcess.exec;
    exec('cd /tmp/gh-review.pages && git add --all . && git commit -m "* deploy release" && git push', function (error, stdout, stderr) {
      var result = true;
      if (stdout) {
        grunt.log.write(stdout);
      }
      if (stderr) {
        grunt.log.write(stderr);
      }
      if (error !== null) {
        grunt.log.error(error);
        result = false;
      }
      done(result);
    });
  });

  grunt.registerTask('postProcess', function () {
    var done = this.async();
    var fs = require('fs');
    var collectorJs = fs.readFileSync('dist/worker/collector.js', {
      encoding: 'UTF8'
    });
    collectorJs = collectorJs.replace('../../bower_components/lodash/dist/lodash.min.js', '../lodash.min.js');
    fs.writeFileSync('dist/worker/collector.js', collectorJs, {
      encoding: 'UTF8'
    });
    done();
  });

  grunt.registerTask('dist', function(template){
    grunt.task.run([
      'clean:dist',
      'less:dist',
      'processTmpl:' + (template || 'dist'),
      'copy:dist',
      'useminPrepare',
      'concat:generated',
      'uglify:generated',
      'usemin',
      'postProcess'
    ]);
  });

  grunt.registerTask('devWatch', [
    'jshint',
    'less:dev',
    'copy:dev'
  ]);

  grunt.registerTask('dev', [
    'clean:dev',
    'jshint',
    'processTmpl:dev',
    'copy:dev',
    'less:dev',
    'connect:dev',
    'watch'
  ]);

  grunt.registerTask('test', [
    'karma:dev'
  ]);

  grunt.registerTask('travis', [
    'processTmpl:dev',
    'karma:travis',
    'coveralls'
  ]);

  grunt.registerTask('setNewVersion', function () {
    var packageJson = grunt.file.readJSON('package.json');
    var version = packageJson.version.split('.');
    version[2] = parseInt(version[2], 10) + 1;
    packageJson.version = version[0] + '.' + version[1] + '.' + version[2];
    grunt.file.write('package.json', JSON.stringify(packageJson, null, 2));
  });

  grunt.registerTask('deploy', [
    'karma:travis',
    'setNewVersion',
    'dist',
    'checkoutWebsite',
    'cleanDeploy',
    'copy:deploy',
    'commitAndPush'
  ]);
};
