/**
 * Borrowed from https://github.com/DaftMonk/generator-angular-fullstack
 */

(function (angular) {
  'use strict';

  angular.module('GHReview')
    .factory('Modal', function ($rootScope, $modal, _) {

      function openModal(scope, modalClass, templateUrl) {
        var modalScope = $rootScope.$new();
        scope = scope || {};
        modalClass = modalClass || 'modal-default';
        templateUrl = templateUrl || 'components/modal/modal.html';

        angular.extend(modalScope, scope);

        return $modal.open({
          templateUrl: templateUrl,
          windowClass: modalClass,
          scope: modalScope
        });
      }

      // Public API here
      return {

        selectFilterToImport: function (cb) {
          cb = cb || angular.noop;

          return function (filterList) {
            var importFilterModal,
              filterToImport = [];

            importFilterModal = openModal({
              modal: {
                filterList: filterList,
                filterInList: function (filter) {
                  return _.findIndex(filterToImport, filter) > -1;
                },
                toggleFilter: function (filter) {
                  var filterIndex = _.findIndex(filterToImport, filter);
                  if (filterIndex > -1) {
                    filterToImport.splice(filterIndex, 1);
                  } else {
                    filterToImport.push(filter);
                  }
                },
                dismissable: true,
                title: 'Select filter to import',
                buttons: [
                  {
                    classes: 'btn-success',
                    text: 'Import',
                    click: function () {
                      importFilterModal.close();
                    }
                  },
                  {
                    classes: 'btn-default',
                    text: 'Cancel',
                    click: function () {
                      importFilterModal.dismiss();
                    }
                  }
                ]
              }
            }, 'modal-default', 'components/modal/select-filter-to-import.html');

            importFilterModal.result.then(function () {
              cb(filterToImport);
            });
          };
        }
      };
    });
}(angular));
