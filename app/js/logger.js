/*global define*/
define(['log4javascript'], function(log4javascript){
  'use strict';

  function Logger(name){
    this.name = name;
    this.logger = log4javascript.getLogger(this.name);

    this.appender = new log4javascript.BrowserConsoleAppender();
    this.appender.setThreshold(log4javascript.Level.TRACE);
    this.layout = new log4javascript.PatternLayout('%r [%c] %l{r:l:c} %-5p %m');
    this.appender.setLayout(this.layout);

    this.logger.addAppender(this.appender);
    this.logger.setLevel(log4javascript.Level.ALL);

    return this.logger;
  }

  return Logger;
});
