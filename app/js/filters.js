define(['angular', 'services'], function (angular/*, services*/) {
    'use strict';

    /* Filters */

    angular.module('GHReview.filters', ['GHReview.services'])
        .filter('interpolate', ['version', function (version) {
            return function (text) {
                return String(text).replace(/\%VERSION\%/mg, version);
            };
        }]);
});
