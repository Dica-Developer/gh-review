/*global define*/
define([
  'backbone',
  'underscore',
  'when',
  'text!../templates/edit-comment-box.html',
  'text!../templates/show-comment-box.html'
], function(Backbone, _, when, editTemplate, showTemplate){
  'use strict';

  var ShowCommentBoxView = Backbone.View.extend({
    template: _.template(showTemplate),
    tagName: 'tr',
    events: {
    },
    initialize: function(){
      this.render();
    },
    render: function(){
      this.$el.html(this.template(this.options.comment));
      this.options.tr.after(this.$el);
      return this;
    }
  });

  var EditCommentBoxView = Backbone.View.extend({
    template: _.template(editTemplate),
    tagName: 'tr',
    events: {
      'click #submitLineComment': 'submitLineComment',
      'click #cancelComment': 'cancelCommenting'
    },
    initialize: function(){
      this.render();
    },
    render: function(){
      this.$el.html(this.template());
      this.options.tr.after(this.$el);
      return this;
    },
    submitLineComment: function(){
      var _this = this;
      var comment = this.$el.find('#commentBox > textarea').val();
      if(comment !== ''){
        when(this.model.addLineComment(this.options.fileIndex, this.options.position, comment))
        .then(function(){
          _this.remove();
        });
      }
    },
    cancelCommenting: function(){
      this.remove();
    }
  });

  return {
    edit: EditCommentBoxView,
    show: ShowCommentBoxView
  };
});
