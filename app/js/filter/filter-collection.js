/*global define*/
define(['backbone', 'FilterModel', 'backboneLocalStorage'], function (Backbone, FilterModel) {
  'use strict';

  return Backbone.Collection.extend({
    model: FilterModel,
    localStorage: new Backbone.LocalStorage('filter'),
    initialize: function () {
      this.fetch();
    }
  });
});