/*global Github*/
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
    localStorage.setItem('ghreview.accessToken', '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad');
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