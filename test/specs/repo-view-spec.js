/*global define, describe, it, expect, beforeEach, afterEach*/
define(['RepoView', 'RepoCollection', 'RepoModel'], function (RepoView, RepoCollection, RepoModel) {
  'use strict';

  describe('#RepoView', function () {

    var sandbox = null;

    beforeEach(function () {
      sandbox = $('<div id="main"></div>');
      sandbox.appendTo('body');
    });

    afterEach(function () {
      sandbox.remove();
    });

    it('Should be defined', function () {
      expect(RepoView).toBeDefined();
    });

    it('Init', function () {
      var repoCollection = new RepoCollection();
      repoCollection.add(new RepoModel({
        private: true,
        organization: false,
        owner: {
          login: 'b'
        },
        name: 'p ri vate'
      }));
      repoCollection.add(new RepoModel({
        private: false,
        organization: false,
        owner: {
          login: 'a'
        },
        name: 'public'
      }));
      repoCollection.add(new RepoModel({
        private: false,
        organization: true,
        owner: {
          login: 'c'
        },
        name: 'organization public'
      }));
      repoCollection.add(new RepoModel({
        private: true,
        organization: true,
        owner: {
          login: 'c'
        },
        name: 'organization private'
      }));
      new RepoView({
        collection: repoCollection
      });
      var a = sandbox.find('.list-group-item');
      expect(a.length).toBe(4);
      expect(a[0].href).toBe('http://localhost:9876/context.html#repository/public');
      expect(a[1].href).toBe('http://localhost:9876/context.html#repository/p ri vate');
      expect(a[2].href).toBe('http://localhost:9876/context.html#repository/organization public');
      expect(a[3].href).toBe('http://localhost:9876/context.html#repository/organization private');
    });

    it('Init', function () {
      var repoCollection = new RepoCollection();
      repoCollection.add(new RepoModel({
        private: false,
        organization: false,
        owner: {
          login: 'b'
        },
        name: '1'
      }));
      new RepoView({
        collection: repoCollection
      });
      var a = sandbox.find('.list-group-item');
      expect(a.length).toBe(1);
      expect(a[0].href).toBe('http://localhost:9876/context.html#repository/1');

      repoCollection.add(new RepoModel({
        private: false,
        organization: false,
        owner: {
          login: 'b'
        },
        name: '2'
      }));

      a = sandbox.find('.list-group-item');
      expect(a.length).toBe(2);
      expect(a[0].href).toBe('http://localhost:9876/context.html#repository/1');
      expect(a[1].href).toBe('http://localhost:9876/context.html#repository/2');
    });
  });

});