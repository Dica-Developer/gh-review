(function(){
  'use strict';

  var util = require('util');
  exports.assertion = function(selector, min, msg) {

    this.message = msg || util.format('Testing if element <%s> is at lease %d times present.', selector, min);
    this.expected = min;

    this.pass = function(value) {
      return value >= min;
    };

    this.value = function(result) {
      var value = 0;
      if (result.status === 0) {
        value = result.value.length;
      }
      return value;
    };

    this.command = function(callback) {
      return this.api.elements(this.client.locateStrategy, selector, callback);
    };

  };

}());
