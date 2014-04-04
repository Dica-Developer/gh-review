/*jshint camelcase: false*/

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
    distOptions: {
      clientId: '833c028df47be8e881d9',
      apiScope: 'user, public_repo',
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
        files: [{
          dot: true,
          src: [
            '<%= config.dist %>/*'
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
        files: [{
          expand: true,
          cwd: './dist',
          dest: '/tmp/gh-review.pages',
          src: '**'
        }]
      },
      dev: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dev %>',
          src: '**'
        }, {
          expand: true,
          cwd: '<%= config.app %>/bower_components/bootstrap/dist/fonts',
          dest: '<%= config.dev %>/fonts',
          src: '*'
        }, {
          expand: true,
          cwd: '<%= config.app %>/bower_components/requirejs',
          dest: '<%= config.dev %>/js',
          src: 'require.js'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: ['worker/**/*', 'img/**/*', 'templates/**/*', 'fonts/**/*', '*.html']
        }, {
          expand: true,
          cwd: '<%= config.app %>/bower_components/bootstrap/dist/fonts',
          dest: '<%= config.dist %>/fonts',
          src: '*'
        }, {
          expand: true,
          cwd: '<%= config.app %>/bower_components/requirejs',
          dest: '<%= config.dist %>/js',
          src: 'require.js'
        }]
      }
    },
    requirejs: {
      options: {
        loglevel: 5,
        findNestedDependencies: true,
        inlineText: true,
        mainConfigFile: 'app/js/main.js'
      },
      dist: {
        options: {
          out: '<%= config.dist %>/js/main.js',
          optimize: 'uglify',
          name: 'main'
        }
      }
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
        debug: true,
        coverage_dir: 'coverage'
      }
    },
    jsdoc : {
      dist : {
        src: ['<%= config.app %>/js/**/*.js'],
        options: {
          destination: 'doc',
          configure: 'jsdoc.conf.json',
          template: 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template'
        }
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

  grunt.registerTask('version', function (versionString) {
    var pkg = grunt.file.readJSON('package.json');
    var versionSplit = pkg.version.split('.');
    var major = parseInt(versionSplit[0], 10);
    var minor = parseInt(versionSplit[1], 10);
    var patch = parseInt(versionSplit[2], 10);
    switch (versionString) {
    case 'major':
      major = major + 1;
      versionSplit[0] = major;
      versionSplit[1] = 0;
      versionSplit[2] = 0;
      break;
    case 'minor':
      minor = minor + 1;
      versionSplit[1] = minor;
      versionSplit[2] = 0;
      break;
    case 'patch':
      patch = patch + 1;
      versionSplit[2] = patch;
      break;
    default:
      versionSplit = versionString.split('.');
    }
    pkg.version = versionSplit.join('.');
    grunt.file.write('package.json', JSON.stringify(pkg, null, 2));
  });

  grunt.registerTask('cleanDeploy', function () {
    var done = this.async();
    var childProcess = require('child_process');
    var exec = childProcess.exec;
    exec('rm -r /tmp/gh-review.pages/*', function () {
      done(true);
    });
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

  grunt.registerTask('dist', [
    'clean:dist',
    'jshint',
    'processTmpl:dist',
    'copy:dist',
    'less:dist',
    'requirejs:dist'
  ]);

  grunt.registerTask('travis', [
    'karma:travis',
    'coveralls'
  ]);

  grunt.registerTask('test', [
    'karma:dev'
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
