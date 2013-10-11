/*global define*/
define(['underscore'], function (_) {
  'use strict';
  var nwGui = window.nwDispatcher.requireNwGui();
  var argv = nwGui.App.argv;
  var options = {
    loginName: null,
    loginPass: null,
    org: null,
    repo: null
  };
  var args = {};
  argv.forEach(function (val) {
    if (val.indexOf('--') > -1) {
      var arg = val.replace('--', '').split('=');
      args[arg[0]] = arg[1] || null;
    }
  });
  _.extend(options, args);

  return options;
});
