/*global define*/
define([
  'backbone',
  'underscore',
  'when',
  'app',
  'reviewCollection',
  'text!../templates/repo-detail-view.html'
], function (Backbone, _, when, app, reviewCollection, template) {
  'use strict';

  var RepoView = Backbone.View.extend({
    el: '#main',
    template: _.template(template),
    initialize: function () {
      var _this = this;
      reviewCollection.on('all', this.render, this);
      when.all(this.getFurtherInformations(), function () {
        _this.render();
      });
    },
    events: {
      'click #addReview': 'addReview',
      'change #contributorsList, #branchList': 'checkAlreadyExist',
      'click .destroy': 'removeReview'
    },
    serialize: function () {
      var existingReviews = reviewCollection.where({repo: this.model.get('name')});
      return {
        existingReviews: existingReviews,
        repo: this.model.toJSON()
      };
    },
    checkAlreadyExist: function () {
      var alreadyExist = reviewCollection.where({
        repo: this.model.get('name'),
        branch: this.getBranch(),
        contributor: this.getContributor()
      });
      if (alreadyExist.length > 0) {
        this.disableButton();
      } else {
        this.enableButton();
      }
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
      reviewCollection.create({
        user: this.model.get('owner').login,
        repo: this.model.get('name'),
        branch: this.getBranch(),
        contributor: this.getContributor()
      });
    },
    getFurtherInformations: function () {
      var promises = [];
      promises.push(this.model.getBranches());
      promises.push(this.model.getContributors());
      return promises;
    },
    render: function () {
      app.showIndicator(false);
      this.$el.html(this.template(this.serialize()));
      this.checkAlreadyExist();
    }
  });

  return RepoView;
});
