/* global module*/
module.exports = function (grunt) {
  'use strict';

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-karma-coveralls');

  var config = {
    app: 'app',
    dev: 'dev',
    dist: 'dist',
    test: 'test',
    coverage: 'test/coverage',
    distOptions: {
      clientId: '833c028df47be8e881d9',
      apiScope: 'user, repo',
      redirectUri: 'http://dica-developer.github.io/gh-review/',
      accessTokenUrl: 'http://gh-review.herokuapp.com/login/oauth/access_token'
    },
    devOptions: {
      clientId: '5082108e53d762d90c00',
      apiScope: 'user, repo',
      redirectUri: 'http://localhost:9000',
      accessTokenUrl: 'http://gh-review.herokuapp.com/bemdsvdsynggmvweibduvjcbgf'
    }
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
    protractor: {
      options: {
        configFile: '<%= config.test %>/e2e/conf.js',
        keepAlive: false,
        noColor: false,
        args: {
          sauceUser: 'JayGray',
          sauceKey: 'a8751009-5b79-4117-b990-507d09465216'
        }
      },
      startPage: {
        options: {
          args: {
            suite: 'startWithToken',
            capabilities: {
              browserName: 'firefox'
            }
          }
        }
      },
      reviewModules: {
        options: {
          args: {
            suite: 'reviewModules'
          }
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
          '<%= config.app %>/worker/**/*',
          '<%= config.app %>/*.html',
          '<%= config.app %>/templates/**/*',
          '!<%= config.app %>/bower_components/*'
        ],
        tasks: ['devWatch']
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
            src: ['js/worker/*', 'img/**/*', 'templates/**/*', 'fonts/**/*', '*.html']
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
      html: 'app/index.html'
    },
    'usemin': {
      html: 'dist/index.html'
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
    var options = config.distOptions;
    var tmpl = grunt.file.read('build-templates/options.tmpl');
    var pkg = grunt.file.readJSON('package.json');
    if ('dev' === target) {
      options = config.devOptions;
    }
    options.version = pkg.version;
    var processedTmpl = grunt.template.process(tmpl, {
      data: options
    });
    grunt.file.write('app/js/options.js', processedTmpl);
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
    var collectorJs = fs.readFileSync('dist/js/worker/collector.js', {
      encoding: 'UTF8'
    });
    collectorJs = collectorJs.replace('../../bower_components/lodash/dist/lodash.min.js', '../lodash.min.js');
    fs.writeFileSync('dist/js/worker/collector.js', collectorJs, {
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
    'watch:dev'
  ]);

  grunt.registerTask('e2e', [
    'dist:dev',
    'connect:e2e',
    'protractor:startPage',
    'protractor:reviewModules'
  ]);

  grunt.registerTask('test', [
    'karma:dev'
  ]);

  grunt.registerTask('travis', [
    'processTmpl:dev',
    'karma:travis',
    'e2e',
    'coveralls'
  ]);

  grunt.registerTask('deploy', [
    'karma:travis',
    'dist',
    'checkoutWebsite',
    'cleanDeploy',
    'copy:deploy',
    'commitAndPush'
  ]);
};
