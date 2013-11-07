/*global define*/
define(['options'], function (options) {
  'use strict';

  var os = require('os');
//  var colors = require('colors');
//  var stdColors = {
//    log : colors.black,
//    trace : colors.magenta,
//    debug : colors.cyan,
//    info : colors.green,
//    network: colors.blue,
//    warn : colors.yellow,
//    error : [ colors.red, colors.bold ]
//  };
//  var inversColors = {
//    log : colors.white,
//    trace : [colors.magenta, colors.inverse],
//    debug : [colors.cyan, colors.inverse],
//    info : [colors.green, colors.inverse],
//    network: [colors.blue, colors.inverse],
//    warn : [colors.yellow, colors.inverse],
//    error : [ colors.red, colors.bold, colors.inverse]
//  };
  return require('tracer').console({
    'format': [
      '{{timestamp}} <{{title}}> {{message}}',
      {
        error: '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})' + os.EOL + 'Call Stack:{{stacklist}}',
        warn: '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})' + os.EOL
      }
    ],
    'preprocess': function (data) {
      if (data.title === 'error') {
        var callstack = '', len = data.stack.length;
        for (var i = 0; i < len; i += 1) {
          callstack += '\n' + data.stack[i];
        }
        data.stacklist = callstack;
      }

      data.title = data.title.toUpperCase();
    },
    'level': options.logLevel,
    'dateformat': 'yyyy-dd-mm HH:MM:ss.l',
    methods: [ 'log', 'trace', 'debug', 'info', 'network', 'warn', 'error' ]
    //filters: options.logInvert ? inversColors : stdColors
  });
});
