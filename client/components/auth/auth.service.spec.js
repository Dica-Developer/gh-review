describe('Service: authenticated', function () {
  'use strict';

  beforeEach(module('GHReview'));

  var authenticated;

  beforeEach(inject(function ($injector) {
    authenticated = $injector.get('authenticated');
  }));

  afterEach(function () {
    localStorage.clear();
  });

  it('.get should return false if no access token is stored', function () {
    expect(authenticated.get()).toBeFalsy();
  });

  it('.get should return true if access token is stored', function () {
    localStorage.setItem('ghreview.accessToken', '6867f021346fd59d3df8972b186c5ded726ad4da');
    expect(authenticated.get()).toBeTruthy();
  });

  it('.set should store access token to local storage', function () {
    authenticated.set({
      'access_token': 'test-to-ken'
    });
    expect(localStorage.length).toBe(1);
    expect(localStorage['ghreview.accessToken']).toBe('test-to-ken');
  });

});