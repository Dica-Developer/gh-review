/*global define*/
define([
  'backbone',
  'underscore',
  'when',
  'app',
  'FilterModel',
  'text!templates/repo-detail-view.html'
], function (Backbone, _, when, app, FilterModel, template) {
  'use strict';

  var RepoView = Backbone.View.extend({
    el: '#main',
    template: _.template(template),
    initialize: function () {
      this.filterModel = new FilterModel();
      this.filterModel.set('owner', this.model.get('owner').login);
      this.filterModel.set('repo', this.model.get('name'));
      app.filterCollection.on('all', this.render, this);
      this.listenTo(this.filterModel, 'change', this.render);
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
      var existingReviews = app.filterCollection.where({
        repo: this.model.get('name')
      });
      return {
        existingReviews: existingReviews,
        repo: this.model.toJSON(),
        filter: this.filterModel.toJSON()
      };
    },
    checkAlreadyExist: function () {
      var alreadyExist = app.filterCollection.where(this.filterModel.toJSON());
      if (alreadyExist.length > 0) {
        this.disableButton();
      } else {
        this.enableButton();
      }
    },
    addFilter: function (event) {
      var target = this.$(event.target);
      var filter = _.str.capitalize(target.data('filter'));
      this['add' + filter].call(this);
    },
    changeFilter: function (event) {
      var target = this.$(event.target);
      var filter = _.str.capitalize(target.data('filter'));
      this['change' + filter].call(this, target);
    },
    addBranch: function () {
      this.filterModel.set('branch', 'master');
    },
    addContributor: function () {
      this.filterModel.set('contributor', ' ');
    },
    addSince: function () {
      this.filterModel.set('since', {
        amount: 1,
        pattern: 'weeks'
      });
    },
    addUntil: function () {
      this.filterModel.set('until', _.moment());
    },
    addPath: function () {
      this.filterModel.set('path', ' ');
    },
    changeBranch: function (target) {
      this.filterModel.set('branch', target.val());
    },
    changeContributor: function (target) {
      this.filterModel.set('contributor', target.val());
    },
    changeSince: function (target) {
      var since = this.filterModel.get('since');
      if (target.is('input')) {
        since.amount = target.val();
      } else if (target.is('select')) {
        since.pattern = target.find(':selected').val();
      }
      this.filterModel.set('since', since);
    },
    changeUntil: function () {
      this.filterModel.set('until', _.moment());
    },
    changePath: function () {
      this.filterModel.set('path', ' ');
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
      var model = app.filterCollection.get(modelCid);
      model.destroy();
    },
    addReview: function () {
      app.filterCollection.create(this.filterModel);
      app.announceRepositories();
    },
    getFurtherInformations: function () {
      var promises = [];
      promises.push(this.model.getBranches());
      promises.push(this.model.getContributors());
      return promises;
    },
    checkDatePicker: function () {
      if (this.$('#sinceDatepicker').length > 0) {
        this.$('#sinceDatepicker').datepicker();
      }
    },
    render: function () {
      this.$el.html(this.template(this.serialize()));
      this.checkAlreadyExist();
      app.showIndicator(false);
    }
  });

  return RepoView;
});