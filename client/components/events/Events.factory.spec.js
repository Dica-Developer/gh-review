describe('Factory: Events', function () {
  'use strict';

  var Events, $timeout, filter = {
      getId: function () {
        return 'filter-id';
      },
      getOwner: function () {
      },
      getRepo: function () {
      },
      getBranch: function () {
        return 'test_branch';
      },
      isHealthy: function () {
      },
      invalidateCommitsCache: function () {

      }
    },
    eventsList = [
      {
        type: 'PushEvent',
        payload: {
          ref: '',
          commits: [
            {
              sha: '1.1'
            }, {
              sha: '1.2'
            }]
        }
      }, {
        type: 'PushEvent',
        payload: {
          ref: '',
          commits: [{
            sha: '2.1'
          }]
        }
      }, {
        type: 'CommitCommentEvent',
        payload: {}
      }
    ];

  beforeEach(module('GHReview'));

  beforeEach(inject(function ($injector) {
    Events = $injector.get('Events');
    $timeout = $injector.get('$timeout');
  }));

  afterEach(function () {
    localStorage.clear();
  });

  it('Should be defined', function () {
    expect(Events).toBeDefined();
  });

  it('Should not call .getEvents if filter is not healthy', function () {
    spyOn(Events.prototype, 'getEvents');
    spyOn(filter, 'isHealthy').and.returnValue(false);

    new Events(filter);

    expect(Events.prototype.getEvents).not.toHaveBeenCalled();
  });

  it('Should call .getEvents if filter is healthy', function () {
    spyOn(Events.prototype, 'getEvents');
    spyOn(filter, 'isHealthy').and.returnValue(true);

    new Events(filter);

    expect(Events.prototype.getEvents).toHaveBeenCalled();
  });

  it('Should apply value from local storage', function () {
    var events = new Events(filter),
      testDate = new Date().getTime(),
      storedValues = {
        events: [1, 2, 3],
        etag: 'test-etag',
        lastUpdate: testDate
      };

    expect(events.events).toEqual([]);
    expect(events.etag).toBe('');

    localStorage.setItem('ghreview.events-filter-id', JSON.stringify(storedValues));
    events = new Events(filter);

    expect(events.events).toEqual([1, 2, 3]);
    expect(events.etag).toBe('test-etag');
    expect(events.lastUpdate).toBe(testDate);
  });

  describe('.save', function () {

    it('Should store values to local storage', function () {
      var events = new Events(filter),
        preSave = localStorage.getItem('ghreview.events-filter-id'),
        postSave;

      expect(preSave).toBeNull();

      events.save();

      postSave = localStorage.getItem('ghreview.events-filter-id');

      expect(postSave).not.toBeNull();
    });

    it('Should set new update date', function (done) {
      var events = new Events(filter),
        preSave = events.lastUpdate,
        postSave;

      window.setTimeout(function () {
        events.save();
        postSave = events.lastUpdate;
        expect(postSave > preSave).toBe(true);
        done();
      }, 500);
    });

  });

  describe('.remove', function () {

    it('Should delete entry from local storage', function () {
      var events = new Events(filter),
        preSave = localStorage.getItem('ghreview.events-filter-id'),
        postSave, postRemove = true;

      expect(preSave).toBeNull();

      events.save();

      postSave = localStorage.getItem('ghreview.events-filter-id');

      expect(postSave).not.toBeNull();

      events.remove();

      postRemove = localStorage.getItem('ghreview.events-filter-id');

      expect(postRemove).toBeNull();
    });

  });

  describe('.markAllCommitsAsRead', function () {

    it('Should remove all PushEvents from events list', function () {
      var events = new Events(filter);
      events.events = eventsList;

      expect(events.events.length).toBe(3);

      events.markAllCommitsAsRead();

      expect(events.events.length).toBe(1);
    });

    it('Should save updated events list', function () {
      var events = new Events(filter);
      spyOn(events, 'save');

      events.markAllCommitsAsRead();

      expect(events.save).toHaveBeenCalled();
    });

  });

  describe('.getPushEvents', function () {

    it('Should return list PushEvents', function () {
      var events = new Events(filter), pushEvents;
      events.events = eventsList;
      pushEvents = events.getPushEvents();

      expect(pushEvents.length).toBe(2);
    });

  });

  describe('.getCommits', function () {

    it('Should return list of commits of all PushEvents', function () {
      var events = new Events(filter), commits;
      events.events = eventsList;
      commits = events.getCommits();

      expect(commits.length).toBe(3);
    });

  });

  describe('.getCommitCommentEvent', function () {

    it('Should return list of commits of all CommitCommentEvent', function () {
      var events = new Events(filter), comments;
      events.events = eventsList;
      comments = events.getCommitCommentEvent();

      expect(comments.length).toBe(1);
    });

  });

  describe('.removeCommit', function () {

    it('Should remove commit from commit list of PushEvent', function () {
      var events = new Events(filter), commits;
      events.events = eventsList;
      commits = events.getCommits();

      expect(commits.length).toBe(3);

      events.removeCommit('1.1');
      commits = events.getCommits();

      expect(commits.length).toBe(2);

    });

    it('Should remove event id commit list is empty', function () {
      var events = new Events(filter), pushEvents;
      events.events = eventsList;

      pushEvents = events.getPushEvents();

      expect(pushEvents.length).toBe(2);

      events.removeCommit('2.1');
      pushEvents = events.getPushEvents();

      expect(pushEvents.length).toBe(1);

    });

    it('Should save updated events list', function () {
      var events = new Events(filter);
      spyOn(events, 'save');

      events.removeCommit('2.1');

      expect(events.save).toHaveBeenCalled();
    });

  });

  describe('.preFilter', function () {

    it('Should call .getCommits after a timeout of 1min', function () {
      var events = new Events(filter);
      spyOn(events, 'getEvents');
      events.events = eventsList;
      events.preFilter({
        etag: '',
        result: []
      });

      expect(events.getEvents).not.toHaveBeenCalled();

      $timeout.flush(60000);

      expect(events.getEvents).toHaveBeenCalled();
    });

    it('Should update etag', function () {
      var events = new Events(filter);

      expect(events.etag).toBe('');

      events.preFilter({
        etag: 'new-etag',
        result: []
      });

      expect(events.etag).toBe('new-etag');

    });

    it('Should proccess filter only if result is an Array', function () {
      var events = new Events(filter);
      spyOn(events, 'save');

      events.preFilter({
        etag: 'new-etag',
        result: {}
      });

      expect(events.save).not.toHaveBeenCalled();

      events.preFilter({
        etag: 'new-etag',
        result: []
      });

      expect(events.save).toHaveBeenCalled();
    });

    it('Should invalidate commits cache if a new event is registered', function () {
      var events = new Events(filter),
        lastUpdate = events.lastUpdate,
        eventListCopy = JSON.parse(JSON.stringify(eventsList));
      /*jshint camelcase:false*/
      eventListCopy[0].created_at = new Date(lastUpdate + 1000).toISOString();
      eventListCopy[1].created_at = new Date(lastUpdate + 1000).toISOString();
      eventListCopy[2].created_at = new Date(lastUpdate - 1000).toISOString();
      eventListCopy[0].payload.ref = 'refs/heads/test_branch';
      eventListCopy[1].payload.ref = 'refs/heads/not-matching';
      eventListCopy[2].payload.ref = 'refs/heads/test_branch';

      spyOn(filter, 'invalidateCommitsCache');

      events.preFilter({
        etag: 'new-etag',
        result: []
      });

      expect(filter.invalidateCommitsCache).not.toHaveBeenCalled();

      events.preFilter({
        etag: 'new-etag',
        result: eventListCopy
      });

      expect(filter.invalidateCommitsCache).toHaveBeenCalled();
    });

  });

  describe('.filterByDate', function () {

    it('Should return events if event is younger then Events.lastUpdate', function () {
      var events = new Events(filter),
        lastUpdate = events.lastUpdate,
        eventListCopy = JSON.parse(JSON.stringify(eventsList));
      /*jshint camelcase:false*/
      eventListCopy[0].created_at = new Date(lastUpdate + 1000).toISOString();
      eventListCopy[1].created_at = new Date(lastUpdate + 1000).toISOString();
      eventListCopy[2].created_at = new Date(lastUpdate - 1000).toISOString();

      var eventsFilteredByDate = events.filterByDate(eventListCopy);

      expect(eventListCopy.length).toBe(3);
      expect(eventsFilteredByDate.length).toBe(2);
    });
  });

  describe('.filterByBranch', function () {

    it('Should return events if event has same branch as Filter', function () {
      var events = new Events(filter),
        eventListCopy = JSON.parse(JSON.stringify(eventsList));
      /*jshint camelcase:false*/
      eventListCopy[0].payload = undefined;
      eventListCopy[1].payload.ref = undefined;
      eventListCopy[2].payload.ref = 'refs/heads/not-matching';

      var eventsFilteredByBranch = events.filterByBranch(eventListCopy);

      expect(eventListCopy.length).toBe(3);
      expect(eventsFilteredByBranch.length).toBe(0);

      eventListCopy = JSON.parse(JSON.stringify(eventsList));

      eventListCopy[0].payload.ref = 'refs/heads/test_branch';
      eventListCopy[1].payload.ref = 'refs/heads/not-matching';
      eventListCopy[2].payload.ref = 'refs/heads/test_branch';

      eventsFilteredByBranch = events.filterByBranch(eventListCopy);

      expect(eventsFilteredByBranch.length).toBe(2);
    });
  });

});