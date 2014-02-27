/*global define*/
define([
  'backbone',
  'underscore',
  'when',
  'base64',
  'app',
  'text!templates/about.html'
], function (Backbone, _, when, base64, app, template) {
  'use strict';

  return Backbone.View.extend({
    el: '#main',
    template: _.template(template),
    changeLog: '',
    getChangeLog: function () {
      var defer = when.defer();
      this.getMarkdownChangeLog()
        .then(this.getRenderedChangeLog.bind(this))
        .then(function (renderedChangeLog) {
          this.changeLog = renderedChangeLog;
          defer.resolve();
        }.bind(this));
      return defer.promise;
    },
    getMarkdownChangeLog: function () {
      var defer = when.defer();
      app.github.repos.getContent({
        user: 'Dica-Developer',
        repo: 'gh-review',
        path: 'changelog.md',
        headers: {
          'accept': 'application/vnd.github.VERSION+json'
        }
      }, function (error, resp) {
        if (!error) {
          defer.resolve(resp.content);
        } else {
          defer.reject(error);
        }
      });
      return defer.promise;
    },
    getRenderedChangeLog: function (content) {
      var defer = when.defer();
      var decodedContent = base64.decode(content);
      app.github.markdown.render({
        text: decodedContent,
        mode: 'gfm',
        context: 'Dica-Developer/gh-review'
      }, function (error, resp) {
        if (!error) {
          defer.resolve(resp.data);
        } else {
          defer.reject(error);
        }
      });
      return defer.promise;
    },
    render: function () {
      this.$el.html(this.template({changeLog: this.changeLog}));
    }
  });

});