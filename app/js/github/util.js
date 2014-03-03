/*global define*/
define(function () {
  'use strict';

  /** section: github
   * class Util
   *
   *  Copyright 2012 Cloud9 IDE, Inc.
   *
   *  This product includes software developed by
   *  Cloud9 IDE, Inc (http://c9.io).
   *
   *  Author: Mike de Boer <mike@c9.io>
   **/

  function Utils() {
  }

  /**
   *  Util#extend(dest, src, noOverwrite) -> Object
   *      - dest (Object): destination object
   *      - src (Object): source object
   *      - noOverwrite (Boolean): set to `true` to overwrite values in `src`
   *
   *  Shallow copy of properties from the `src` object to the `dest` object. If the
   *  `noOverwrite` argument is set to to `true`, the value of a property in `src`
   *  will not be overwritten if it already exists.
   **/
  Utils.prototype.extend = function (dest, src, noOverwrite) {
    for (var prop in src) {
      if (!noOverwrite || typeof dest[prop] === 'undefined') {
        dest[prop] = src[prop];
      }
    }
    return dest;
  };

  /**
   *  Util#escapeRegExp(str) -> String
   *      - str (String): string to escape
   *
   *  Escapes characters inside a string that will an error when it is used as part
   *  of a regex upon instantiation like in `new RegExp("[0-9" + str + "]")`
   **/
  Utils.prototype.escapeRegExp = function (str) {
    return str.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
  };

  /**
   *  Util#toCamelCase(str, [upper]) -> String
   *      - str (String): string to transform
   *      - upper (Boolean): set to `true` to transform to CamelCase
   *
   *  Transform a string that contains spaces or dashes to camelCase. If `upper` is
   *  set to `true`, the string will be transformed to CamelCase.
   *
   *  Example:
   *
   *      Util.toCamelCase("why U no-work"); // returns 'whyUNoWork'
   *      Util.toCamelCase("I U no-work", true); // returns 'WhyUNoWork'
   **/
  Utils.prototype.toCamelCase = function (str, upper) {
    str = str.toLowerCase().replace(/(?:(^.)|(\s+.)|(-.))/g, function (match) {
      return match.charAt(match.length - 1).toUpperCase();
    });
    if (upper) {
      return str;
    }
    return str.charAt(0).toLowerCase() + str.substr(1);
  };

  /**
   *  Util#isTrue(c) -> Boolean
   *      - c (mixed): value the variable to check. Possible values:
   *          true   The function returns true.
   *          'true' The function returns true.
   *          'on'   The function returns true.
   *          1      The function returns true.
   *          '1'    The function returns true.
   *
   *  Determines whether a string is true in the html attribute sense.
   **/
  Utils.prototype.isTrue = function (c) {
    return (c === true || c === 'true' || c === 'on' || typeof c === 'number' && c > 0 || c === '1');
  };

  /**
   *  Util#isFalse(c) -> Boolean
   *      - c (mixed): value the variable to check. Possible values:
   *          false   The function returns true.
   *          'false' The function returns true.
   *          'off'   The function returns true.
   *          0       The function returns true.
   *          '0'     The function returns true.
   *
   *  Determines whether a string is false in the html attribute sense.
   **/
  Utils.prototype.isFalse = function (c) {
    return (c === false || c === 'false' || c === 'off' || c === 0 || c === '0');
  };

  return new Utils();
});