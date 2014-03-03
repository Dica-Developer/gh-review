/*global define, describe, it, expect, spyOn, beforeEach, afterEach*/
define(function (require) {
  'use strict';

  var $ = require('jquery');
  var app = require('app');
  var RepoDetailView = require('RepoDetailView');
  var FilterModel = require('FilterModel');
  var RepoModel = require('RepoModel');
  var moment = require('moment');

  var sandbox = null;

  describe('#RepoDetailView', function () {
    var repoModel = new RepoModel({name: 'test', owner: {login: 'test2'}});
    var filterModelSpy = null;
    beforeEach(function () {
      spyOn(RepoModel.prototype, 'getBranches');
      spyOn(RepoModel.prototype, 'getContributors');
      filterModelSpy = spyOn(FilterModel.prototype, 'initialize');
      app.filterCollection = {
        on: function () {
        }
      };
      sandbox = $('<div id="main"></div>');
      sandbox.appendTo('body');
    });

    afterEach(function () {
      app.filterCollection = null;
      sandbox.remove();
    });

    it('Should be defined', function () {
      expect(RepoDetailView).toBeDefined();
    });

    describe('.initialize', function () {

      it('should call #FilterModel.initialize', function () {
        new RepoDetailView({model: repoModel});
        expect(filterModelSpy).toHaveBeenCalled();
      });

      it('should call #FilterModel.set with {owner: "test2"}', function () {
        var filterModelSetSpy = spyOn(FilterModel.prototype, 'set');
        new RepoDetailView({model: repoModel});
        expect(filterModelSetSpy.calls[1].args).toEqual([ 'owner', 'test2' ]);
      });

      it('should call #FilterModel.set with {repo: "test"}', function () {
        var filterModelSetSpy = spyOn(FilterModel.prototype, 'set');
        new RepoDetailView({model: repoModel});
        expect(filterModelSetSpy.calls[2].args).toEqual([ 'repo', 'test' ]);
      });

      it('should call #RepoDetailView.getFurtherInformations', function () {
        var getFurtherInformationSpy = spyOn(RepoDetailView.prototype, 'getFurtherInformations');
        new RepoDetailView({model: repoModel});
        expect(getFurtherInformationSpy).toHaveBeenCalled();
      });

    });

    describe('.checkAlreadyExist', function () {

      beforeEach(function () {
        app.filterCollection = {
          where: function () {
          },
          on: function () {
          }
        };
      });

      afterEach(function () {
        app.filterCollection = null;
      });

      it('should call #RepoDetailView.disableButton if filter already exist', function () {
        app.filterCollection.where = function () {
          return [1];
        };

        var disableButtonSpy = spyOn(RepoDetailView.prototype, 'disableButton');
        var repoDetailView = new RepoDetailView({model: repoModel});
        repoDetailView.checkAlreadyExist();
        expect(disableButtonSpy).toHaveBeenCalled();

      });

      it('should not call #RepoDetailView.disableButton if filter not exist', function () {
        app.filterCollection.where = function () {
          return [];
        };

        var disableButtonSpy = spyOn(RepoDetailView.prototype, 'disableButton');
        var repoDetailView = new RepoDetailView({model: repoModel});
        repoDetailView.checkAlreadyExist();
        expect(disableButtonSpy).not.toHaveBeenCalled();

      });

    });

    describe('.addBranch', function () {

      it('should call #RepoDetailView.set with ["branch", "master" ]', function () {
        var repoDetailView = new RepoDetailView({model: repoModel});
        var setSpy = spyOn(FilterModel.prototype, 'set');
        repoDetailView.addBranch();
        expect(setSpy).toHaveBeenCalledWith('branch', 'master');
      });

    });

    describe('.addContributor', function () {

      it('should call #RepoDetailView.set with ["contributor", " " ]', function () {
        var repoDetailView = new RepoDetailView({model: repoModel});
        var setSpy = spyOn(FilterModel.prototype, 'set');
        repoDetailView.addContributor();
        expect(setSpy).toHaveBeenCalledWith('contributor', ' ');
      });

    });

    describe('.addSince', function () {

      it('should call #RepoDetailView.set with ["since", { amount : 1, pattern : "weeks" } ]', function () {
        var repoDetailView = new RepoDetailView({model: repoModel});
        var setSpy = spyOn(FilterModel.prototype, 'set');
        repoDetailView.addSince();
        expect(setSpy).toHaveBeenCalledWith('since', {amount: 1, pattern: 'weeks'});
      });

    });

    describe('.addUntil', function () {

      it('should call #RepoDetailView.set with ["until", < current moment object > ]', function () {
        var repoDetailView = new RepoDetailView({model: repoModel});
        var setSpy = spyOn(FilterModel.prototype, 'set');

        repoDetailView.addUntil();
        var currentMoment = moment().unix();

        expect(setSpy).toHaveBeenCalled();

        var argsMilliseconds = setSpy.argsForCall[0][1].unix();
        expect(argsMilliseconds).toBeGreaterThan(currentMoment - 10);
        expect(argsMilliseconds).toBeLessThan(currentMoment + 10);
      });

    });

    describe('.addPath', function () {

      it('should call #RepoDetailView.set with ["path", " "]', function () {
        var repoDetailView = new RepoDetailView({model: repoModel});
        var setSpy = spyOn(FilterModel.prototype, 'set');
        repoDetailView.addPath();
        expect(setSpy).toHaveBeenCalledWith('path', ' ');
      });

    });

    describe('.changeUntil', function () {

      it('should call #RepoDetailView.set with ["until", < current moment object > ]', function () {
        var repoDetailView = new RepoDetailView({model: repoModel});
        var setSpy = spyOn(FilterModel.prototype, 'set');

        repoDetailView.changeUntil();
        expect(setSpy).toHaveBeenCalled();

        var currentMoment = moment().unix();
        var argsMilliseconds = setSpy.argsForCall[0][1].unix();
        expect(argsMilliseconds).toBeGreaterThan(currentMoment - 10);
        expect(argsMilliseconds).toBeLessThan(currentMoment + 10);
      });

    });

    describe('.changePath', function () {

      it('should call #RepoDetailView.set with ["path", " "]', function () {
        var repoDetailView = new RepoDetailView({model: repoModel});
        var setSpy = spyOn(FilterModel.prototype, 'set');
        repoDetailView.changePath();
        expect(setSpy).toHaveBeenCalledWith('path', ' ');
      });

    });

    describe('.changeBranch', function () {

      it('should call #RepoDetailView.set with ["branch", "test"]', function () {
        var repoDetailView = new RepoDetailView({model: repoModel});
        var setSpy = spyOn(FilterModel.prototype, 'set');
        var target = $('<select><option value="test" selected="selected"></option></select>');
        repoDetailView.changeBranch(target);
        expect(setSpy).toHaveBeenCalledWith('branch', 'test');
      });

    });

    describe('.changeContributor', function () {

      it('should call #RepoDetailView.set with ["contributor", "test"]', function () {
        var repoDetailView = new RepoDetailView({model: repoModel});
        var setSpy = spyOn(FilterModel.prototype, 'set');
        var target = $('<select><option value="test" selected="selected"></option></select>');
        repoDetailView.changeContributor(target);
        expect(setSpy).toHaveBeenCalledWith('contributor', 'test');
      });

    });

    describe('.changeSince', function () {

      it('should call #RepoDetailView.set with [ "since", {amount: 0, pattern: "year"}]', function () {
        var repoDetailView = new RepoDetailView({model: repoModel});
        var setSpy = spyOn(FilterModel.prototype, 'set');
        var target = $('<select><option value="year" selected="selected"></option></select>');
        repoDetailView.changeSince(target);
        expect(setSpy).toHaveBeenCalledWith('since', {amount: 0, pattern: 'year'});
      });

      it('should call #RepoDetailView.set with [ "since", {amount: "23", pattern : "year"}]', function () {
        var repoDetailView = new RepoDetailView({model: repoModel});
        var setSpy = spyOn(FilterModel.prototype, 'set');
        var target = $('<input type="text" value="23" />');
        repoDetailView.changeSince(target);
        expect(setSpy).toHaveBeenCalledWith('since', {amount: '23', pattern: 'year'});
      });

    });

    describe('.addFilter', function () {

      it('should call #RepoDetailView.addBranch', function () {
        var repoDetailView = new RepoDetailView({model: repoModel});
        var addBranchSpy = spyOn(RepoDetailView.prototype, 'addBranch');
        var button = $('<button class="filter" data-filter="branch"></button>');
        repoDetailView.$el.append(button);
        button.click();
        expect(addBranchSpy).toHaveBeenCalled();
      });

    });

    describe('.changeFilter', function () {

      it('should call #RepoDetailView.addBranch', function () {
        var repoDetailView = new RepoDetailView({model: repoModel});
        var changeFilterSpy = spyOn(RepoDetailView.prototype, 'changeBranch');
        var input = $('<input type="text" class="filterSelector" data-filter="branch" />');
        repoDetailView.$el.append(input);
        input.change();
        expect(changeFilterSpy).toHaveBeenCalled();
      });

    });

    describe('.disableButton', function () {

      it('should disable button', function () {
        var repoDetailView = new RepoDetailView({model: repoModel});
        var button = $('<button id="addReview"></button>');
        expect(button.is(':disabled')).toBeFalsy();
        repoDetailView.$el.append(button);
        repoDetailView.disableButton();
        expect(button.is(':disabled')).toBeTruthy();
      });

    });

    describe('.enableButton', function () {

      it('should enable button', function () {
        var repoDetailView = new RepoDetailView({model: repoModel});
        var button = $('<button id="addReview" disabled="disabled"></button>');
        expect(button.is(':disabled')).toBeTruthy();
        sandbox.append(button);
        repoDetailView.enableButton();
        expect(button.is(':disabled')).toBeFalsy();
      });

    });

    describe('.getBranch', function () {

      it('should return "test"', function () {
        var repoDetailView = new RepoDetailView({model: repoModel});
        var select = $('<select id="branchList"><option value="bla"></option><option value="test" selected="selected"></option></select>');
        sandbox.append(select);
        expect(repoDetailView.getBranch()).toBe('test');
      });

    });

    describe('.getContributor', function () {

      it('should return "test"', function () {
        var repoDetailView = new RepoDetailView({model: repoModel});
        var select = $('<select id="contributorsList"><option value="bla"></option><option value="test" selected="selected"></option></select>');
        sandbox.append(select);
        expect(repoDetailView.getContributor()).toBe('test');
      });

    });

  });
});
