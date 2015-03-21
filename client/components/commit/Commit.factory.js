(function (angular) {
  'use strict';

  angular.module('GHReview')
    .factory('Commit', ['$injector',
      function ($injector) {

        var $q = $injector.get('$q'),
          _ = $injector.get('_'),
          ghCommits = $injector.get('ghCommits'),
          ghComments = $injector.get('ghComments'),
          Comment = $injector.get('Comment'),
          options = $injector.get('options'),
          File = $injector.get('File');


        function Commit(options) {
          this.options = options;
        }

        Commit.prototype.prepareForView = function () {
          return ghCommits.bySha(this.options)
            .then(this.processCommit.bind(this))
            .then(this.getComments.bind(this))
            .then(this.processComments.bind(this))
            .then(this.returnSelf.bind(this));
        };

        Commit.prototype.returnSelf = function () {
          return $q.when(this);
        };

        Commit.prototype.processCommit = function (commit) {
          this.commitData = commit;
          this.files = _.map(this.commitData.files, function (file) {
            return new File(file);
          });
          return $q.when();
        };

        Commit.prototype.getComments = function () {
          return ghComments.getForCommit(this.options);
        };

        Commit.prototype.processComments = function (comments) {
          var editInformations = {
              user: this.options.user,
              repo: this.options.repo
            },
            files = this.files;

          //TODO should be optimized by not looping over comments again and again, one loop is enough

          this.comments = comments.reduce(function (initialValue, comment) {
            if (comment.path === '' || comment.path === null) {
              comment.editInformations = editInformations;
              initialValue.push(new Comment(comment));
            }
            return initialValue;
          }, []);

          var lineComments = comments.reduce(function (initialValue, comment) {
            if (comment.path !== '' && comment.path !== null) {
              comment.editInformations = editInformations;
              initialValue.push(comment);
            }
            return initialValue;
          }, []);

          lineComments.forEach(function (comment) {
            var file = _.findWhere(files, { filename: comment.path });
            if(file){
              file.addLineComment(comment.position, new Comment(comment));
            }
          });

          return $q.when();
        };

        Commit.prototype.updateComments = function () {
          return this.getComments()
            .then(this.processComments.bind(this));
        };

        Commit.prototype.approve = function (user) {
          var defer = $q.defer(),
            self = this;
          var commitState = JSON.stringify({
              version: options.ghReview.version,
              approved: true,
              approver: user.login,
              approvalDate: Date.now()
            }, null, 2),
            comment = '```json\n' + commitState + '\n```\napproved with [gh-review](http://gh-review.herokuapp.com/)';

          ghComments.addCommitComment(self.options.sha, self.options.user, self.options.repo, comment)
            .then(defer.resolve);
          return defer.promise;
        };

        Commit.prototype.unapprove = function (user) {

          var approvedComment = _.find(this.comments, function (comment) {
            return comment.isApproval() && comment.getApprover().indexOf(user.login) > -1;
          }, this);

          return approvedComment.remove();
        };

        Commit.prototype.getApprover = function () {
          if (!this.comments) {
            return [];
          }
          return _.reduce(this.comments, function (result, comment) {
            var approver = comment.getApprover();
            if (approver) {
              result.push(approver);
            }
            return result;
          }, []);
        };

        Commit.prototype.isApprovedByUser = function (user) {
          return user ? this.getApprover().indexOf(user.login) > -1 : false;
        };

        //getCommenter


        return Commit;
      }]);

}(angular));
