    var Util = function () {
    };

    Util.prototype.escapeRegExp = function (str) {
        return str.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
    };

    Util.prototype.toCamelCase = function (str, upper) {
        upper = upper || false;
        str = str.toLowerCase().replace(/(?:(^.)|(\s+.)|(-.))/g, function (match) {
            return match.charAt(match.length - 1).toUpperCase();
        });
        if (!upper) {
            str = str.charAt(0).toLowerCase() + str.substr(1);
        }
        return str;
    };

    Util.prototype.isTrue = function (value) {
        return (value === true || value === 'true' || value === 'on' || typeof value === 'number' && value > 0 || value === '1');
    };

    Util.prototype.isFalse = function (value) {
        return (value === false || value === 'false' || value === 'off' || value === 0 || value === '0');
    };

    var consoleTypes = ['info', 'log', 'warn', 'error'];

    consoleTypes.forEach(function (type) {
        Util.prototype[type] = function () {
            if (typeof console !== 'undefined' && typeof console[type] !== 'undefined') {
                return console[type].apply(console, arguments);
            } else {
                return null;
            }
        };
    });

    var util = new Util();