/*global define*/
define([
  'backbone',
  'underscore',
  'when',
  'text!../templates/comment-box.html'
], function(Backbone, _, when, template){
  'use strict';

  var CommentBoxView = Backbone.View.extend({
    template: _.template(template),
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
      var comment = this.$el.find('#commentBox > textarea').val();
      if(comment !== ''){
        when(this.model.addLineComment(this.options.fileIndex, this.options.position, comment))
        .then(function(){
          console.log('Comment success');
        });
      }
    },
    cancelCommenting: function(){
      this.remove();
    }
  });

  return CommentBoxView;
});
