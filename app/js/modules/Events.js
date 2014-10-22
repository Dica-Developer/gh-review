(function (angular) {
  'use strict';

  angular.module('GHReview')
    .service('events', ['$interval', '_', 'eventCollector', 'filter', 'notificationsCollector', 'githubUserData', function($interval, _, eventCollector, filter, notificationsCollector, githubUserData) {

      var events = {},
        previousResult = null;

      var getEventsFromCollector = function(owner, repo){
        return eventCollector.get(owner, repo);
      };

      var splitEventsByType = function(result){
        if(!_.isEqual(result, previousResult)){
          previousResult = result;
          var allTypes = _.pluck(result, 'type'),
            types = _.uniq(allTypes);
          types.forEach(function(type){
            if(!events[type]){
              events[type] = [];
            }

            var eventsByType = _.filter(result, {type: type});

            events[type] = events[type].concat(eventsByType);
          });
        }
      };

      filter.getAll().forEach(function(filter){
        $interval(function(){
          getEventsFromCollector(filter.getOwner(), filter.getRepo())
            .then(splitEventsByType);
        }, eventCollector.pollInterval);
      });

      notificationsCollector.getNotificationsFromGithub(githubUserData.login).then(function (notifications) {
        events.NotificationsEvent = notifications;
      });

      return {
        CommitCommentEvent: function(){
          return events.CommitCommentEvent || null;
        },
        CreateEvent: function(){
          return events.CreateEvent || null;
        },
        DeleteEvent: function(){
          return events.DeleteEvent || null;
        },
        DeploymentEvent: function(){
          return events.DeploymentEvent || null;
        },
        DeploymentStatusEvent: function(){
          return events.DeploymentStatusEvent || null;
        },
        DownloadEvent: function(){
          return events.DownloadEvent || null;
        },
        FollowEvent: function(){
          return events.FollowEvent || null;
        },
        ForkEvent: function(){
          return events.ForkEvent || null;
        },
        ForkApplyEvent: function(){
          return events.ForkApplyEvent || null;
        },
        GistEvent: function(){
          return events.GistEvent || null;
        },
        GollumEvent: function(){
          return events.GollumEvent || null;
        },
        IssueCommentEvent: function(){
          return events.IssueCommentEvent || null;
        },
        IssuesEvent: function(){
          return events.IssuesEvent || null;
        },
        MemberEvent: function(){
          return events.MemberEvent || null;
        },
        PageBuildEvent: function(){
          return events.PageBuildEvent || null;
        },
        PublicEvent: function(){
          return events.PublicEvent || null;
        },
        PullRequestEvent: function(){
          return events.PullRequestEvent || null;
        },
        PullRequestReviewCommentEvent: function(){
          return events.PullRequestReviewCommentEvent || null;
        },
        PushEvent: function(){
          return events.PushEvent || null;
        },
        ReleaseEvent: function(){
          return events.ReleaseEvent || null;
        },
        StatusEvent: function(){
          return events.StatusEvent || null;
        },
        TeamAddEvent: function(){
          return events.TeamAddEvent || null;
        },
        WatchEvent: function(){
          return events.WatchEvent || null;
        },
        NotificationsEvent: function(){
          return events.NotificationsEvent || null;
        }
      };
    }]);

}(angular));
