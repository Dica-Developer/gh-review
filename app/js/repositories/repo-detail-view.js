/*global define*/
define([
  'backbone',
  'underscore',
  'when',
  'app',
  'reviewCollection',
  'reviewItemModel',
  'text!../templates/repo-detail-view.html'
], function (Backbone, _, when, app, reviewCollection, ReviewItemModel, template) {
  'use strict';

  var RepoView = Backbone.View.extend({
    el: '#main',
    template: _.template(template),
    initialize: function () {
      this.reviewModel = new ReviewItemModel();
      this.reviewModel.set('user', this.model.get('owner').login);
      this.reviewModel.set('repo', this.model.get('name'));
      reviewCollection.on('all', this.render, this);
      this.listenTo(this.reviewModel, 'change', this.render);
      when.all(this.getFurtherInformations(), this.render.bind(this));
    },
    events: {
      'click #addReview': 'addReview',
//      'change .filterSelector': 'checkAlreadyExist',
      'change .filterSelector': 'changeFilter',
      'click .destroy': 'removeReview',
      'click .filter': 'addFilter'
    },
    serialize: function () {
      var existingReviews = reviewCollection.where({repo: this.model.get('name')});
      return {
        existingReviews: existingReviews,
        repo: this.model.toJSON(),
        filter: this.reviewModel.toJSON()
      };
    },
    checkAlreadyExist: function () {
      var alreadyExist = reviewCollection.where(this.reviewModel.toJSON());
      if (alreadyExist.length > 0) {
        this.disableButton();
      } else {
        this.enableButton();
      }
    },
    addFilter: function(event){
      var target = this.$(event.target);
      var filter = _.str.capitalize(target.data('filter'));
      this['add' + filter].call(this);
    },
    changeFilter: function(event){
      var target = this.$(event.target);
      var filter = _.str.capitalize(target.data('filter'));
      this['change' + filter].call(this, target);
    },
    addBranch: function(){
      this.reviewModel.set('branch', 'master');
    },
    addContributor: function(){
      this.reviewModel.set('contributor', ' ');
    },
    addSince: function(){
      this.reviewModel.set('since', {amount: 1, pattern: 'weeks'});
    },
    addUntil: function(){
      this.reviewModel.set('until', _.moment());
    },
    addPath: function(){
      this.reviewModel.set('path', ' ');
    },
    changeBranch: function(target){
      this.reviewModel.set('branch', target.val());
    },
    changeContributor: function(target){
      this.reviewModel.set('contributor', target.val());
    },
    changeSince: function(target){
      var since = this.reviewModel.get('since');
      if(target.is('input')){
        since.amount = target.val();
      } else if(target.is('select')){
        since.pattern = target.find(':selected').val();
      }
      this.reviewModel.set('since', since);
    },
    changeUntil: function(){
      this.reviewModel.set('until', _.moment());
    },
    changePath: function(){
      this.reviewModel.set('path', ' ');
    },
    disableButton: function () {
      this.$('#addReview').attr('disabled', 'disabled');
    },
    enableButton: function () {
      this.$('#addReview').removeAttr('disabled');
    },
    getBranch: function () {
      return $('#branchList').find(':selected').val();
    },
    getContributor: function () {
      return $('#contributorsList').find(':selected').val();
    },
    removeReview: function (event) {
      var modelCid = $(event.target).data('cid');
      var model = reviewCollection.get(modelCid);
      model.destroy();
    },
    addReview: function () {
      reviewCollection.create(this.reviewModel);
    },
    getFurtherInformations: function () {
      var promises = [];
      promises.push(this.model.getBranches());
      promises.push(this.model.getContributors());
      return promises;
    },
    checkDatePicker: function(){
      if(this.$('#sinceDatepicker').length > 0){
        this.$('#sinceDatepicker').datepicker();
      }
    },
    render: function () {
      app.showIndicator(false);
      this.$el.html(this.template(this.serialize()));
      this.checkAlreadyExist();
    }
  });

  return RepoView;
});
