(function (angular) {
  'use strict';

  angular.module('GHReview').
    service('filterUtils', ['_', 'moment', 'localStorageService', function (_, moment, localStorageService) {

      var defaultOptions = {
        repo: null,
        user: null,
        sha: 'master',
        since: {
          pattern: 'weeks',
          amount: 2
        },
        until: {},
        path: null,
        authors: [],
        contributor: null,
        meta: {
          isSaved: false,
          lastEdited: null,
          customFilter: {
            excludeOwnCommits: false
          },
          id: null
        }
      };

      function fastClone(object) {
        return JSON.parse(JSON.stringify(object));
      }

      function generateUUID() {
        var d = new Date().getTime();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
      }

      function getFilterIds() {
        var filterIds = [];
        var filterIdsString = localStorageService.get('filter');
        if (angular.isString(filterIdsString)) {
          filterIds = filterIdsString.split(',');
        }
        return filterIds;
      }

      function getFromLocalStorage(id) {
        return localStorageService.get('filter-' + id);
      }

      function addIdToLocalStorage(id) {
        var filterIds = getFilterIds();
        if (filterIds.indexOf(id) === -1) {
          filterIds.push(id);
          localStorageService.set('filter', filterIds.join(','));
        }
      }

      function addSettingsToLocalStorage(id, options) {
        localStorageService.set('filter-' + id, JSON.stringify(options));
      }

      this.getOptions = function (filterId, isInit) {
        var options = fastClone(defaultOptions);
        filterId = filterId || null;

        if (isInit && filterId) {
          var storedSettings = getFromLocalStorage(filterId);
          _.extend(options, storedSettings);
        } else if (isInit && !filterId) {
          options.meta.id = generateUUID();
          options.meta.isNew = true;
        } else {
          options.meta.lastEdited = new Date().getTime();
          options.meta.id = generateUUID();
        }
        return options;
      };

      this.getCommentsUrl = function (options) {
        var url = 'https://api.github.com/repos/';
        if (options.user && !(/^\s*$/).test(options.user)) {
          url += options.user + '/';
        }
        url += options.repo + '/comments';
        url += '?per_page=100';
        return url;
      };

      this.getSinceDate = function (options) {
        var sinceDate = null;
        if (!_.isUndefined(options.since) && _.size(options.since) === 2) {
          sinceDate = moment().startOf('minute').subtract(options.since.amount, options.since.pattern).toISOString();
        }
        return sinceDate;
      };

      this.getSinceDateISO = function (options) {
        var sinceDate = null;
        if (!_.isUndefined(options.since) && _.size(options.since) === 2) {
          sinceDate = moment().subtract(options.since.amount, options.since.pattern).startOf('day').toISOString();
        }
        return sinceDate;
      };

      this.prepareGithubApiCallOptions = function (filter, prepareForStandup) {
        var options = fastClone(filter.options),
          preparedGithubOptions = {};

        _.each(options, function (value, key) {
          if ('authors' === key) {
            if (value.length === 1) {
              preparedGithubOptions.author = value[0];
            } else if (value.length > 1) {
              //Attention manipulation original filter settings
              filter.setCustomFilter.call(filter, 'authors', value);
            }
          } else if (key === 'since' && value !== null) {
            preparedGithubOptions.since = this.getSinceDateISO(options);
          } else if (key === 'until' && value !== null) {
            //TODO set correct until value
          } else if ('meta' !== key && value !== null) {
            preparedGithubOptions[key] = value;
          }

          if (prepareForStandup) {
            preparedGithubOptions.since = moment().subtract(24, 'hours').toISOString();
          }
        }, this);
        return preparedGithubOptions;
      };

      this.storeFilterToLocalStorage = function (id, options) {
        addIdToLocalStorage(id);
        addSettingsToLocalStorage(id, options);
      };

    }]);

}(angular));
