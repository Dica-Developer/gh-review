/*global define*/
define(['backbone', 'backboneLocalStorage', 'commitModel'], function(Backbone, BackboneLocalStorage, CommitModel){
  'use strict';
  var CommitsCollection = Backbone.Collection.extend({
    model: CommitModel,
    localStorage: new BackboneLocalStorage('commits'),
    initialize: function(){

    }
  });

  return new CommitsCollection();
});
