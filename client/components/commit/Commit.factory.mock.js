(function (angular) {
  'use strict';

  angular.module('CommitMock', [])
    .factory('Commit', function (Comment) {


      function Commit(options) {
        this.options = options;
        this.prepareComments = function(comments){
          this.comments = comments.reduce(function (initialValue, comment) {
            if (comment.path === '' || comment.path === null) {
              initialValue.push(new Comment(comment));
            }
            return initialValue;
          }, []);
        };
      }

      Commit.prototype.updateComments = function () {

      };

      Commit.prototype.approve = function () {

      };

      Commit.prototype.unapprove = function () {

      };

      Commit.prototype.getApprover = function () {
        return [];
      };
      

      return Commit;
    });
}(angular));