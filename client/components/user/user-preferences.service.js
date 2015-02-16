(function (angular) {
  'use strict';

  angular.module('GHReview')
    .service('userPref', ['localStorageService', function (localStorageService) {
      var preferences = localStorageService.get('preferences') || {};

      this.save = function () {
        localStorageService.set('preferences', preferences);
      };

      this.getAll = function () {
        return preferences;
      };

      this.getFilterList = function (key) {
        var pref = preferences.filterList || null;
        if (preferences.filterList && key) {
          pref = preferences.filterList[key];
        }
        return pref;
      };

      this.setFilterList = function (key, value) {
        preferences.filterList = preferences.filterList || {};
        preferences.filterList[key] = value;
        this.save();
      };

      this.getFileView = function (key) {
        var pref = preferences.fileView || null;
        if (preferences.fileView && key) {
          pref = preferences.fileView[key];
        }
        return pref;
      };

      this.setFileView = function (key, value) {
        preferences.fileView = preferences.fileView || {};
        preferences.fileView[key] = value;
        this.save();
      };

    }]);
}(angular));

