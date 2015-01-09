/*jshint camelcase: false*/

module.exports = function (grunt) {
    'use strict';

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-karma-coveralls');
    var config = {
        dist: 'dist',
        coverage: 'test/coverage',
        buildFiles: 'buildFiles',
        test: 'test'
    };

    grunt.initConfig({
        config: config,
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= config.dist %>/*'
                    ]
                }]
            }
        },
        jsdoc : {
            requirejs_dist : {
                src: ['<%= config.lib %>/*.js', '<%= config.api %>/*.js', 'README.md'],
                options: {
                    destination: 'doc',
                    configure: 'jsdoc.conf.json',
                    template: 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template',
                    tutorials: 'tutorials'
                }
            }
        },
        uglify: {
            options: {
                mangle: {
                    except: ['URL']
                },
                sourceMap: true,
                sourceMapName: '<%= config.dist %>/sourcemap.map'
            },
            dist: {
                files: {
                    '<%= config.dist %>/github.min.js': ['<%= config.dist %>/github.js']
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
                coverage_dir: 'test/coverage'
            }
        }
    });

    grunt.registerTask('test', [
        'build',
        'karma:dev'
    ]);

    grunt.registerTask('travis', [
        'build',
        'karma:travis',
        'coveralls'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'buildScript',
        'uglify:dist'
    ]);

    grunt.registerTask('buildScript', function () {
        var AppTpl = grunt.file.read(config.buildFiles+ '/index.js.tpl', 'utf8'),
            SectionTpl = grunt.file.read(config.buildFiles+ '/section.js.tpl', 'utf8'),
            HandlerTpl = grunt.file.read(config.buildFiles+ '/handler.js.tpl', 'utf8'),
            AfterRequestTpl = grunt.file.read(config.buildFiles+ '/after_request.js.tpl', 'utf8'),
            routes = grunt.file.readJSON(config.buildFiles+ '/routes.json'),
            github = grunt.file.read(config.buildFiles+ '/github.js'),
            util = grunt.file.read(config.buildFiles+ '/util.js'),
            httpError = grunt.file.read(config.buildFiles+ '/HttpError.js'),
            TestHandlerTpl = grunt.file.read(config.buildFiles+ '/test_handler.js.tpl'),
            TestSectionTpl = grunt.file.read(config.buildFiles+ '/test_section.js.tpl'),
            defines = routes.defines,
            headers = defines['response-headers'],
            sections = {}, testSections = {}, api = [];


        delete routes.defines;

        if (headers && headers.length) {
            headers = headers.map(function (header) {
                return header.toLowerCase();
            });
        }

        function toCamelCase(str, upper) {
            str = str.toLowerCase().replace(/(?:(^.)|(\s+.)|(-.))/g, function (match) {
                return match.charAt(match.length - 1).toUpperCase();
            });
            if (upper) {
                return str;
            }
            return str.charAt(0).toLowerCase() + str.substr(1);
        }

        function getParams(paramsStruct, indent) {
            var params = Object.keys(paramsStruct), values = [], def;

            if (!params.length){
                return '{}';
            }

            params.forEach(function(paramName){
                if (paramName.charAt(0) === '$') {
                    paramName = paramName.substr(1);
                    if (!defines.params[paramName]) {
                        grunt.fail.fatal('Invalid variable parameter name substitution; param ' + paramName + ' not found in defines block');
                        process.exit(1);
                    } else{
                        def = defines.params[paramName];
                    }
                } else {
                    def = paramsStruct[paramName];
                }

                values.push(indent + '    ' + paramName + ': \'' + def.type + '\'');

            });
            return '{\n' + values.join(',\n') + '\n' + indent + '}';
        }

        function prepareApi(struct, baseType) {
            baseType = baseType || '';

            Object.keys(struct).forEach(function (routePart) {
                var block = struct[routePart],
                    messageType = baseType + '/' + routePart;

                if (!block) {
                    return;
                }

                if (!block.url && !block.params) {
                    prepareApi(block, messageType);
                } else {
                    var parts = messageType.split('/');
                    var sectionName = toCamelCase(parts[1].toLowerCase());
                    if (!block.method) {
                        grunt.fail.fatal('No HTTP method specified for ' + messageType + ' in section ' + sectionName);
                    }

                    parts.splice(0, 2);
                    var funcName = toCamelCase(parts.join('-'));
                    var funcNameDash = parts.join('-');

                    if (!sections[sectionName]) {
                        sections[sectionName] = [];
                    }


                    var afterRequestTmpl = '';
                    if (headers && headers.length) {
                        afterRequestTmpl = grunt.template.process(AfterRequestTpl, {
                            data: {
                                headers: '\'' + headers.join('\', \'') + '\''
                            }
                        });
                    }

                    var options = {
                        data: {
                            sectionName: sectionName,
                            funcName: funcName,
                            funcNameDash: funcNameDash,
                            afterRequest: afterRequestTmpl
                        }
                    };
                    var handlerTemplate = grunt.template.process(HandlerTpl, options);
                    sections[sectionName].push(handlerTemplate);

                    if (!testSections[sectionName]){
                        testSections[sectionName] = [];
                    }

                    var testHandlerTemplate = grunt.template.process(TestHandlerTpl, {
                        data: {
                            name: block.method + ' ' + block.url + ' (' + funcName + ')',
                            funcName: sectionName + '.' + funcName,
                            params: getParams(block.params, '                ')
                        }
                    });
                    testSections[sectionName].push(testHandlerTemplate);
                }
            });
        }

        prepareApi(routes);

        Object.keys(sections).forEach(function (sectionName) {
            var options = {
                    data: {
                        section: sectionName,
                        sectionBody: sections[sectionName].join('\n')
                    }
                },
                sectionTemplate = grunt.template.process(SectionTpl, options),
                testSectionTemplate = grunt.template.process(TestSectionTpl, {
                    data: {
                        sectionName: sectionName,
                        testBody: testSections[sectionName].join('\n')
                    }
                });

            api.push(sectionTemplate);
//            grunt.file.write(config.test + '/new/' + sectionName + '-spec.js', testSectionTemplate, 'utf8');
        });

        routes.defines = defines;
        var sectionNames = Object.keys(sections),
            appTemplate = grunt.template.process(AppTpl, {
                data: {
                    sections: sectionNames,
                    routes: JSON.stringify(routes),
                    github: github,
                    util: util,
                    httpError: httpError,
                    api: api.join('\n\n\n')
                }
            });

        grunt.file.write(config.dist + '/github.js', appTemplate, 'utf8');
    });

};
